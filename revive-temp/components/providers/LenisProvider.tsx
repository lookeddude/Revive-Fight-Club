'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

/**
 * LenisProvider
 * Initialises Lenis smooth scroll globally.
 * Settings are tuned for an athletic, confident feel:
 *  - Fast, controlled — not floaty or bouncy
 *  - prefers-reduced-motion: Lenis auto-disables smooth scroll
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lenis = new Lenis({
      duration: prefersReduced ? 0 : 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out — snappy
      touchMultiplier: 1.5,
      wheelMultiplier: 0.9,
      smoothWheel: !prefersReduced,
    })

    lenisRef.current = lenis

    // RAF loop
    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
