import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { GalleryManager } from './GalleryManager'

export const metadata: Metadata = { title: 'Gallery' }

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('gallery_items').select('*').order('sort_order').order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Gallery</h2>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] mt-0.5">{items?.length ?? 0} images</p>
      </div>
      <GalleryManager items={items ?? []} />
    </div>
  )
}
