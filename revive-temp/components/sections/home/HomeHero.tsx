'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { buildWhatsAppUrl, WHATSAPP_MESSAGES } from '@/lib/business'
import type { HeroSlide, HeroSettings } from '@/lib/data/heroSlideshow'
import { GsapParallax } from '@/components/gsap/GsapParallax'

const DEFAULT_HERO = 'https://hnmtjcpmdywwtafgexxk.supabase.co/storage/v1/object/public/revive-brand/seconf.png'

interface HomeHeroProps {
  whatsappNumber?: string | null
  slides?: HeroSlide[]
  settings?: HeroSettings
  programNames?: string[]
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


export function HomeHero({ whatsappNumber, slides = [], settings, programNames = [] }: HomeHeroProps) {
  const whatsappUrl = buildWhatsAppUrl(whatsappNumber ?? null, WHATSAPP_MESSAGES.general)
  const activeSlides = slides.filter(s => s.is_active)
  const intervalMs = (settings?.interval_seconds ?? 5) * 1000
  const transition = settings?.transition ?? 'fade'

  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop')
  const [isPaused, setIsPaused] = useState(false)
  const [entered, setEntered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Trigger entrance animation after mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])


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
      <div className="absolute inset-0 z-0 overflow-hidden">
        <GsapParallax speed={0.12} className="absolute inset-0">
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
              className="hero-bg-img img-settle"
              style={{ objectFit: 'cover', objectPosition: screenSize === 'mobile' ? 'center -10px' : 'center top' }}
            />
          </div>
        </GsapParallax>

        {/* Bottom-only gradient — lighter so images breathe at top 65% */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(8,7,6,0.98) 0%, rgba(8,7,6,0.7) 18%, rgba(8,7,6,0.3) 42%, rgba(8,7,6,0.05) 62%, transparent 78%)',
          }}
          aria-hidden="true"
        />
        {/* Subtle header vignette so nav is readable */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(8,7,6,0.45) 0%, transparent 15%)' }}
          aria-hidden="true"
        />
        {/* Orange accent glow — bottom-left energy */}
        <div
          className="absolute bottom-0 left-0 w-[500px] h-80 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at bottom left, rgba(255,87,26,0.14) 0%, transparent 65%)' }}
          aria-hidden="true"
        />
      </div>


      {/* ── Spacer — pushes main content to bottom ───────────────────── */}
      <div className="flex-1" />


      {/* ── Main Content — anchored to bottom ───────────────────────── */}
      <div className="relative z-10 w-full px-6 md:px-14 pb-2">


        {/* Discipline tags */}
        <div
          className={`flex flex-wrap items-center gap-2 mb-3${entered ? ' hero-enter' : ''}`}
          style={entered ? ({ '--hero-delay': '0ms', '--hero-dur': '0.6s' } as React.CSSProperties) : undefined}
        >
          {(programNames.length > 0 ? programNames : ['MMA', 'BOXING', 'BJJ']).map((d, i, arr) => (
            <span key={d} className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              <span
                className="font-[family-name:var(--font-body)] text-xs md:text-sm font-black uppercase"
                style={{ color: 'rgba(255,87,26,0.95)', letterSpacing: '0.1em' }}
              >
                {d}
              </span>
              {i < arr.length - 1 && (
                <span
                  className="w-[3px] h-[3px] rounded-full flex-shrink-0"
                  style={{ background: 'rgba(255,87,26,0.35)' }}
                  aria-hidden="true"
                />
              )}
            </span>
          ))}
        </div>

        {/* Brand name — ONE horizontal line */}
        <h1
          className={`font-[family-name:var(--font-outfit)] font-black uppercase leading-none tracking-[-0.02em] mb-4${entered ? ' hero-enter' : ''}`}
          style={{ fontSize: 'clamp(38px, 7.5vw, 96px)', ...(entered ? ({ '--hero-delay': '160ms', '--hero-dur': '0.72s' } as React.CSSProperties) : {}) }}
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
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5${entered ? ' hero-enter' : ''}`}
          style={entered ? ({ '--hero-delay': '340ms', '--hero-dur': '0.65s' } as React.CSSProperties) : undefined}
        >

          {/* Left: Location + tagline */}
          <div className="flex flex-col gap-1">
            <p
              className="font-[family-name:var(--font-outfit)] font-black uppercase tracking-[0.06em]"
              style={{ fontSize: 'clamp(13px, 1.4vw, 16px)', color: '#e8e3dc' }}
            >
              Bengaluru&apos;s Elite Combat Gym
            </p>
            <p
              className="font-[family-name:var(--font-body)] text-[#9a9088]"
              style={{ fontSize: 'clamp(11px, 1.1vw, 13px)' }}
            >
              Precision &nbsp;·&nbsp; Discipline &nbsp;·&nbsp; Transformation
            </p>
          </div>

          {/* Right: CTA Buttons */}
          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3">
            <Link
              href="/book-trial"
              className="inline-flex justify-center items-center gap-2 font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-6 py-4 sm:py-3 transition-colors duration-200 active:scale-95 bg-[var(--color-primary)] text-black hover:bg-[var(--color-primary-hover)] shrink-0 w-full sm:w-auto"
            >
              BOOK TRIAL
            </Link>

            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact on WhatsApp"
                className="inline-flex justify-center items-center gap-2 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.1em] px-6 py-4 sm:py-3 transition-colors duration-200 active:scale-95 border border-[#25d366]/50 text-[#25d366] hover:bg-[#25d366]/10 w-full sm:w-auto"
              >
                WHATSAPP
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-flex justify-center items-center gap-2 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.1em] px-6 py-4 sm:py-3 transition-colors duration-200 active:scale-95 border border-[var(--color-outline-variant)] text-[var(--color-on-background)] hover:bg-[var(--color-surface-container-high)] w-full sm:w-auto"
              >
                CONTACT US
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Slider Controls ───────────────────────── */}
      {activeSlides.length > 1 && (
        <div className="relative z-20 w-full flex justify-center px-6 md:px-14 pb-3">
          <div className="flex gap-1.5">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className="transition-all duration-300"
                style={{
                  width: i === currentIndex ? '32px' : '16px',
                  height: '2px',
                  background: i === currentIndex ? 'var(--color-primary)' : 'var(--color-outline-variant)',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
