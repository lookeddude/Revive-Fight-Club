'use client'

import { useState, useRef, useCallback } from 'react'
import type { HeroSlide, HeroSettings } from '@/lib/data/heroSlideshow'
import {
  addHeroSlide,
  updateHeroSlide,
  toggleHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
  updateHeroSettings,
} from '@/lib/actions/admin/heroSlideshowActions'
import { uploadFileToStorage } from '@/lib/upload/client'

const MAX_SLIDES = 10
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

// ── Upload helper — calls /api/admin/upload via fetch ───────────────────────
async function uploadSlideImage(file: File, folder: string): Promise<string | null> {
  const result = await uploadFileToStorage(file, 'revive-gallery', folder)
  return result?.url ?? null
}

// ─────────────────────────────────────────────────────────────────────────────
// SlideCard
// ─────────────────────────────────────────────────────────────────────────────
function SlideCard({
  slide,
  index,
  total,
  onOptimisticUpdate,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToast,
}: {
  slide: HeroSlide
  index: number
  total: number
  onOptimisticUpdate: (id: string, fields: Partial<HeroSlide>) => void
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onToast: (msg: string, ok: boolean) => void
}) {
  const [uploadingDevice, setUploadingDevice] = useState<'desktop' | 'tablet' | 'mobile' | null>(null)
  const [savingAlt, setSavingAlt] = useState(false)
  const desktopRef = useRef<HTMLInputElement>(null)
  const tabletRef = useRef<HTMLInputElement>(null)
  const mobileRef = useRef<HTMLInputElement>(null)

  const refs = { desktop: desktopRef, tablet: tabletRef, mobile: mobileRef }

  const handleFileChange = useCallback(async (
    e: React.ChangeEvent<HTMLInputElement>,
    device: 'desktop' | 'tablet' | 'mobile'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate client-side before hitting server
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      onToast('Only JPEG, PNG, WebP or GIF allowed.', false)
      e.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      onToast('File too large — max 5MB.', false)
      e.target.value = ''
      return
    }

    setUploadingDevice(device)
    try {
      const url = await uploadSlideImage(file, 'hero-slides')
      if (!url) {
        onToast('Upload failed. Try again.', false)
        setUploadingDevice(null)
        e.target.value = ''
        return
      }

      const field = device === 'desktop' ? 'desktop_url' : device === 'mobile' ? 'mobile_url' : 'tablet_url'

      // Optimistically update UI immediately
      onOptimisticUpdate(slide.id, { [field]: url })

      // Persist to DB
      const res = await updateHeroSlide(slide.id, { [field]: url })
      if (res.success) {
        onToast(`${device.charAt(0).toUpperCase() + device.slice(1)} image updated!`, true)
      } else {
        onToast(res.error, false)
      }
    } catch {
      onToast('Upload failed. Check your connection.', false)
    } finally {
      setUploadingDevice(null)
      e.target.value = ''
    }
  }, [slide.id, onOptimisticUpdate, onToast])

  const handleAltSave = useCallback(async (value: string) => {
    if (value === (slide.alt_text ?? '')) return
    setSavingAlt(true)
    onOptimisticUpdate(slide.id, { alt_text: value || null })
    await updateHeroSlide(slide.id, { alt_text: value || null })
    setSavingAlt(false)
  }, [slide.id, slide.alt_text, onOptimisticUpdate])

  const deviceConfigs = [
    { device: 'desktop' as const, label: 'Desktop', icon: '🖥', url: slide.desktop_url, required: true },
    { device: 'tablet' as const, label: 'Tablet (768–1024px)', icon: '📱', url: slide.tablet_url, required: false },
    { device: 'mobile' as const, label: 'Mobile (<768px)', icon: '📲', url: slide.mobile_url, required: false },
  ]

  return (
    <div
      className="border overflow-hidden transition-all duration-200"
      style={{
        background: '#0f1110',
        borderColor: slide.is_active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
        opacity: slide.is_active ? 1 : 0.6,
      }}
    >
      {/* ── Slide header ──────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-outfit)] text-base font-black text-[#ff571a]">
            Slide {index + 1}
          </span>
          {!slide.is_active && (
            <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#4b5563' }}>
              DISABLED
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Move up/down */}
          <button
            onClick={() => onMoveUp(slide.id)}
            disabled={index === 0}
            title="Move up"
            className="w-7 h-7 flex items-center justify-center text-[#4b5563] hover:text-[#f0ede8] disabled:opacity-20 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={() => onMoveDown(slide.id)}
            disabled={index === total - 1}
            title="Move down"
            className="w-7 h-7 flex items-center justify-center text-[#4b5563] hover:text-[#f0ede8] disabled:opacity-20 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Toggle active */}
          <button
            onClick={() => onToggle(slide.id, !slide.is_active)}
            className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition-colors ${
              slide.is_active
                ? 'hover:bg-red-500/10 hover:text-red-400 text-green-400'
                : 'text-[#4b5563] hover:text-green-400'
            }`}
            style={{
              background: slide.is_active ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${slide.is_active ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            {slide.is_active ? '● Active' : '○ Disabled'}
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(slide.id)}
            title="Delete slide"
            className="w-7 h-7 flex items-center justify-center text-[#4b5563] hover:text-red-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Device image grid ──────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 p-4">
        {deviceConfigs.map(({ device, label, icon, url, required }) => (
          <div key={device} className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{icon}</span>
              <span className="font-[family-name:var(--font-inter)] text-[10px] font-bold text-[#6b6059] uppercase tracking-wider truncate">
                {label}
              </span>
              {required && (
                <span className="shrink-0 text-[8px] font-black px-1 py-0.5 uppercase"
                  style={{ background: 'rgba(255,87,26,0.15)', color: '#ff571a' }}>
                  Required
                </span>
              )}
            </div>

            {/* Image preview / upload target */}
            <div
              className="relative overflow-hidden cursor-pointer group transition-all duration-200"
              style={{
                aspectRatio: device === 'mobile' ? '9/16' : '16/9',
                background: '#0a0b0a',
                border: url ? '1px solid rgba(255,255,255,0.06)' : '1px dashed rgba(255,255,255,0.08)',
              }}
              onClick={() => refs[device].current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') refs[device].current?.click() }}
            >
              {/* Preview */}
              {url && (
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}

              {/* Empty state */}
              {!url && !uploadingDevice && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,87,26,0.08)', border: '1px solid rgba(255,87,26,0.15)' }}>
                    <svg className="w-4 h-4 text-[#ff571a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="font-[family-name:var(--font-inter)] text-[9px] text-[#3a3530] uppercase tracking-wider">
                    Click to upload
                  </span>
                </div>
              )}

              {/* Uploading spinner */}
              {uploadingDevice === device && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                  style={{ background: 'rgba(10,11,10,0.85)' }}>
                  <div className="w-6 h-6 border-2 border-[#ff571a] border-t-transparent rounded-full animate-spin" />
                  <span className="font-[family-name:var(--font-inter)] text-[9px] text-[#ff571a] uppercase tracking-wider">
                    Uploading…
                  </span>
                </div>
              )}

              {/* Hover overlay (only when not uploading) */}
              {uploadingDevice !== device && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.65)' }}>
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="font-[family-name:var(--font-inter)] text-[9px] text-white uppercase tracking-wider">
                      {url ? 'Change' : 'Upload'}
                    </span>
                  </div>
                </div>
              )}

              <input
                ref={refs[device]}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={e => handleFileChange(e, device)}
                className="hidden"
                aria-label={`Upload ${device} image for slide ${index + 1}`}
              />
            </div>

            {/* Remove optional image */}
            {url && !required && (
              <button
                onClick={() => {
                  const field = device === 'mobile' ? 'mobile_url' : 'tablet_url'
                  onOptimisticUpdate(slide.id, { [field]: null })
                  updateHeroSlide(slide.id, { [field]: null })
                }}
                className="font-[family-name:var(--font-inter)] text-[9px] text-[#4b5563] hover:text-red-400 transition-colors uppercase tracking-wider text-center"
              >
                ✕ Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Alt text */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <input
          key={slide.id}
          defaultValue={slide.alt_text ?? ''}
          onBlur={e => handleAltSave(e.target.value)}
          placeholder="Alt text for SEO & accessibility..."
          className="flex-1 px-3 py-2 text-xs text-[#f0ede8] font-[family-name:var(--font-inter)] focus:outline-none placeholder:text-[#3a3530]"
          style={{ background: '#0a0b0a', border: '1px solid rgba(255,255,255,0.05)' }}
        />
        {savingAlt && <div className="w-3 h-3 border border-[#ff571a] border-t-transparent rounded-full animate-spin shrink-0" />}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main HeroSlideshowManager
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  initialSlides: HeroSlide[]
  initialSettings: HeroSettings
}

export function HeroSlideshowManager({ initialSlides, initialSettings }: Props) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides)
  const [intervalSec, setIntervalSec] = useState(initialSettings.interval_seconds)
  const [transitionType, setTransitionType] = useState(initialSettings.transition)
  const [savingSettings, setSavingSettings] = useState(false)
  const [addingSlide, setAddingSlide] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const addFileRef = useRef<HTMLInputElement>(null)

  const showToast = useCallback((msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }, [])

  // ── Optimistic update (updates local state immediately) ─────────────────
  const handleOptimisticUpdate = useCallback((id: string, fields: Partial<HeroSlide>) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...fields } : s))
  }, [])

  // ── Save settings ───────────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    setSavingSettings(true)
    const res = await updateHeroSettings(intervalSec, transitionType)
    setSavingSettings(false)
    showToast(res.success ? res.message : res.error, res.success)
  }

  // ── Add new slide ───────────────────────────────────────────────────────
  const handleAddSlide = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      showToast('Only JPEG, PNG, WebP or GIF allowed.', false)
      e.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('File too large — max 5MB.', false)
      e.target.value = ''
      return
    }

    setAddingSlide(true)
    e.target.value = ''

    const url = await uploadSlideImage(file, 'hero-slides')
    if (!url) {
      showToast('Upload failed. Check the file and try again.', false)
      setAddingSlide(false)
      return
    }

    const res = await addHeroSlide(url)
    if (res.success && res.id) {
      // Add optimistically to local state (no full reload)
      const newSlide: HeroSlide = {
        id: res.id,
        desktop_url: url,
        mobile_url: null,
        tablet_url: null,
        alt_text: null,
        sort_order: slides.length,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setSlides(prev => [...prev, newSlide])
      showToast('Slide added! You can now set tablet & mobile images.', true)
    } else if (!res.success) {
      showToast(res.error, false)
    }
    setAddingSlide(false)
  }

  // ── Toggle ──────────────────────────────────────────────────────────────
  const handleToggle = useCallback(async (id: string, active: boolean) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, is_active: active } : s))
    const res = await toggleHeroSlide(id, active)
    if (!res.success) {
      setSlides(prev => prev.map(s => s.id === id ? { ...s, is_active: !active } : s))
      showToast(res.error, false)
    } else {
      showToast(res.message, true)
    }
  }, [showToast])

  // ── Delete ──────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Delete this slide permanently?')) return
    const res = await deleteHeroSlide(id)
    if (res.success) {
      setSlides(prev => prev.filter(s => s.id !== id))
      showToast(res.message, true)
    } else {
      showToast(res.error, false)
    }
  }, [showToast])

  // ── Reorder ─────────────────────────────────────────────────────────────
  const handleMove = useCallback(async (id: string, direction: 'up' | 'down') => {
    const idx = slides.findIndex(s => s.id === id)
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === slides.length - 1) return

    const newSlides = [...slides]
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    ;[newSlides[idx], newSlides[targetIdx]] = [newSlides[targetIdx], newSlides[idx]]
    setSlides(newSlides)
    await reorderHeroSlides(newSlides.map(s => s.id))
    showToast('Order saved.', true)
  }, [slides, showToast])

  const activeCount = slides.filter(s => s.is_active).length

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 px-5 py-3 text-sm font-[family-name:var(--font-inter)] font-medium shadow-2xl transition-all duration-300"
          style={{
            background: toast.ok ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${toast.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: toast.ok ? '#34d399' : '#f87171',
            backdropFilter: 'blur(12px)',
          }}
        >
          {toast.ok ? '✓ ' : '✕ '}{toast.msg}
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 pb-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-black text-[#f0ede8] uppercase tracking-tight">
            Hero Slideshow
          </h2>
          <p className="font-[family-name:var(--font-inter)] text-xs mt-1" style={{ color: '#4b5563' }}>
            {slides.length}/{MAX_SLIDES} slides · {activeCount} active
            {activeCount === 0 && (
              <span style={{ color: '#ef4444' }}> — Enable at least 1 slide to show on homepage</span>
            )}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            onClick={() => addFileRef.current?.click()}
            disabled={slides.length >= MAX_SLIDES || addingSlide}
            className="px-5 py-2 font-[family-name:var(--font-inter)] text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-40"
            style={{ background: '#ff571a', color: '#000' }}
          >
            {addingSlide ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin inline-block" />
                Uploading…
              </span>
            ) : (
              `+ Add Slide`
            )}
          </button>
          {slides.length >= MAX_SLIDES && (
            <span className="font-[family-name:var(--font-inter)] text-[9px] text-[#4b5563]">
              Max {MAX_SLIDES} slides reached
            </span>
          )}
          <input
            ref={addFileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleAddSlide}
            className="hidden"
            aria-label="Upload new hero slide"
          />
        </div>
      </div>

      {/* ── Settings Panel ───────────────────────────────────────────────── */}
      <div className="p-5 space-y-5" style={{ background: '#0a0b0a', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-black uppercase tracking-wider"
          style={{ color: '#6b6059' }}>
          Slideshow Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Interval */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-[family-name:var(--font-inter)] text-xs font-medium uppercase tracking-wider"
                style={{ color: '#9ca3af' }}>
                Auto-advance every
              </label>
              <span className="font-[family-name:var(--font-outfit)] text-2xl font-black" style={{ color: '#ff571a' }}>
                {intervalSec}s
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              step={1}
              value={intervalSec}
              onChange={e => setIntervalSec(Number(e.target.value))}
              className="w-full h-1.5 accent-[#ff571a] cursor-pointer"
            />
            <div className="flex justify-between mt-1.5">
              <span className="font-[family-name:var(--font-inter)] text-[10px]" style={{ color: '#3a3530' }}>3s — fast</span>
              <span className="font-[family-name:var(--font-inter)] text-[10px]" style={{ color: '#3a3530' }}>15s — slow</span>
            </div>
          </div>

          {/* Transition */}
          <div>
            <label className="block font-[family-name:var(--font-inter)] text-xs font-medium uppercase tracking-wider mb-3"
              style={{ color: '#9ca3af' }}>
              Transition effect
            </label>
            <div className="flex gap-2">
              {[
                { id: 'fade', label: '◐ Fade' },
                { id: 'slide', label: '→ Slide' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTransitionType(t.id)}
                  className="flex-1 py-2.5 font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider transition-all duration-200"
                  style={{
                    background: transitionType === t.id ? '#ff571a' : 'rgba(255,255,255,0.03)',
                    color: transitionType === t.id ? '#000' : '#6b6059',
                    border: `1px solid ${transitionType === t.id ? '#ff571a' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={savingSettings}
          className="px-6 py-2 font-[family-name:var(--font-inter)] text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
          style={{ background: '#ff571a', color: '#000' }}
        >
          {savingSettings ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      {/* ── Device legend ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-[family-name:var(--font-inter)]">
        {[
          { icon: '🖥', label: 'Desktop', desc: '> 1024px · Required' },
          { icon: '📱', label: 'Tablet', desc: '768–1024px · Optional (falls back to desktop)' },
          { icon: '📲', label: 'Mobile', desc: '< 768px · Optional (falls back to desktop)' },
        ].map(item => (
          <div key={item.label}
            className="flex items-start gap-2 px-3 py-2.5"
            style={{ background: '#0a0b0a', border: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="mt-0.5">{item.icon}</span>
            <div>
              <div className="font-bold" style={{ color: '#6b6059' }}>{item.label}</div>
              <div style={{ color: '#3a3530' }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Slides ───────────────────────────────────────────────────────── */}
      {slides.length === 0 ? (
        <div className="py-20 text-center"
          style={{ border: '1px dashed rgba(255,255,255,0.06)' }}>
          <div className="font-[family-name:var(--font-inter)] text-sm mb-3" style={{ color: '#4b5563' }}>
            No slides yet
          </div>
          <button
            onClick={() => addFileRef.current?.click()}
            disabled={addingSlide}
            className="font-[family-name:var(--font-inter)] text-xs font-black uppercase tracking-wider"
            style={{ color: '#ff571a' }}
          >
            Upload your first hero slide →
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
              onOptimisticUpdate={handleOptimisticUpdate}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onMoveUp={id => handleMove(id, 'up')}
              onMoveDown={id => handleMove(id, 'down')}
              onToast={showToast}
            />
          ))}
        </div>
      )}
    </div>
  )
}
