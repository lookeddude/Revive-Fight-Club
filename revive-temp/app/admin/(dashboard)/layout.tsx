import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth/getAdminSession'
import { AdminShell } from '@/components/admin/AdminShell'

export const metadata: Metadata = {
  title: {
    default: 'Admin | Revive Fight Club',
    template: '%s | RFC Admin',
  },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await requireAdmin()
  return (
    <AdminShell title="Revive Fight Club" profile={profile}>
      {children}
    </AdminShell>
  )
}
