import { createClient } from '@/lib/supabase/server'
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
 * Returns null if not authenticated or no valid profile.
 */
export async function getAdminSession(): Promise<AdminProfile | null> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: profileError } = await (supabase as any)
      .from('profiles')
      .select('id, full_name, role, is_active')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || !profile.is_active) return null
    if (!ALL_STAFF_ROLES.includes(profile.role as AdminRole)) return null

    return {
      id: user.id,
      full_name: profile.full_name,
      role: profile.role as AdminRole,
      is_active: profile.is_active,
      email: user.email ?? '',
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
