'use client'

/**
 * GsapCountUp
 * ============
 * Animates a number from 0 → target when it scrolls into view.
 * Uses ScrollTrigger `once: true` — plays once, never replays.
 *
 * Usage:
 *   <GsapCountUp target={126} className="stat-number text-[80px]" />
 *   <GsapCountUp target={5.0} decimals={1} className="..." />
 *
 * Note: renders final value on server (SSR). GSAP resets to 0 and
 * counts up on client. suppressHydrationWarning prevents React from
 * complaining about the mismatch.
 *
 * Performance: GSAP is dynamically imported inside useEffect —
 * it does NOT appear in the critical-path JS bundle.
 */

import { useEffect, useRef } from 'react'

interface GsapCountUpProps {
  /** Final numeric value to animate to */
  target: number
  /** Decimal places (default: 0) */
  decimals?: number
  /** Duration of count animation in seconds (default: 1.8) */
  duration?: number
  /** Additional class names */
  className?: string
  /** Style overrides */
  style?: React.CSSProperties
}

export function GsapCountUp({
  target,
  decimals = 0,
  duration = 1.8,
  className = '',
  style,
}: GsapCountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.textContent = target.toFixed(decimals)
      return
    }

    let mounted = true
    let st: { kill(): void } | null = null

    import('@/lib/gsap').then(({ gsap, ScrollTrigger }) => {
      if (!mounted || !el) return

      const obj = { value: 0 }

      st = ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            value: target,
            duration,
            ease: 'power2.out',
            onUpdate() {
              if (el) el.textContent = obj.value.toFixed(decimals)
            },
            onComplete() {
              if (el) el.textContent = target.toFixed(decimals)
            },
          })
        },
      })
    })

    return () => {
      mounted = false
      st?.kill()
    }
  }, [target, decimals, duration])

  return (
    <span
      ref={ref}
      className={className || undefined}
      style={style}
      suppressHydrationWarning
    >
      {/* Server renders final value; GSAP resets and counts up on client */}
      {target.toFixed(decimals)}
    </span>
  )
}
