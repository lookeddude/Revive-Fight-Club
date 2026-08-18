import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { MembershipManager } from './MembershipManager'

export const metadata: Metadata = { title: 'Memberships' }

export default async function AdminMembershipsPage() {
  const supabase = await createClient()
  const { data: plans } = await supabase.from('membership_plans').select('*').order('sort_order')

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Membership Plans</h2>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] mt-0.5">{plans?.length ?? 0} plans</p>
      </div>
      <MembershipManager plans={plans ?? []} />
    </div>
  )
}
