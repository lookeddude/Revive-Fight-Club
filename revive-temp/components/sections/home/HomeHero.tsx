'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { buildWhatsAppUrl, WHATSAPP_MESSAGES } from '@/lib/business'
import type { HeroSlide, HeroSettings } from '@/lib/data/heroSlideshow'
import { GsapParallax } from '@/components/gsap/GsapParallax'

const DEFAULT_HERO = ''

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

  const disciplines = programNames.length > 0 ? programNames : ['MMA', 'Boxing', 'Muay Thai']

  return (
    <section
      className="relative overflow-hidden flex flex-col"
      style={{ height: '100svh', minHeight: '620px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Background Image ── */}
      <div className="absolute inset-0 z-0">
        <GsapParallax speed={0.1} className="w-full h-full">
          <div
            className="absolute inset-0"
            style={{
              opacity: bgOpacity,
              transition: transition === 'fade' ? 'opacity 0.4s ease' : 'opacity 0.15s ease',
            }}
          >
            <Image
              key={bgImage}
              src={bgImage}
              alt={bgAlt}
              fill
              priority
              quality={80}
              fetchPriority="high"
              sizes="100vw"
              className="hero-bg-img img-settle"
              style={{ objectFit: 'cover', objectPosition: screenSize === 'mobile' ? 'center 30%' : 'center top' }}
            />
          </div>
        </GsapParallax>

        {/* Cinematic dark overlay — heavier at top and bottom */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(14,12,16,0.35) 0%, rgba(14,12,16,0.08) 30%, rgba(14,12,16,0.15) 55%, rgba(14,12,16,0.92) 100%)',
          }}
          aria-hidden="true"
        />
        {/* Side vignettes */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(14,12,16,0.3) 0%, transparent 35%, transparent 65%, rgba(14,12,16,0.2) 100%)' }}
          aria-hidden="true"
        />
      </div>

      {/* ── Main Content — anchored to lower-left safe area ── */}
      <div className="relative z-10 flex flex-col justify-end flex-1 w-full px-5 sm:px-8 md:px-12 lg:px-16 pb-16 sm:pb-20 md:pb-20 lg:pb-24" style={{ paddingTop: 'clamp(48vh, 52vh, 56vh)' }}>

        <div style={{ maxWidth: '620px' }}>
          {/* Discipline eyebrow tags */}
          <div
            className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-3 md:mb-4${entered ? ' hero-enter' : ''}`}
            style={entered ? ({ '--hero-delay': '0ms', '--hero-dur': '0.65s' } as React.CSSProperties) : undefined}
          >
            {disciplines.map((d, i, arr) => (
              <span key={d} className="flex items-center gap-2.5">
                <span
                  className="font-[family-name:var(--font-body)] text-[10px] sm:text-[11px] md:text-[11px] lg:text-[12px] font-bold tracking-[0.22em] uppercase text-[#A0A0A8]"
                >
                  {d}
                </span>
                {i < arr.length - 1 && (
                  <span className="w-px h-3 bg-white/20 flex-shrink-0" aria-hidden="true" />
                )}
              </span>
            ))}
          </div>

          {/* Main heading — strong but compact, doesn't cover fighters */}
          <h1
            className={`font-[family-name:var(--font-outfit)] font-black uppercase text-[#FCFDFD] leading-[0.92] tracking-[-0.04em] mb-4 md:mb-5${entered ? ' hero-enter' : ''}`}
            style={{
              fontSize: 'clamp(36px, 5.5vw, 72px)',
              ...(entered ? ({ '--hero-delay': '130ms', '--hero-dur': '0.75s' } as React.CSSProperties) : {})
            }}
          >
            REVIVE<br />
            <span style={{ WebkitTextStroke: '1.5px rgba(252,253,253,0.35)', color: 'transparent' }}>
              FIGHT
            </span>{' '}
            CLUB
          </h1>

          {/* Tagline */}
          <p
            className={`font-[family-name:var(--font-body)] text-[#A0A0A8] mb-6 md:mb-7${entered ? ' hero-enter' : ''}`}
            style={{
              fontSize: 'clamp(12px, 1.1vw, 15px)',
              maxWidth: '420px',
              lineHeight: 1.7,
              ...(entered ? ({ '--hero-delay': '260ms', '--hero-dur': '0.65s' } as React.CSSProperties) : {})
            }}
          >
            Bengaluru&apos;s elite combat gym — where discipline meets performance.
            MMA, Boxing, Muay Thai, BJJ &amp; more.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4${entered ? ' hero-enter' : ''}`}
            style={entered ? ({ '--hero-delay': '380ms', '--hero-dur': '0.65s' } as React.CSSProperties) : undefined}
          >
            {/* Primary — solid white, clean and bold */}
            <Link
              href="/book-trial"
              className="hero-btn-primary inline-flex justify-center items-center gap-2.5 font-[family-name:var(--font-body)] text-[13px] font-bold tracking-[0.14em] uppercase px-8 py-[14px] bg-white text-[#0E0C10] transition-all duration-300 hover:-translate-y-[2px] active:scale-[0.97] sm:w-auto"
            >
              ENROLL NOW
              <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            {/* Secondary — outlined, clean border */}
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact on WhatsApp"
                className="hero-btn-secondary inline-flex justify-center items-center gap-2.5 font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-[0.14em] px-7 py-[14px] transition-all duration-300 hover:-translate-y-[2px] active:scale-[0.97] text-white border border-white/25 hover:border-white/50 hover:bg-white/[0.07] sm:w-auto"
              >
                <svg className="w-4 h-4 text-[#25d366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WHATSAPP
              </a>
            ) : (
              <Link
                href="/contact"
                className="hero-btn-secondary inline-flex justify-center items-center gap-2 font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-[0.14em] px-7 py-[14px] transition-all duration-300 hover:-translate-y-[2px] active:scale-[0.97] text-white border border-white/25 hover:border-white/50 hover:bg-white/[0.07] sm:w-auto"
              >
                CONTACT US
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Slide indicators ── */}
      {activeSlides.length > 1 && (
        <div className="relative z-20 w-full flex justify-center px-6 md:px-12 pb-4">
          <div className="flex gap-1.5">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className="transition-all duration-300"
                style={{
                  width: i === currentIndex ? '28px' : '14px',
                  height: '1.5px',
                  background: i === currentIndex ? 'rgba(252,253,253,0.8)' : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
