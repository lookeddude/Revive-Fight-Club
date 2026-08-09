'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin, invitableRoles, canInvite, type AdminRole } from '@/lib/auth/getAdminSession'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/actions/admin/activityLog'

export type Invitation = {
  id: string
  email: string
  role: AdminRole
  status: 'pending' | 'accepted' | 'expired'
  invited_by_name: string | null
  created_at: string
  expires_at: string
  accepted_at: string | null
}

export type StaffMember = {
  id: string
  full_name: string | null
  email: string
  role: AdminRole
  is_active: boolean
}

/** List all invitations — superadmin/admin only */
export async function getInvitations(): Promise<Invitation[]> {
  const profile = await requireAdmin()
  if (!canInvite(profile.role)) return []

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('staff_invitations')
    .select('id, email, role, status, expires_at, accepted_at, created_at, invited_by:profiles(full_name)')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map((row: {
    id: string; email: string; role: string; status: string;
    expires_at: string; accepted_at: string | null; created_at: string;
    invited_by: { full_name: string | null } | null
  }) => ({
    id: row.id,
    email: row.email,
    role: row.role as AdminRole,
    status: new Date(row.expires_at) < new Date() && row.status === 'pending'
      ? 'expired'
      : row.status as 'pending' | 'accepted' | 'expired',
    invited_by_name: row.invited_by?.full_name ?? null,
    created_at: row.created_at,
    expires_at: row.expires_at,
    accepted_at: row.accepted_at,
  }))
}

/** List all staff profiles — superadmin/admin only */
export async function getStaffProfiles(): Promise<StaffMember[]> {
  const profile = await requireAdmin()
  if (!canInvite(profile.role)) return []

  const adminClient = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: authData } = await (adminClient as any).auth.admin.listUsers()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profiles } = await (adminClient as any)
    .from('profiles')
    .select('id, full_name, role, is_active')
    .order('full_name', { ascending: true })

  if (!profiles) return []

  const emailMap = new Map<string, string>()
  if (authData?.users) {
    for (const u of authData.users as { id: string; email?: string }[]) {
      emailMap.set(u.id, u.email ?? '')
    }
  }

  return profiles.map((p: { id: string; full_name: string | null; role: string; is_active: boolean }) => ({
    id: p.id,
    full_name: p.full_name,
    email: emailMap.get(p.id) ?? '',
    role: p.role as AdminRole,
    is_active: p.is_active,
  }))
}

/** Create an invitation — enforces role hierarchy */
export async function createInvitation(
  email: string,
  role: AdminRole
): Promise<{ success: true; token: string; alreadyExisted: boolean } | { success: false; error: string }> {
  try {
    const profile = await requireAdmin()

    if (!canInvite(profile.role)) {
      return { success: false, error: 'You do not have permission to invite users.' }
    }

    const allowed = invitableRoles(profile.role)
    if (!allowed.includes(role)) {
      return { success: false, error: `Your role cannot invite a ${role}.` }
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { success: false, error: 'Invalid email address.' }
    }

    const adminClient = createAdminClient()

    // Check if pending invite already exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (adminClient as any)
      .from('staff_invitations')
      .select('id, status')
      .eq('email', normalizedEmail)
      .eq('status', 'pending')
      .maybeSingle()

    if (existing) {
      return { success: false, error: 'A pending invitation already exists for this email. Revoke it first.' }
    }

    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (adminClient as any)
      .from('staff_invitations')
      .insert({ email: normalizedEmail, role, invited_by: profile.id, token, status: 'pending', expires_at: expiresAt })

    if (insertError) return { success: false, error: 'Failed to create invitation.' }

    // Check if user already has an auth account
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: authData } = await (adminClient as any).auth.admin.listUsers()
    const existingUser = (authData?.users as { id: string; email?: string }[] ?? [])
      .find(u => u.email?.toLowerCase() === normalizedEmail)

    if (existingUser) {
      // Apply role immediately
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (adminClient as any).from('profiles').upsert({
        id: existingUser.id,
        full_name: (existingUser as { user_metadata?: { full_name?: string }; email?: string }).user_metadata?.full_name
          ?? normalizedEmail.split('@')[0],
        role,
        is_active: true,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (adminClient as any)
        .from('staff_invitations')
        .update({ status: 'accepted', accepted_at: new Date().toISOString() })
        .eq('token', token)

      revalidatePath('/admin/users')
      // Log immediate role assignment
      void logActivity(profile.id, profile.email, profile.role, 'invite_sent',
        `Invited ${normalizedEmail} as ${role} (account already existed — role applied immediately)`,
        { actionTarget: normalizedEmail, metadata: { role, alreadyExisted: true } })
      return { success: true, token, alreadyExisted: true }
    }

    revalidatePath('/admin/users')
    // Log invitation creation
    void logActivity(profile.id, profile.email, profile.role, 'invite_sent',
      `Invited ${normalizedEmail} as ${role}`,
      { actionTarget: normalizedEmail, metadata: { role, token } })
    return { success: true, token, alreadyExisted: false }
  } catch (err) {
    console.error('[createInvitation]', err)
    return { success: false, error: 'Unexpected error. Please try again.' }
  }
}

/** Revoke a pending invitation */
export async function revokeInvitation(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const profile = await requireAdmin()
    if (!canInvite(profile.role)) return { success: false, error: 'No permission.' }

    const adminClient = createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminClient as any).from('staff_invitations').delete().eq('id', id)
    if (error) return { success: false, error: error.message }

    revalidatePath('/admin/users')
    void logActivity(profile.id, profile.email, profile.role, 'invite_revoked',
      `Revoked invitation (id: ${id})`,
      { actionTarget: id })
    return { success: true }
  } catch {
    return { success: false, error: 'Unexpected error.' }
  }
}

