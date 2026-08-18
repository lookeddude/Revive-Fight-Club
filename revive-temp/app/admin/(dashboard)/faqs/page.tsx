import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { FAQsManager } from './FAQsManager'

export const metadata: Metadata = { title: 'FAQs' }

export default async function AdminFAQsPage() {
  const supabase = await createClient()
  const { data: faqs } = await supabase.from('faqs').select('*').order('sort_order').order('created_at')

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">FAQs</h2>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] mt-0.5">{faqs?.length ?? 0} questions</p>
      </div>
      <FAQsManager faqs={faqs ?? []} />
    </div>
  )
}
