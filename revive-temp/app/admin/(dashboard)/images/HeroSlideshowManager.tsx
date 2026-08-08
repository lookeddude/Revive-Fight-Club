'use client'

import { useState, useRef } from 'react'
import type { HeroSlide, HeroSettings } from '@/lib/data/heroSlideshow'
import {
  addHeroSlide,
  updateHeroSlide,
  toggleHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
  updateHeroSettings,
} from '@/lib/actions/admin/heroSlideshowActions'
import { uploadToMediaLibrary } from '@/lib/actions/admin/imageActions'

const MAX_SLIDES = 10

interface Props {
  initialSlides: HeroSlide[]
  initialSettings: HeroSettings
}

type DeviceType = 'desktop' | 'tablet' | 'mobile'

function SlideCard({
  slide,
  index,
  total,
  onUpdate,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  slide: HeroSlide
  index: number
  total: number
  onUpdate: (id: string, fields: Partial<HeroSlide>) => void
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
}) {
  const [uploading, setUploading] = useState<DeviceType | null>(null)
  const desktopRef = useRef<HTMLInputElement>(null)
  const mobileRef = useRef<HTMLInputElement>(null)
  const tabletRef = useRef<HTMLInputElement>(null)

  const refs: Record<DeviceType, React.RefObject<HTMLInputElement | null>> = {
    desktop: desktopRef,
    tablet: tabletRef,
    mobile: mobileRef,
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, device: DeviceType) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(device)
    const fd = new FormData()
    fd.append('file', file)
    const res = await uploadToMediaLibrary(fd)
    setUploading(null)
    if (res.success && res.url) {
      const field = device === 'desktop' ? 'desktop_url' : device === 'mobile' ? 'mobile_url' : 'tablet_url'
      onUpdate(slide.id, { [field]: res.url })
    }
    e.target.value = ''
  }

  const deviceConfigs: { device: DeviceType; label: string; icon: string; url: string | null; badge: string }[] = [
    { device: 'desktop', label: 'Desktop', icon: '🖥', url: slide.desktop_url, badge: 'Required' },
    { device: 'tablet', label: 'Tablet', icon: '📱', url: slide.tablet_url, badge: 'Optional' },
    { device: 'mobile', label: 'Mobile', icon: '📲', url: slide.mobile_url, badge: 'Optional' },
  ]

  return (
    <div
      className="border border-white/[0.08] overflow-hidden"
      style={{ background: '#0f1110', opacity: slide.is_active ? 1 : 0.5 }}
    >
      {/* Slide header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-outfit)] text-sm font-black text-[#ff571a]">
            #{index + 1}
          </span>
          {!slide.is_active && (
            <span className="px-1.5 py-0.5 bg-[#3a3530] text-[#6b6059] text-[9px] font-bold uppercase tracking-wider">DISABLED</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Reorder */}
          <button
            onClick={() => onMoveUp(slide.id)}
            disabled={index === 0}
            className="w-6 h-6 flex items-center justify-center text-[#4b5563] hover:text-[#f0ede8] transition-colors disabled:opacity-20"
            title="Move up"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={() => onMoveDown(slide.id)}
            disabled={index === total - 1}
            className="w-6 h-6 flex items-center justify-center text-[#4b5563] hover:text-[#f0ede8] transition-colors disabled:opacity-20"
            title="Move down"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {/* Toggle */}
          <button
            onClick={() => onToggle(slide.id, !slide.is_active)}
            className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider transition-colors ${
              slide.is_active
                ? 'bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400'
                : 'bg-white/[0.05] text-[#6b6059] hover:bg-green-500/20 hover:text-green-400'
            }`}
          >
            {slide.is_active ? 'Active' : 'Disabled'}
          </button>
          {/* Delete */}
          <button
            onClick={() => onDelete(slide.id)}
            className="w-6 h-6 flex items-center justify-center text-[#4b5563] hover:text-red-400 transition-colors"
            title="Delete slide"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Device images grid */}
      <div className="grid grid-cols-3 gap-3 p-4">
        {deviceConfigs.map(({ device, label, icon, url, badge }) => (
          <div key={device} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-inter)] text-[10px] text-[#6b6059] uppercase tracking-wider">
                {icon} {label}
              </span>
              <span className={`text-[8px] font-bold px-1 py-0.5 uppercase ${
                badge === 'Required' ? 'bg-[#ff571a]/20 text-[#ff571a]' : 'bg-white/[0.05] text-[#4b5563]'
              }`}>
                {badge}
              </span>
            </div>

            {/* Preview */}
            <div
              className="relative aspect-video bg-[#0a0b0a] border border-white/[0.06] overflow-hidden cursor-pointer hover:border-[#ff571a]/40 transition-colors group"
              onClick={() => refs[device].current?.click()}
            >
              {url ? (
                <img src={url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  <svg className="w-4 h-4 text-[#2a2825]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-[family-name:var(--font-inter)] text-[8px] text-[#3a3530] uppercase tracking-wider">Add image</span>
                </div>
              )}
              {/* Upload overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploading === device ? (
                  <div className="w-4 h-4 border-2 border-[#ff571a] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                )}
              </div>

              <input
                ref={refs[device]}
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, device)}
                className="hidden"
              />
            </div>

            {/* Clear optional */}
            {url && device !== 'desktop' && (
              <button
                onClick={() => onUpdate(slide.id, { [`${device}_url`]: null })}
                className="font-[family-name:var(--font-inter)] text-[9px] text-[#4b5563] hover:text-red-400 transition-colors text-center uppercase tracking-wider"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Alt text */}
      <div className="px-4 pb-4">
        <input
          defaultValue={slide.alt_text ?? ''}
          onBlur={(e) => {
            if (e.target.value !== slide.alt_text) {
              onUpdate(slide.id, { alt_text: e.target.value || null })
            }
          }}
          placeholder="Alt text (for SEO and accessibility)..."
          className="w-full bg-[#0d0c0b] border border-white/[0.06] px-3 py-1.5 text-xs text-[#f0ede8] focus:outline-none focus:border-[#ff571a]/40 font-[family-name:var(--font-inter)] placeholder:text-[#3a3530]"
        />
      </div>
    </div>
  )
}

export function HeroSlideshowManager({ initialSlides, initialSettings }: Props) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides)
  const [settings, setSettings] = useState(initialSettings)
  const [interval, setInterval_] = useState(initialSettings.interval_seconds)
  const [transitionType, setTransitionType] = useState(initialSettings.transition)
  const [savingSettings, setSavingSettings] = useState(false)
  const [addingSlide, setAddingSlide] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const addFileRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Settings save ─────────────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    setSavingSettings(true)
    const res = await updateHeroSettings(interval, transitionType)
    setSavingSettings(false)
    if (res.success) {
      setSettings(prev => ({ ...prev, interval_seconds: interval, transition: transitionType }))
      showToast(res.message, true)
    } else {
      showToast(res.error, false)
    }
  }

  // ── Add slide ─────────────────────────────────────────────────────────────
  const handleAddSlide = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAddingSlide(true)
    const fd = new FormData()
    fd.append('file', file)
    const uploadRes = await uploadToMediaLibrary(fd)
    if (!uploadRes.success || !uploadRes.url) {
      setAddingSlide(false)
      showToast('Upload failed.', false)
      return
    }
    const res = await addHeroSlide(uploadRes.url)
    setAddingSlide(false)
    if (res.success) {
      // Refresh slides from server
      window.location.reload()
    } else {
      showToast(res.error, false)
    }
    e.target.value = ''
  }

  // ── Update slide ──────────────────────────────────────────────────────────
  const handleUpdate = async (id: string, fields: Partial<HeroSlide>) => {
    const res = await updateHeroSlide(id, fields as Parameters<typeof updateHeroSlide>[1])
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...fields } : s))
    if (!res.success) showToast(res.error, false)
    else showToast('Slide saved.', true)
  }

  // ── Toggle ────────────────────────────────────────────────────────────────
  const handleToggle = async (id: string, active: boolean) => {
    const res = await toggleHeroSlide(id, active)
    if (res.success) {
      setSlides(prev => prev.map(s => s.id === id ? { ...s, is_active: active } : s))
      showToast(res.message, true)
    } else {
      showToast(res.error, false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return
    const res = await deleteHeroSlide(id)
    if (res.success) {
      setSlides(prev => prev.filter(s => s.id !== id))
      showToast(res.message, true)
    } else {
      showToast(res.error, false)
    }
  }

  // ── Reorder ───────────────────────────────────────────────────────────────
  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const idx = slides.findIndex(s => s.id === id)
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === slides.length - 1) return

    const newSlides = [...slides]
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    ;[newSlides[idx], newSlides[targetIdx]] = [newSlides[targetIdx], newSlides[idx]]
    setSlides(newSlides)
    await reorderHeroSlides(newSlides.map(s => s.id))
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 text-sm font-[family-name:var(--font-inter)] border ${
            toast.ok ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Section header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-black text-[#f0ede8] uppercase tracking-tight">
            Hero Slideshow
          </h2>
          <p className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563] mt-1">
            {slides.length} / {MAX_SLIDES} slides · {slides.filter(s => s.is_active).length} active
          </p>
        </div>
        <button
          onClick={() => addFileRef.current?.click()}
          disabled={slides.length >= MAX_SLIDES || addingSlide}
          className="shrink-0 px-4 py-2 bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-black uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-40"
        >
          {addingSlide ? 'Uploading…' : `+ Add Slide`}
        </button>
        <input ref={addFileRef} type="file" accept="image/*" onChange={handleAddSlide} className="hidden" />
      </div>

      {/* ── Settings Panel ──────────────────────────────────────────────────── */}
      <div className="p-4 border border-white/[0.06]" style={{ background: '#0a0b0a' }}>
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#6b6059] mb-4">
          Slideshow Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
          {/* Interval slider */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="font-[family-name:var(--font-inter)] text-xs text-[#9ca3af] uppercase tracking-wider">
                Auto-advance interval
              </label>
              <span className="font-[family-name:var(--font-outfit)] text-lg font-black text-[#ff571a]">
                {interval}s
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              value={interval}
              onChange={e => setInterval_(Number(e.target.value))}
              className="w-full accent-[#ff571a]"
            />
            <div className="flex justify-between mt-1">
              <span className="font-[family-name:var(--font-inter)] text-[10px] text-[#3a3530]">3s (fast)</span>
              <span className="font-[family-name:var(--font-inter)] text-[10px] text-[#3a3530]">15s (slow)</span>
            </div>
          </div>

          {/* Transition picker */}
          <div>
            <label className="block font-[family-name:var(--font-inter)] text-xs text-[#9ca3af] uppercase tracking-wider mb-2">
              Transition
            </label>
            <div className="flex gap-2">
              {['fade', 'slide'].map(t => (
                <button
                  key={t}
                  onClick={() => setTransitionType(t)}
                  className={`flex-1 py-2 font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider transition-colors border ${
                    transitionType === t
                      ? 'bg-[#ff571a] text-black border-[#ff571a]'
                      : 'border-white/[0.08] text-[#6b6059] hover:text-[#f0ede8]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={savingSettings}
          className="mt-4 px-5 py-2 bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-black uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
        >
          {savingSettings ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      {/* Responsive image guide */}
      <div className="flex flex-wrap gap-3 text-xs font-[family-name:var(--font-inter)]">
        {[
          { icon: '🖥', label: 'Desktop', desc: '> 1024px — Required' },
          { icon: '📱', label: 'Tablet', desc: '768–1024px — Optional' },
          { icon: '📲', label: 'Mobile', desc: '< 768px — Optional' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2 px-3 py-2 border border-white/[0.06] text-[#4b5563]">
            <span>{item.icon}</span>
            <span className="font-bold text-[#6b6059]">{item.label}</span>
            <span>{item.desc}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 px-3 py-2 text-[#3a3530]">
          If optional not set → falls back to desktop image
        </div>
      </div>

      {/* ── Slides Grid ────────────────────────────────────────────────────── */}
      {slides.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/[0.06]">
          <p className="font-[family-name:var(--font-inter)] text-sm text-[#4b5563]">No slides yet.</p>
          <button
            onClick={() => addFileRef.current?.click()}
            className="mt-3 text-[#ff571a] text-xs font-bold uppercase tracking-wider hover:underline font-[family-name:var(--font-inter)]"
          >
            Add your first hero slide →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, i) => (
            <SlideCard
              key={slide.id}
              slide={slide}
              index={i}
              total={slides.length}
              onUpdate={handleUpdate}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onMoveUp={(id) => handleMove(id, 'up')}
              onMoveDown={(id) => handleMove(id, 'down')}
            />
          ))}
        </div>
      )}

      {slides.length >= MAX_SLIDES && (
        <p className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563] text-center">
          Maximum {MAX_SLIDES} slides reached. Delete a slide to add a new one.
        </p>
      )}
    </div>
  )
}
