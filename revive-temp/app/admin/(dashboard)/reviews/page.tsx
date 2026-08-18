import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ReviewsManager } from './ReviewsManager'

export const metadata: Metadata = { title: 'Reviews' }

export default async function AdminReviewsPage() {
  const supabase = await createClient()
  const { data: reviews } = await supabase.from('reviews').select('*').order('sort_order').order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Reviews</h2>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] mt-0.5">{reviews?.length ?? 0} total</p>
      </div>
      <ReviewsManager reviews={reviews ?? []} />
    </div>
  )
}
