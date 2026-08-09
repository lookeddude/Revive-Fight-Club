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
 * Logic:
 * 1. User is authenticated via Supabase Auth.
 * 2. If they already have an active staff profile → return it immediately.
 * 3. If no valid staff profile → check staff_invitations by email.
 *    If a non-expired pending invite exists → auto-apply role, mark accepted.
 * 4. Otherwise → return null (not authorised).
 *
 * This means invited users just log in normally — no invite link required.
 */
export async function getAdminSession(): Promise<AdminProfile | null> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return null

    // ── 1. Check existing profile ─────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('id, full_name, role, is_active')
      .eq('id', user.id)
      .maybeSingle()

    // Valid active staff profile → done
    if (profile && profile.is_active && ALL_STAFF_ROLES.includes(profile.role as AdminRole)) {
      return {
        id: user.id,
        full_name: profile.full_name,
        role: profile.role as AdminRole,
        is_active: true,
        email: user.email ?? '',
      }
    }

    // ── 2. No valid staff profile → check for pending invitation by email ─────
    if (!user.email) return null

    const adminClient = createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: invite } = await (adminClient as any)
      .from('staff_invitations')
      .select('id, role, expires_at')
      .eq('email', user.email.toLowerCase())
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (!invite) return null

    // ── 3. Invitation matched → apply role & mark accepted ────────────────────
    const displayName: string =
      (profile?.full_name as string | null) ??
      ((user.user_metadata as Record<string, unknown>)?.full_name as string | undefined) ??
      user.email.split('@')[0]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any)
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: displayName,
        role: invite.role,
        is_active: true,
      })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any)
      .from('staff_invitations')
      .update({ status: 'accepted', accepted_at: new Date().toISOString() })
      .eq('id', invite.id)

    return {
      id: user.id,
      full_name: displayName,
      role: invite.role as AdminRole,
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
