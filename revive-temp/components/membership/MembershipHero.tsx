'use client'

/**
 * MembershipHero
 * ===============
 * Hero section for the /membership page.
 *
 * Animation strategy:
 *   - Eyebrow, headlines, and body copy: CSS @keyframes (no JS library needed)
 *   - Scan line + stat blocks: GSAP (dynamically imported after first paint)
 *   - prefers-reduced-motion: all animations disabled via CSS media query
 *
 * Motion library removed — saves ~90KB gzipped from the /membership bundle.
 * GSAP loaded dynamically — does NOT appear in the critical-path JS bundle.
 */

import { useEffect, useRef } from 'react'

const STATS = [
  { value: '5+', label: 'Combat Disciplines' },
  { value: '500+', label: 'Active Members' },
  { value: '₹1K', label: 'Trial Class' },
  { value: '100%', label: 'Pro Coaches' },
]

export function MembershipHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !sectionRef.current) return

    let mounted = true
    let cleanup: (() => void) | null = null

    import('@/lib/gsap').then(({ gsap }) => {
      if (!mounted || !sectionRef.current) return

      const ctx = gsap.context(() => {
        // Animated horizontal scan line
        if (lineRef.current) {
          gsap.fromTo(lineRef.current,
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 1.4, ease: 'power4.inOut', delay: 0.3 }
          )
        }

        // Stagger in stat blocks
        gsap.fromTo('.membership-stat',
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power3.out',
            delay: 0.8,
          }
        )
      }, sectionRef)

      cleanup = () => ctx.revert()
    })

    return () => {
      mounted = false
      cleanup?.()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-24 pb-16 md:pt-36 md:pb-24"
      style={{ background: '#0a0b0a' }}
    >
      {/* Background: radial orange glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,87,26,0.12) 0%, transparent 65%)',
        }}
      />

      {/* Subtle vignette texture — pure CSS, no GPU compositing */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse at 15% 50%, rgba(255,255,255,0.012) 0%, transparent 50%)",
            "radial-gradient(ellipse at 85% 20%, rgba(255,255,255,0.008) 0%, transparent 40%)",
          ].join(', '),
          opacity: 0.5,
          mixBlendMode: 'overlay',
        }}
      />

      <div className="relative max-w-[1360px] mx-auto px-5 md:px-12">

        {/*
          Eyebrow — CSS animation replaces motion.div
          initial: { opacity: 0, x: -24 } → { opacity: 1, x: 0 }
          duration: 0.55s, ease: cubic-bezier(0.16, 1, 0.3, 1)
        */}
        <div
          className="flex items-center gap-3 mb-8 mh-fade-left"
          style={{ animationDelay: '0ms' }}
        >
          <div className="h-px w-10 bg-[#ff571a]" />
          <span
            className="font-[family-name:var(--font-body)] text-xs font-black uppercase tracking-[0.25em]"
            style={{ color: '#ff571a' }}
          >
            Membership Plans
          </span>
        </div>

        {/*
          Headline — CSS clip reveal replaces motion.h1 with y: '102%' + overflow-hidden parent
          The overflow-hidden on the wrapper clips the translateY animation for a text reveal effect
        */}
        <div className="mb-4 overflow-hidden">
          <h1
            className="font-[family-name:var(--font-outfit)] font-black uppercase leading-[0.88] tracking-[-0.04em] mh-slide-up"
            style={{ fontSize: 'clamp(52px, 10vw, 120px)', color: '#f0ede8', animationDelay: '100ms' }}
          >
            TRAIN
          </h1>
        </div>
        <div className="mb-2 overflow-hidden">
          <h1
            className="font-[family-name:var(--font-outfit)] font-black uppercase leading-[0.88] tracking-[-0.04em] mh-slide-up"
            style={{ fontSize: 'clamp(52px, 10vw, 120px)', color: '#ff571a', animationDelay: '180ms' }}
          >
            HARDER.
          </h1>
        </div>

        {/* Animated underline — driven by GSAP (scaleX) */}
        <div
          ref={lineRef}
          className="h-[3px] mb-8 max-w-[480px]"
          style={{
            background: 'linear-gradient(90deg, #ff571a 0%, rgba(255,87,26,0.1) 100%)',
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
          }}
        />

        {/*
          Sub-copy — CSS animation replaces motion.p
          initial: { opacity: 0, y: 16 } → { opacity: 1, y: 0 }
          duration: 0.6s, ease: easeOut, delay: 0.45s
        */}
        <p
          className="font-[family-name:var(--font-body)] text-base md:text-lg max-w-lg mb-12 mh-fade-up"
          style={{ color: '#6b7280', lineHeight: 1.65, animationDelay: '450ms' }}
        >
          Transparent pricing for every level. No hidden fees — just elite combat sports coaching at Fraser Town, Bengaluru.
        </p>

        {/* Stats row — stagger animation via GSAP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {STATS.map((s, i) => (
            <div
              key={i}
              className="membership-stat opacity-0 bg-[#0a0b0a] px-6 py-5 flex flex-col gap-1"
            >
              <span
                className="font-[family-name:var(--font-outfit)] font-black leading-none"
                style={{ fontSize: 'clamp(26px, 4vw, 40px)', color: '#ff571a' }}
              >
                {s.value}
              </span>
              <span
                className="font-[family-name:var(--font-body)] text-xs uppercase tracking-widest"
                style={{ color: '#4b5563' }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/*
        CSS keyframe animations for entrance effects.
        Matching the removed motion/react timing exactly:
          mh-fade-left  → replaces motion.div  (opacity+x, 0.55s, cubic-bezier(0.16,1,0.3,1))
          mh-slide-up   → replaces motion.h1   (y 102%→0, 0.75s, cubic-bezier(0.16,1,0.3,1))
          mh-fade-up    → replaces motion.p    (opacity+y, 0.6s, easeOut)
        prefers-reduced-motion: all animations disabled.
      */}
      <style>{`
        .mh-fade-left {
          animation: mhFadeLeft 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .mh-slide-up {
          animation: mhSlideUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .mh-fade-up {
          animation: mhFadeUp 0.6s ease-out both;
        }
        @keyframes mhFadeLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes mhSlideUp {
          from { transform: translateY(102%); }
          to   { transform: translateY(0); }
        }
        @keyframes mhFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mh-fade-left,
          .mh-slide-up,
          .mh-fade-up {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
