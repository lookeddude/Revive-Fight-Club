import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/getAdminSession'
import { adminGetWorkshops } from '@/lib/data/workshopAdmin'
import { EmptyState } from '@/components/admin/EmptyState'
import { WorkshopsTable } from './WorkshopsTable'

export const metadata: Metadata = { title: 'Workshops' }

export default async function AdminWorkshopsPage() {
  await requireAdmin()
  const workshops = await adminGetWorkshops()

  return (
    <div className="max-w-6xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Workshops</h2>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] mt-0.5">{workshops?.length ?? 0} total</p>
        </div>
        <Link href="/admin/workshops/new" className="bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">+ New Workshop</Link>
      </div>

      {!workshops || workshops.length === 0 ? (
        <EmptyState title="No workshops yet" description="Create your first workshop to get started." action={
          <Link href="/admin/workshops/new" className="bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">+ New Workshop</Link>
        } />
      ) : (
        <WorkshopsTable workshops={workshops} />
      )}
    </div>
  )
}
