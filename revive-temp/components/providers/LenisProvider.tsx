'use client'

import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'

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
 * Performance: Lenis + GSAP are dynamically imported AFTER first paint.
 * This keeps them out of the critical path JS bundle.
 *
 * Scroll personality: fast, controlled, expo-out — athletic, confident.
 * prefers-reduced-motion: Lenis disables smooth scroll automatically.
 *
 * Cleanup: gsap.ticker.remove(tick) is called on unmount to prevent
 * orphaned ticker callbacks from accumulating across mounts.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let mounted = true
    // Keep references for cleanup — must be accessible from the return callback
    let _gsap: { ticker: { add: (fn: (t: number) => void) => void; remove: (fn: (t: number) => void) => void } } | null = null
    let _tick: ((time: number) => void) | null = null

    // Dynamic imports — keeps Lenis + GSAP out of the initial JS bundle
    Promise.all([
      import('lenis'),
      import('@/lib/gsap'),
    ]).then(([{ default: LenisClass }, { gsap, ScrollTrigger }]) => {
      // If component unmounted before import resolved, bail out immediately
      if (!mounted) return

      const lenis = new LenisClass({
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

      // Store references so cleanup can properly remove the ticker
      _gsap = gsap
      _tick = tick
    })

    return () => {
      mounted = false

      // Remove the GSAP ticker to prevent orphaned callbacks
      if (_gsap && _tick) {
        _gsap.ticker.remove(_tick)
      }

      // Destroy Lenis instance and its internal RAF
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
    }
  }, [])

  return <>{children}</>
}
