'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { motion } from 'motion/react'

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

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-24 pb-16 md:pt-36 md:pb-24"
      style={{ background: '#0a0b0a' }}
    >
      {/* Background: diagonal orange shard */}
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

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px w-10 bg-[#ff571a]" />
          <span
            className="font-[family-name:var(--font-body)] text-xs font-black uppercase tracking-[0.25em]"
            style={{ color: '#ff571a' }}
          >
            Membership Plans
          </span>
        </motion.div>

        {/* Headline — two-line stacked */}
        <div className="mb-4 overflow-hidden">
          <motion.h1
            initial={{ y: '102%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-[family-name:var(--font-outfit)] font-black uppercase leading-[0.88] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(52px, 10vw, 120px)', color: '#f0ede8' }}
          >
            TRAIN
          </motion.h1>
        </div>
        <div className="mb-2 overflow-hidden">
          <motion.h1
            initial={{ y: '102%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
            className="font-[family-name:var(--font-outfit)] font-black uppercase leading-[0.88] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(52px, 10vw, 120px)', color: '#ff571a' }}
          >
            HARDER.
          </motion.h1>
        </div>

        {/* Animated underline */}
        <div
          ref={lineRef}
          className="h-[3px] mb-8 max-w-[480px]"
          style={{ background: 'linear-gradient(90deg, #ff571a 0%, rgba(255,87,26,0.1) 100%)' }}
        />

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.45 }}
          className="font-[family-name:var(--font-body)] text-base md:text-lg max-w-lg mb-12"
          style={{ color: '#6b7280', lineHeight: 1.65 }}
        >
          Transparent pricing for every level. No hidden fees — just elite combat sports coaching at Fraser Town, Bengaluru.
        </motion.p>

        {/* Stats row */}
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
    </section>
  )
}
