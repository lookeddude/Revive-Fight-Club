import type { Metadata } from 'next'
import { requireSuperAdminOrAdmin } from '@/lib/auth/getAdminSession'
import { AdminShell } from '@/components/admin/AdminShell'
import { getStaffProfiles, getInvitations } from '@/lib/actions/admin/invitations'
import { UserManagementClient } from './UserManagementClient'

export const metadata: Metadata = { title: 'User Management | RFC Admin' }

export default async function UsersPage() {
  const profile = await requireSuperAdminOrAdmin()
  const [staff, invitations] = await Promise.all([
    getStaffProfiles(),
    getInvitations(),
  ])

  return (
    <AdminShell title="User Management" profile={profile}>
      <UserManagementClient
        currentProfile={profile}
        staff={staff}
        invitations={invitations}
      />
    </AdminShell>
  )
}
