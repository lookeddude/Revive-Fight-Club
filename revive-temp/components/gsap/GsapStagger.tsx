'use client'

/**
 * GsapStagger
 * ============
 * Staggers children with `.gsap-item` class into view using ScrollTrigger.
 * Creates visual rhythm for card grids, bullet lists, table rows.
 *
 * Usage:
 *   <GsapStagger>
 *     <div className="gsap-item">Card 1</div>
 *     <div className="gsap-item">Card 2</div>
 *     <div className="gsap-item">Card 3</div>
 *   </GsapStagger>
 *
 * If children don't have .gsap-item, falls back to animating all direct children.
 */

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

interface GsapStaggerProps {
  children: React.ReactNode
  /** Stagger time between each item (seconds, default: 0.07) */
  stagger?: number
  /** Vertical distance (px, default: 28) */
  distance?: number
  /** Delay before stagger starts (ms, default: 0) */
  delay?: number
  className?: string
  /** Override child selector (default: '.gsap-item, > *') */
  selector?: string
}

export function GsapStagger({
  children,
  stagger = 0.07,
  distance = 28,
  delay = 0,
  className = '',
  selector = '.gsap-item',
}: GsapStaggerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Use .gsap-item selector, fall back to direct children
    let targets = Array.from(el.querySelectorAll<HTMLElement>(selector))
    if (targets.length === 0) {
      targets = Array.from(el.children) as HTMLElement[]
    }
    if (targets.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(targets,
        { opacity: 0, y: distance },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
          stagger,
          delay: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [stagger, distance, delay, selector])

  return (
    <div ref={ref} className={className || undefined}>
      {children}
    </div>
  )
}
