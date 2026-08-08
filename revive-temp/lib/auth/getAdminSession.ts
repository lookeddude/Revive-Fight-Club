import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type AdminProfile = {
  id: string
  full_name: string | null
  role: 'admin' | 'manager'
  is_active: boolean
  email: string
}

/**
 * Get the current admin session + profile.
 * Returns null if not authenticated or no valid profile.
 * Does NOT redirect — use requireAdmin() for that.
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

    return {
      id: user.id,
      full_name: profile.full_name,
      role: profile.role as 'admin' | 'manager',
      is_active: profile.is_active,
      email: user.email ?? '',
    }
  } catch {
    return null
  }
}

/**
 * Require an authenticated admin/manager session.
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
 * Require admin role specifically (not manager).
 * Redirects to /admin if manager tries to access admin-only pages.
 */
export async function requireAdminRole(): Promise<AdminProfile> {
  const session = await requireAdmin()
  if (session.role !== 'admin') {
    redirect('/admin')
  }
  return session
}
