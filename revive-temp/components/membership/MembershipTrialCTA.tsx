'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { Button } from '@/components/ui/Button'

interface MembershipTrialCTAProps {
  whatsappNumber: string | null
}

export function MembershipTrialCTA({ whatsappNumber }: MembershipTrialCTAProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const priceRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !sectionRef.current) return

    const ctx = gsap.context(() => {
      // Price counter animation
      if (priceRef.current) {
        gsap.fromTo(priceRef.current,
          { innerText: 0 },
          {
            innerText: 1000,
            duration: 1.4,
            ease: 'power2.out',
            snap: { innerText: 100 },
            scrollTrigger: {
              trigger: priceRef.current,
              start: 'top 85%',
              once: true,
            },
            onUpdate() {
              if (priceRef.current) {
                const val = Math.round(parseFloat(priceRef.current.innerText))
                priceRef.current.innerText = `₹${val.toLocaleString('en-IN')}`
              }
            },
            onComplete() {
              if (priceRef.current) priceRef.current.innerText = '₹1,000'
            }
          }
        )
      }

      // Section elements stagger in
      gsap.fromTo('.trial-cta-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          stagger: 0.1,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const waLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hi%2C%20I%20want%20to%20book%20a%20trial%20class%20at%20Revive%20Fight%20Club.`
    : null

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-36"
      style={{ background: '#0a0b0a', borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      {/* Large background text — decorative */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-[family-name:var(--font-outfit)] font-black uppercase text-center leading-none tracking-[-0.06em] opacity-[0.025]"
          style={{ fontSize: 'clamp(80px, 18vw, 220px)', color: '#ff571a', whiteSpace: 'nowrap' }}
        >
          TRIAL
        </span>
      </div>

      {/* Radial glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[60%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(255,87,26,0.10) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[900px] mx-auto px-5 md:px-12 text-center">
        {/* Pill label */}
        <div className="trial-cta-item opacity-0 inline-flex items-center gap-2 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ff571a] animate-pulse" />
          <span
            className="font-[family-name:var(--font-body)] text-xs font-black uppercase tracking-[0.25em]"
            style={{ color: '#ff571a' }}
          >
            Not ready to commit?
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#ff571a] animate-pulse" />
        </div>

        {/* Headline */}
        <h2 className="trial-cta-item opacity-0 font-[family-name:var(--font-outfit)] font-black uppercase leading-[0.88] tracking-[-0.04em] mb-6"
          style={{ fontSize: 'clamp(40px, 7vw, 80px)', color: '#f0ede8' }}>
          Try One Class.<br />
          <span style={{ color: '#ff571a' }}>Feel The Difference.</span>
        </h2>

        {/* Price counter */}
        <div className="trial-cta-item opacity-0 mb-3">
          <span
            ref={priceRef}
            className="font-[family-name:var(--font-outfit)] font-black"
            style={{ fontSize: 'clamp(56px, 9vw, 100px)', color: '#ff571a', letterSpacing: '-0.04em' }}
          >
            ₹0
          </span>
        </div>
        <p
          className="trial-cta-item opacity-0 font-[family-name:var(--font-body)] text-sm uppercase tracking-[0.2em] mb-10"
          style={{ color: '#4b5563' }}
        >
          per trial session · no commitment
        </p>

        {/* Sub-copy */}
        <p className="trial-cta-item opacity-0 font-[family-name:var(--font-body)] text-base max-w-md mx-auto leading-relaxed mb-10"
          style={{ color: '#6b7280' }}>
          Experience world-class combat sports training under professional coaches. Walk in — decide for yourself.
        </p>

        {/* CTAs */}
        <div className="trial-cta-item opacity-0 flex flex-wrap items-center justify-center gap-4">
          <Button href="/book-trial" variant="primary">
            BOOK A TRIAL — ₹1,000
          </Button>

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.1em] px-6 py-3 transition-colors"
              style={{ color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#f0ede8'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#9ca3af'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              ASK ON WHATSAPP
            </a>
          )}
        </div>

        {/* Location note */}
        <p className="trial-cta-item opacity-0 mt-8 font-[family-name:var(--font-body)] text-xs"
          style={{ color: '#3a3530' }}>
          3rd Floor, 157 MM Road, Fraser Town, Bengaluru — Mon to Sat
        </p>
      </div>
    </section>
  )
}
