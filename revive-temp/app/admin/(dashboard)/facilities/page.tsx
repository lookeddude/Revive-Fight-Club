import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { FacilitiesManager } from './FacilitiesManager'

export const metadata: Metadata = { title: 'Facilities' }

export default async function AdminFacilitiesPage() {
  const supabase = await createClient()
  const { data: facilities } = await supabase.from('facilities').select('*').order('sort_order')

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Facilities</h2>
        <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] mt-0.5">{facilities?.length ?? 0} facilities</p>
      </div>
      <FacilitiesManager facilities={facilities ?? []} />
    </div>
  )
}
