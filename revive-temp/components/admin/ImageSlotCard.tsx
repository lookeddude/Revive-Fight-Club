'use client'

import { useState } from 'react'
import type { ImageSlot, MediaAsset, AssignmentHistory } from '@/lib/data/images'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { SlotHistory } from '@/components/admin/SlotHistory'
import { getSlotHistory } from '@/lib/data/images'

interface ImageSlotCardProps {
  slot: ImageSlot
  mediaAssets: MediaAsset[]
}

export function ImageSlotCard({ slot, mediaAssets }: ImageSlotCardProps) {
  const [currentUrl, setCurrentUrl] = useState(slot.current_url)
  const [showPicker, setShowPicker] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<AssignmentHistory[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [justUpdated, setJustUpdated] = useState(false)

  const handleOpenHistory = async () => {
    setLoadingHistory(true)
    // We can't call server functions directly from client — use fetch API pattern
    const res = await fetch(`/api/admin/slot-history?slotId=${slot.id}`)
    if (res.ok) {
      const data = await res.json()
      setHistory(data)
    }
    setLoadingHistory(false)
    setShowHistory(true)
  }

  const handleSuccess = (newUrl: string) => {
    setCurrentUrl(newUrl)
    setShowPicker(false)
    setJustUpdated(true)
    setTimeout(() => setJustUpdated(false), 3000)
  }

  const handleRestored = (url: string) => {
    setCurrentUrl(url)
    setShowHistory(false)
    setJustUpdated(true)
    setTimeout(() => setJustUpdated(false), 3000)
  }

  const sectionColors: Record<string, string> = {
    Home: '#ff571a',
    Programs: '#f59e0b',
    Trainers: '#22c55e',
    About: '#3b82f6',
    Gallery: '#8b5cf6',
    Membership: '#ec4899',
    Contact: '#06b6d4',
    Other: '#6b7280',
  }

  const sectionColor = sectionColors[slot.section] ?? '#6b7280'

  return (
    <>
      <div
        className={`relative overflow-hidden transition-all duration-300 ${
          justUpdated ? 'ring-1 ring-green-500/50' : ''
        }`}
        style={{ background: '#0f1110', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Updated flash */}
        {justUpdated && (
          <div className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-green-500 text-black text-[9px] font-black uppercase tracking-wider">
            UPDATED
          </div>
        )}

        {/* Image preview */}
        <div className="relative aspect-video w-full overflow-hidden bg-[#0a0b0a]">
          {currentUrl ? (
            <img
              src={currentUrl}
              alt={slot.alt_text ?? slot.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <svg className="w-8 h-8 text-[#2a2825]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#3a3530] uppercase tracking-wider">No Image Assigned</p>
            </div>
          )}
          {/* Section badge */}
          <div
            className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider"
            style={{ background: sectionColor, color: sectionColor === '#f59e0b' ? '#000' : '#000' }}
          >
            {slot.section}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-[family-name:var(--font-outfit)] text-sm font-bold text-[#f0ede8] leading-tight">
            {slot.title}
          </h3>
          {slot.description && (
            <p className="font-[family-name:var(--font-inter)] text-[11px] text-[#4b5563] mt-0.5 leading-snug line-clamp-1">
              {slot.description}
            </p>
          )}
          <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#3a3530] mt-1 font-mono">
            {slot.slot_key}
          </p>
          {currentUrl && (
            <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#3a3530] mt-0.5 truncate">
              {currentUrl.split('/').pop()}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="px-3 pb-3 flex gap-2">
          <button
            onClick={() => setShowPicker(true)}
            className="flex-1 py-2 bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-[10px] font-black uppercase tracking-wider hover:bg-white transition-colors"
          >
            {currentUrl ? 'Change Image' : 'Select Image'}
          </button>
          <button
            onClick={handleOpenHistory}
            disabled={loadingHistory}
            className="px-3 py-2 border border-white/[0.08] text-[#6b6059] font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wider hover:text-[#f0ede8] hover:border-white/20 transition-colors disabled:opacity-40"
            title="View history"
          >
            {loadingHistory ? '...' : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Modals */}
      {showPicker && (
        <MediaPicker
          slot={slot}
          mediaAssets={mediaAssets}
          onClose={() => setShowPicker(false)}
          onSuccess={handleSuccess}
        />
      )}
      {showHistory && (
        <SlotHistory
          slotTitle={slot.title}
          history={history}
          onClose={() => setShowHistory(false)}
          onRestored={handleRestored}
        />
      )}
    </>
  )
}
