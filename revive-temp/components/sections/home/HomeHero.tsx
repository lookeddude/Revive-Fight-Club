'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { buildWhatsAppUrl, WHATSAPP_MESSAGES } from '@/lib/business'
import type { HeroSlide, HeroSettings } from '@/lib/data/heroSlideshow'

const DEFAULT_HERO = 'https://hnmtjcpmdywwtafgexxk.supabase.co/storage/v1/object/public/revive-brand/seconf.png'

interface HomeHeroProps {
  whatsappNumber?: string | null
  slides?: HeroSlide[]
  settings?: HeroSettings
}

type ScreenSize = 'mobile' | 'tablet' | 'desktop'

function getScreenSize(w: number): ScreenSize {
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

function getSlideImage(slide: HeroSlide, size: ScreenSize): string {
  if (size === 'mobile' && slide.mobile_url) return slide.mobile_url
  if (size === 'tablet' && slide.tablet_url) return slide.tablet_url
  return slide.desktop_url
}

const DISCIPLINES = ['MMA', 'MUAY THAI', 'BOXING', 'BJJ']

export function HomeHero({ whatsappNumber, slides = [], settings }: HomeHeroProps) {
  const whatsappUrl = buildWhatsAppUrl(whatsappNumber ?? null, WHATSAPP_MESSAGES.general)
  const activeSlides = slides.filter(s => s.is_active)
  const intervalMs = (settings?.interval_seconds ?? 5) * 1000
  const transition = settings?.transition ?? 'fade'

  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop')
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setScreenSize(getScreenSize(window.innerWidth))
    const onResize = () => setScreenSize(getScreenSize(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const goTo = useCallback((idx: number) => {
    if (activeSlides.length <= 1) return
    setPhase('out')
    setTimeout(() => {
      setCurrentIndex(idx)
      setPhase('in')
      setTimeout(() => setPhase('idle'), 500)
    }, 350)
  }, [activeSlides.length])

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % activeSlides.length)
  }, [currentIndex, activeSlides.length, goTo])

  const goPrev = useCallback(() => {
    goTo((currentIndex - 1 + activeSlides.length) % activeSlides.length)
  }, [currentIndex, activeSlides.length, goTo])

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return
    timerRef.current = setTimeout(goNext, intervalMs)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [currentIndex, isPaused, intervalMs, goNext, activeSlides.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  const currentSlide = activeSlides[currentIndex]
  const bgImage = currentSlide ? getSlideImage(currentSlide, screenSize) : DEFAULT_HERO
  const bgAlt = currentSlide?.alt_text ?? 'Revive Fight Club athletes training'
  const bgOpacity = phase === 'out' ? 0 : 1

  return (
    <section
      className="relative overflow-hidden flex flex-col justify-end"
      style={{ height: '100svh', minHeight: '600px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Background Image ─────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            opacity: bgOpacity,
            transition: transition === 'fade' ? 'opacity 0.35s ease' : 'opacity 0.15s ease',
          }}
        >
          <Image
            key={bgImage}
            src={bgImage}
            alt={bgAlt}
            fill
            priority
            quality={90}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>

        {/* Bottom-only gradient — image visible at top 60% */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(8,7,6,1) 0%, rgba(8,7,6,0.88) 20%, rgba(8,7,6,0.45) 45%, rgba(8,7,6,0.1) 65%, transparent 80%)',
          }}
        />
        {/* Subtle header vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(8,7,6,0.5) 0%, transparent 18%)' }}
        />
        {/* Orange glow accent at bottom-left */}
        <div
          className="absolute bottom-0 left-0 w-96 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at bottom left, rgba(255,87,26,0.18) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
      </div>

      {/* ── Spacer — pushes content to bottom ───────────────────────── */}
      <div className="flex-1 relative z-10 flex items-start pt-28 px-6 md:px-14">
        {/* Optional: top-left minimal badge visible through the image */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-0.5 bg-[#ff571a]" />
          <span
            className="font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff571a]/80"
          >
            Bengaluru&apos;s Elite Combat Gym
          </span>
        </div>
      </div>

      {/* ── Main Content — anchored to bottom ───────────────────────── */}
      <div className="relative z-10 w-full px-6 md:px-14 pb-5">

        {/* Discipline tags — horizontal row */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {DISCIPLINES.map((d, i) => (
            <span key={d} className="flex items-center gap-2">
              <span
                className="font-[family-name:var(--font-inter)] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff571a]/90"
              >
                {d}
              </span>
              {i < DISCIPLINES.length - 1 && (
                <span className="w-1 h-1 rounded-full bg-[#ff571a]/40" />
              )}
            </span>
          ))}
        </div>

        {/* Brand name — ONE horizontal line */}
        <h1
          className="font-[family-name:var(--font-outfit)] font-black uppercase leading-none tracking-[-0.02em] mb-4"
          style={{ fontSize: 'clamp(38px, 7.5vw, 96px)' }}
        >
          <span className="text-[#f5f2ed]">REVIVE </span>
          <span className="text-[#ff571a]">FIGHT </span>
          <span
            style={{
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(245,242,237,0.6)',
            }}
          >
            CLUB
          </span>
        </h1>

        {/* Bottom row — tagline left, CTAs right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          {/* Left: Location + tagline */}
          <div className="flex flex-col gap-1">
            <p
              className="font-[family-name:var(--font-inter)] font-medium text-[#f5f2ed]/90"
              style={{ fontSize: 'clamp(13px, 1.4vw, 16px)' }}
            >
              Frazer Town, Bengaluru
            </p>
            <p
              className="font-[family-name:var(--font-inter)] text-[#9a9088]"
              style={{ fontSize: 'clamp(11px, 1.1vw, 13px)' }}
            >
              Precision &nbsp;·&nbsp; Discipline &nbsp;·&nbsp; Transformation
            </p>
          </div>

          {/* Right: CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/book-trial"
              className="inline-flex items-center gap-2 font-[family-name:var(--font-inter)] font-black uppercase tracking-[0.12em] transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #ff571a, #d94418)',
                color: '#000',
                padding: 'clamp(12px,1.4vw,16px) clamp(22px,2.5vw,36px)',
                fontSize: 'clamp(11px,1vw,13px)',
                boxShadow: '0 0 28px rgba(255,87,26,0.35)',
              }}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              BOOK FREE TRIAL
            </Link>

            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact on WhatsApp"
                className="inline-flex items-center gap-2 font-[family-name:var(--font-inter)] font-bold uppercase tracking-[0.1em] transition-all duration-200 active:scale-95 hover:border-[#25d366] hover:text-[#25d366]"
                style={{
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: 'rgba(245,242,237,0.85)',
                  padding: 'clamp(12px,1.4vw,16px) clamp(18px,2vw,28px)',
                  fontSize: 'clamp(11px,1vw,13px)',
                  backdropFilter: 'blur(6px)',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                <svg className="w-3.5 h-3.5 shrink-0 fill-[#25d366]" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WHATSAPP
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-flex items-center font-[family-name:var(--font-inter)] font-bold uppercase tracking-[0.1em] transition-all duration-200"
                style={{
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: 'rgba(245,242,237,0.85)',
                  padding: 'clamp(12px,1.4vw,16px) clamp(18px,2vw,28px)',
                  fontSize: 'clamp(11px,1vw,13px)',
                  backdropFilter: 'blur(6px)',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                CONTACT US
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Dots only — no arrows, no counter ───────────────────────── */}
      {activeSlides.length > 1 && (
        <div className="relative z-20 w-full flex items-center justify-center gap-1.5 pb-5">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: i === currentIndex ? '22px' : '6px',
                height: '6px',
                borderRadius: '4px',
                background: i === currentIndex ? '#ff571a' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {activeSlides.length > 1 && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] z-20" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            key={`${currentIndex}-${intervalMs}`}
            className="h-full origin-left"
            style={{
              background: 'linear-gradient(to right, #ff571a, #e03020)',
              animation: `heroProgress ${intervalMs}ms linear`,
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes heroProgress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  )
}
