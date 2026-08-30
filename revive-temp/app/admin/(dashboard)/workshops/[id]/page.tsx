import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/getAdminSession'
import { adminGetWorkshopById } from '@/lib/data/workshopAdmin'
import { WorkshopForm } from '@/components/admin/workshops/WorkshopForm'

export const metadata: Metadata = { title: 'Edit Workshop' }

export default async function EditWorkshopPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const workshop = await adminGetWorkshopById(id)

  if (!workshop) {
    notFound()
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Edit Workshop</h2>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] mt-0.5">{workshop.title}</p>
      </div>
      
      <div className="bg-[#111312] border border-white/[0.07] p-6">
        <WorkshopForm initialData={workshop} isEdit />
      </div>
    </div>
  )
}
