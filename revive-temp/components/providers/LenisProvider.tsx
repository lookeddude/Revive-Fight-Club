'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * LenisProvider
 * Initialises Lenis smooth scroll globally and wires GSAP ScrollTrigger sync.
 *
 * Integration strategy:
 *   - GSAP ticker drives Lenis (replaces manual requestAnimationFrame loop)
 *   - lenis.on('scroll', ScrollTrigger.update) keeps ST position in sync
 *   - gsap.ticker.lagSmoothing(0) prevents jumps from large time deltas
 *   - ScrollTrigger.normalizeScroll is disabled (Lenis owns scroll normalisation)
 *
 * Scroll personality: fast, controlled, expo-out — athletic, confident.
 * prefers-reduced-motion: Lenis disables smooth scroll automatically.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lenis = new Lenis({
      duration: prefersReduced ? 0 : 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      touchMultiplier: 1.5,
      wheelMultiplier: 0.9,
      smoothWheel: !prefersReduced,
    })

    lenisRef.current = lenis

    // Sync ScrollTrigger with Lenis virtual scroll position
    lenis.on('scroll', ScrollTrigger.update)

    // GSAP ticker drives Lenis — replaces manual RAF loop
    // Converts GSAP seconds → Lenis milliseconds
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)

    // Prevent large time-delta jumps (tab switching, long frames)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
