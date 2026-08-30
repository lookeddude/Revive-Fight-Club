import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/getAdminSession'
import { adminGetRegistrations } from '@/lib/data/workshopAdmin'
import { RegistrationsTable } from '@/components/admin/workshops/RegistrationsTable'

export const metadata: Metadata = { title: 'Workshop Registrations' }

export default async function WorkshopRegistrationsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id: workshopId } = await params
  const { registrations, total } = await adminGetRegistrations(workshopId)

  return (
    <div className="max-w-6xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Registrations</h2>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] mt-0.5">{total} registration{total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/admin/workshops/${workshopId}/attendance`} className="bg-white/10 text-white font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white/20 transition-colors">
            Attendance Mode
          </Link>
          <a href={`/api/workshops/export/${workshopId}`} target="_blank" rel="noreferrer" className="bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">
            Export CSV
          </a>
        </div>
      </div>

      <RegistrationsTable workshopId={workshopId} registrations={registrations || []} />
    </div>
  )
}
