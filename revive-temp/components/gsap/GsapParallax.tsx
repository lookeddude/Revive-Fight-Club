'use client'

/**
 * GsapParallax
 * =============
 * Applies subtle scroll-linked parallax to its direct child element.
 * Desktop only — disabled on mobile for performance and touch usability.
 *
 * Works by animating the child's yPercent as the parent scrolls out of view.
 * The child should be `position: absolute; inset: 0` to avoid clipping issues.
 *
 * Usage (in HomeHero — the overlay layer):
 *   <GsapParallax speed={0.15}>
 *     <div className="absolute inset-0">
 *       overlay content
 *     </div>
 *   </GsapParallax>
 *
 * speed: 0 = no movement, 1 = moves at same speed as scroll, 0.15 = subtle depth
 *
 * Performance: GSAP is dynamically imported inside useEffect —
 * it does NOT appear in the critical-path JS bundle.
 */

import { useEffect, useRef } from 'react'

interface GsapParallaxProps {
  children: React.ReactNode
  /** Parallax intensity: 0 (none) → 0.4 (strong). Recommended: 0.12–0.2 */
  speed?: number
  className?: string
}

export function GsapParallax({ children, speed = 0.15, className = '' }: GsapParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Skip on mobile — parallax degrades touch UX + performance
    if (window.matchMedia('(max-width: 767px)').matches) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const child = container.firstElementChild as HTMLElement | null
    if (!child) return

    let mounted = true
    let cleanup: (() => void) | null = null

    import('@/lib/gsap').then(({ gsap }) => {
      if (!mounted || !container) return

      const ctx = gsap.context(() => {
        gsap.to(child, {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }, container)

      cleanup = () => ctx.revert()
    })

    return () => {
      mounted = false
      cleanup?.()
    }
  }, [speed])

  return (
    <div ref={containerRef} className={`relative overflow-hidden${className ? ' ' + className : ''}`}>
      {children}
    </div>
  )
}
