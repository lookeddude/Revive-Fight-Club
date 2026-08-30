import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth/getAdminSession'
import { WorkshopForm } from '@/components/admin/workshops/WorkshopForm'

export const metadata: Metadata = { title: 'New Workshop' }

export default async function NewWorkshopPage() {
  await requireAdmin()

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Create Workshop</h2>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] mt-0.5">Add a new workshop event</p>
      </div>
      
      <div className="bg-[#111312] border border-white/[0.07] p-6">
        <WorkshopForm initialData={{}} />
      </div>
    </div>
  )
}
