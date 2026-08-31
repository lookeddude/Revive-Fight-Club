'use client'

/**
 * GsapHeroReveal
 * ================
 * Wraps any page hero section and runs an entrance timeline on mount.
 * No ScrollTrigger — heroes are immediately visible, so animations play right away.
 *
 * Usage:
 *   <GsapHeroReveal>
 *     <section>
 *       <p className="gsap-label">Label text</p>
 *       <h1 className="gsap-heading">Main heading</h1>
 *       <p className="gsap-text">Subtitle / description</p>
 *       <div className="gsap-extra">Extra content (stats, buttons, etc.)</div>
 *     </section>
 *   </GsapHeroReveal>
 *
 * Each class is optional — the timeline skips missing elements.
 * Multiple .gsap-extra elements stagger in sequence.
 * Respects prefers-reduced-motion: skips animation, content stays visible.
 *
 * Performance: GSAP is dynamically imported inside useEffect —
 * it does NOT appear in the critical-path JS bundle.
 */

import { useEffect, useRef } from 'react'

interface GsapHeroRevealProps {
  children: React.ReactNode
  className?: string
  /** Delay before timeline starts (ms) */
  delay?: number
}

export function GsapHeroReveal({ children, className = '', delay = 0 }: GsapHeroRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let mounted = true
    let cleanup: (() => void) | null = null

    import('@/lib/gsap').then(({ gsap }) => {
      if (!mounted || !el) return

      const label    = el.querySelector<HTMLElement>('.gsap-label')
      const headings = Array.from(el.querySelectorAll<HTMLElement>('.gsap-heading'))
      const text     = el.querySelector<HTMLElement>('.gsap-text')
      const extras   = el.querySelectorAll<HTMLElement>('.gsap-extra')

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: delay / 1000 })

        if (label) {
          tl.fromTo(label,
            { opacity: 0, x: -16 },
            { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' }
          )
        }

        if (headings.length > 0) {
          tl.fromTo(headings,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 },
            label ? '-=0.28' : 0
          )
        }

        if (text) {
          tl.fromTo(text,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            '-=0.42'
          )
        }

        if (extras.length > 0) {
          tl.fromTo(extras,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.07 },
            '-=0.35'
          )
        }
      }, el)

      cleanup = () => ctx.revert()
    })

    return () => {
      mounted = false
      cleanup?.()
    }
  }, [delay])

  return (
    <div ref={ref} className={className || undefined}>
      {children}
    </div>
  )
}
