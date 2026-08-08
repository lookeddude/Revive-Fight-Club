import type { Metadata } from 'next'
import { getAllSlots, getMediaLibrary, getImageStats } from '@/lib/data/images'
import { getHeroSlides, getHeroSettings } from '@/lib/data/heroSlideshow'
import { getProgramsWithSlides } from '@/lib/data/programSlides'
import { ImageManagementClient } from './ImageManagementClient'

export const metadata: Metadata = {
  title: 'Image Management | Revive Fight Club Admin',
}

export const revalidate = 0

export default async function AdminImagesPage() {
  const [slots, { data: mediaAssets }, stats, heroSlides, heroSettings, programs] = await Promise.all([
    getAllSlots(),
    getMediaLibrary(undefined, 1, 200),
    getImageStats(),
    getHeroSlides(),
    getHeroSettings(),
    getProgramsWithSlides(),
  ])

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="border-b border-white/[0.06] pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-black text-[#f0ede8] uppercase tracking-tight">
              Image Management
            </h1>
            <p className="font-[family-name:var(--font-inter)] text-sm text-[#4b5563] mt-1">
              Control every visual on your website from one place.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563]">Live — changes publish instantly</span>
          </div>
        </div>
      </div>

      <ImageManagementClient
        slots={slots}
        mediaAssets={mediaAssets}
        stats={stats}
        heroSlides={heroSlides}
        heroSettings={heroSettings}
        programs={programs}
      />
    </div>
  )
}
