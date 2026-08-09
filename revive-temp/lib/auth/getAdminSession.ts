import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import {
  type AdminRole,
  ALL_STAFF_ROLES,
  invitableRoles,
  canInvite,
} from '@/lib/auth/roles'

export type { AdminRole } from '@/lib/auth/roles'
export { invitableRoles, canInvite, ALL_STAFF_ROLES } from '@/lib/auth/roles'

export type AdminProfile = {
  id: string
  full_name: string | null
  role: AdminRole
  is_active: boolean
  email: string
}

/** Roles that can access the full admin panel */
export const ADMIN_ROLES: AdminRole[] = ['superadmin', 'admin', 'manager']

/**
 * Get the current admin session + profile.
 *
 * Flow:
 * 1. Get authenticated Supabase user.
 * 2. If they have a valid active staff profile → return immediately.
 * 3. If not → look up staff_invitations by email (non-expired, pending).
 * 4. If invite found → assign the role (persist with admin client), return profile.
 * 5. Otherwise → return null (not authorised).
 *
 * Invited users just log in normally — no invite link needed.
 * Works with email/password AND Google OAuth.
 */
export async function getAdminSession(): Promise<AdminProfile | null> {
  try {
    const supabase = await createClient()

    // ── Get authenticated user ──────────────────────────────────────────────
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || !user.email) return null

    // ── Check existing staff profile ────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('id, full_name, role, is_active')
      .eq('id', user.id)
      .maybeSingle()

    if (profile && profile.is_active && ALL_STAFF_ROLES.includes(profile.role as AdminRole)) {
      // Already a valid staff member — done
      return {
        id: user.id,
        full_name: profile.full_name,
        role: profile.role as AdminRole,
        is_active: true,
        email: user.email,
      }
    }

    // ── Check for pending invitation by email ───────────────────────────────
    // Use regular client — the RLS policy allows any authenticated user to read.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: invite } = await (supabase as any)
      .from('staff_invitations')
      .select('id, role, expires_at')
      .eq('email', user.email.toLowerCase())
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (!invite) return null // No pending invite → not authorised

    // ── Invitation matched — build the return profile ────────────────────────
    const assignedRole = invite.role as AdminRole
    const displayName: string =
      (profile?.full_name as string | null) ??
      ((user.user_metadata as Record<string, unknown>)?.full_name as string) ??
      user.email.split('@')[0]

    // ── Persist role assignment (best-effort — must not block login) ─────────
    // Uses service-role client to bypass RLS. If the service key isn't available
    // this try-catch ensures the user still gets access this session.
    try {
      const adminClient = createAdminClient()
      await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (adminClient as any).from('profiles').upsert({
          id: user.id,
          full_name: displayName,
          role: assignedRole,
          is_active: true,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (adminClient as any)
          .from('staff_invitations')
          .update({ status: 'accepted', accepted_at: new Date().toISOString() })
          .eq('id', invite.id),
      ])
    } catch (writeErr) {
      // Write failed (e.g. service key missing) — role applied for this session only.
      // Next login will retry. Log for debugging.
      console.error('[getAdminSession] Could not persist invite role assignment:', writeErr)
    }

    return {
      id: user.id,
      full_name: displayName,
      role: assignedRole,
      is_active: true,
      email: user.email,
    }
  } catch {
    return null
  }
}

/**
 * Require any authenticated staff session (all roles).
 * Redirects to /admin/login if no valid session.
 */
export async function requireAdmin(): Promise<AdminProfile> {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }
  return session
}

/**
 * Require superadmin or admin role.
 * Receptionist trying to access management pages gets redirected.
 */
export async function requireSuperAdminOrAdmin(): Promise<AdminProfile> {
  const session = await requireAdmin()
  if (session.role !== 'superadmin' && session.role !== 'admin') {
    redirect('/admin')
  }
  return session
}

/**
 * Require superadmin role only.
 */
export async function requireSuperAdmin(): Promise<AdminProfile> {
  const session = await requireAdmin()
  if (session.role !== 'superadmin') {
    redirect('/admin')
  }
  return session
}

/**
 * Require admin role specifically (not manager / receptionist).
 * Redirects to /admin if lower role tries to access admin-only pages.
 */
export async function requireAdminRole(): Promise<AdminProfile> {
  const session = await requireAdmin()
  if (session.role !== 'admin' && session.role !== 'superadmin') {
    redirect('/admin')
  }
  return session
}
