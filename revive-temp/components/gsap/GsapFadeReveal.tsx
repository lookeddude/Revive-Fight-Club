'use client'

/**
 * GsapFadeReveal
 * ===============
 * Generic scroll-triggered reveal. Wraps content and animates it
 * into view when it enters the viewport.
 *
 * Used on inner pages (about, programs, contact, etc.) where
 * Reveal.tsx is not present and no scroll animations exist.
 *
 * Usage:
 *   <GsapFadeReveal>
 *     <div>...section content...</div>
 *   </GsapFadeReveal>
 *
 *   <GsapFadeReveal direction="left" delay={100}>
 *     <div>...content slides from left...</div>
 *   </GsapFadeReveal>
 */

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

interface GsapFadeRevealProps {
  children: React.ReactNode
  /** Animation direction (default: 'up') */
  direction?: 'up' | 'left' | 'right' | 'fade'
  /** Distance in px (default: 32) */
  distance?: number
  /** Delay in ms (default: 0) */
  delay?: number
  /** Duration in seconds (default: 0.65) */
  duration?: number
  className?: string
}

export function GsapFadeReveal({
  children,
  direction = 'up',
  distance = 32,
  delay = 0,
  duration = 0.65,
  className = '',
}: GsapFadeRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const fromVars: gsap.TweenVars = { opacity: 0 }

    if (direction === 'up')    fromVars.y = distance
    if (direction === 'left')  fromVars.x = -distance
    if (direction === 'right') fromVars.x = distance

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        fromVars,
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay: delay / 1000,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            once: true,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [direction, distance, delay, duration])

  return (
    <div ref={ref} className={className || undefined}>
      {children}
    </div>
  )
}
