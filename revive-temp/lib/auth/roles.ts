/**
 * Pure role types and helpers — no server imports.
 * Safe to use in both server and client components.
 */

export type AdminRole = 'superadmin' | 'admin' | 'manager' | 'receptionist'

export const ALL_STAFF_ROLES: AdminRole[] = ['superadmin', 'admin', 'manager', 'receptionist']

/** Which roles a given role can invite */
export function invitableRoles(role: AdminRole): AdminRole[] {
  if (role === 'superadmin') return ['superadmin', 'admin', 'receptionist']
  if (role === 'admin') return ['admin', 'receptionist']
  return []
}

export function canInvite(role: AdminRole): boolean {
  return role === 'superadmin' || role === 'admin'
}