/** Toggle a staff member active/inactive.
 * Superadmin can toggle anyone except themselves.
 * Admin can toggle admin/receptionist but NOT superadmin.
 */
export async function updateStaffStatus(
  profileId: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const actor = await requireAdmin()
    if (!canInvite(actor.role)) return { success: false, error: 'No permission.' }
    if (profileId === actor.id) return { success: false, error: 'Cannot change your own status.' }

    const adminClient = createAdminClient()

    // Fetch target's role to enforce hierarchy
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: target } = await (adminClient as any)
      .from('profiles').select('role').eq('id', profileId).maybeSingle()

    if (!target) return { success: false, error: 'User not found.' }

    // Admin cannot touch superadmin
    if (actor.role !== 'superadmin' && target.role === 'superadmin') {
      return { success: false, error: 'Only a superadmin can modify another superadmin.' }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminClient as any)
      .from('profiles').update({ is_active: isActive }).eq('id', profileId)
    if (error) return { success: false, error: error.message }

    revalidatePath('/admin/users')
    void logActivity(actor.id, actor.email, actor.role,
      isActive ? 'user_activated' : 'user_deactivated',
      `${isActive ? 'Activated' : 'Deactivated'} user (id: ${profileId}) [role: ${target.role}]`,
      { actionTarget: profileId, metadata: { targetRole: target.role, newStatus: isActive } })
    return { success: true }
  } catch {
    return { success: false, error: 'Unexpected error.' }
  }
}

/** Delete a staff member.
 * - Removes their profile row (removes admin access).
 * - Also deletes their Supabase auth account entirely.
 * - Superadmin can delete anyone (except themselves).
 * - Admin can delete admin/receptionist but NOT superadmin.
 */
export async function deleteStaffMember(
  profileId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const actor = await requireAdmin()
    if (!canInvite(actor.role)) return { success: false, error: 'No permission.' }
    if (profileId === actor.id) return { success: false, error: 'Cannot delete yourself.' }

    const adminClient = createAdminClient()

    // Fetch target's role to enforce hierarchy
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: target } = await (adminClient as any)
      .from('profiles').select('role').eq('id', profileId).maybeSingle()

    if (!target) return { success: false, error: 'User not found.' }

    // Admin cannot delete a superadmin
    if (actor.role !== 'superadmin' && target.role === 'superadmin') {
      return { success: false, error: 'Only a superadmin can delete another superadmin.' }
    }

    // Delete profile row (removes admin access)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any).from('profiles').delete().eq('id', profileId)

    // Also delete the Supabase auth user so they can re-register cleanly if needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any).auth.admin.deleteUser(profileId)

    revalidatePath('/admin/users')
    void logActivity(actor.id, actor.email, actor.role, 'user_deleted',
      `Permanently deleted user (id: ${profileId}) [role: ${target.role}]`,
      { actionTarget: profileId, metadata: { deletedRole: target.role } })
    return { success: true }
  } catch {
    return { success: false, error: 'Unexpected error.' }
  }
}
