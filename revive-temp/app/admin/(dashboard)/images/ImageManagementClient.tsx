'use client'

import { useState, useMemo } from 'react'
import type { ImageSlot, MediaAsset } from '@/lib/data/images'
import type { HeroSlide, HeroSettings } from '@/lib/data/heroSlideshow'
import type { ProgramWithSlides } from '@/lib/data/programSlides'
import { ImageSlotCard } from '@/components/admin/ImageSlotCard'
import { HeroSlideshowManager } from './HeroSlideshowManager'
import { ProgramSlidesManager } from './ProgramSlidesManager'

const SECTIONS = ['Hero Slideshow', 'Program Slides', 'All', 'Trainers', 'About', 'Gallery', 'Membership', 'Contact']

interface Props {
  slots: ImageSlot[]
  mediaAssets: MediaAsset[]
  stats: {
    totalMedia: number
    activeSlots: number
    unassignedSlots: number
    recentlyUpdated: number
  }
  heroSlides: HeroSlide[]
  heroSettings: HeroSettings
  programs: ProgramWithSlides[]
}

export function ImageManagementClient({ slots, mediaAssets, stats, heroSlides, heroSettings, programs }: Props) {
  const [section, setSection] = useState('Hero Slideshow')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (section === 'Hero Slideshow') return []
    if (section === 'Program Slides') return []
    return slots.filter(slot => {
      const matchSection = section === 'All' || slot.section === section
      const matchSearch =
        !search ||
        slot.title.toLowerCase().includes(search.toLowerCase()) ||
        slot.slot_key.toLowerCase().includes(search.toLowerCase()) ||
        slot.section.toLowerCase().includes(search.toLowerCase())
      return matchSection && matchSearch
    })
  }, [slots, section, search])

  const statCards = [
    { label: 'Hero Slides', value: heroSlides.length, color: '#ff571a' },
    { label: 'Program Slides', value: programs.reduce((acc, p) => acc + p.slides.length, 0), color: '#a855f7' },
    { label: 'Total Media', value: stats.totalMedia, color: '#f59e0b' },
    { label: 'Unassigned Slots', value: stats.unassignedSlots, color: stats.unassignedSlots > 0 ? '#ef4444' : '#6b7280' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map(card => (
          <div key={card.label} className="px-4 py-3" style={{ background: '#0f1110', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="font-[family-name:var(--font-outfit)] text-2xl font-black" style={{ color: card.color }}>
              {card.value}
            </div>
            <div className="font-[family-name:var(--font-inter)] text-[11px] text-[#4b5563] uppercase tracking-wider mt-0.5">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Section filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {SECTIONS.map(s => (
          <button
            key={s}
            onClick={() => { setSection(s); setSearch('') }}
            className={`px-4 py-1.5 font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider transition-colors border ${
              section === s
                ? s === 'Hero Slideshow'
                  ? 'bg-[#ff571a] text-black border-[#ff571a]'
                  : 'bg-[#ff571a] text-black border-[#ff571a]'
                : 'border-white/[0.08] text-[#6b6059] hover:text-[#f0ede8] hover:border-white/20'
            }`}
          >
            {s === 'Hero Slideshow' ? '🎬 ' + s : s}
          </button>
        ))}
      </div>

      {/* Hero Slideshow Manager */}
      {section === 'Hero Slideshow' ? (
        <HeroSlideshowManager
          initialSlides={heroSlides}
          initialSettings={heroSettings}
        />
      ) : section === 'Program Slides' ? (
        <ProgramSlidesManager initialPrograms={programs} />
      ) : (
        <>
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search slots by name, section, or key..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0f1110] border border-white/[0.07] text-sm text-[#f0ede8] focus:outline-none focus:border-[#ff571a]/40 font-[family-name:var(--font-inter)] placeholder:text-[#3a3530]"
            />
          </div>

          <p className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563]">
            Showing {filtered.length} of {slots.length} image slots
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/[0.06]">
              <p className="font-[family-name:var(--font-inter)] text-sm text-[#4b5563]">No slots match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(slot => (
                <ImageSlotCard key={slot.id} slot={slot} mediaAssets={mediaAssets} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
