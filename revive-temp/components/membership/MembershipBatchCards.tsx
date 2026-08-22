'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { motion } from 'motion/react'
import { MembershipCheckout } from '@/components/payments/MembershipCheckout'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'
import { BATCH_META, BATCH_ORDER } from '@/lib/membership-constants'
import type { Database } from '@/types/database'

type BusinessSettings = Database['public']['Tables']['business_settings']['Row'] | null

type Plan = {
  id: string
  price: number | null
  billing_period: string
  sort_label: string | null
  batch_category: string | null
}

interface MembershipBatchCardsProps {
  grouped: Record<string, Plan[]>
  settings: BusinessSettings
}

const PERIOD_LABEL: Record<string, string> = {
  monthly: '1 Mo',
  quarterly: '3 Mo',
  semiannual: '6 Mo',
  annually: '1 Yr',
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" viewBox="0 0 14 14" fill="none">
      <path d="M2 7l3.5 3.5L12 3" stroke="#ff571a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BatchCard({ cat, plans, settings, index }: {
  cat: string
  plans: Plan[]
  settings: BusinessSettings
  index: number
}) {
  const meta = BATCH_META[cat]
  const cardRef = useRef<HTMLDivElement>(null)

  // Highest price plan (annually) for the big display number
  const annualPlan = plans.find(p => p.billing_period === 'annually')
  const monthlyPlan = plans.find(p => p.billing_period === 'monthly')
  const displayPlan = annualPlan ?? monthlyPlan ?? plans[0]

  const sortedPlans = [...plans].sort((a, b) => {
    const order = ['monthly', 'quarterly', 'semiannual', 'annually']
    return order.indexOf(a.billing_period) - order.indexOf(b.billing_period)
  })

  useEffect(() => {
    if (!cardRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 48, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.75,
          ease: 'power4.out',
          delay: index * 0.1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      )
    })
    return () => ctx.revert()
  }, [index])

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col opacity-0"
      style={{
        background: meta.accent
          ? 'linear-gradient(160deg, #1a0e08 0%, #150a04 50%, #0f0704 100%)'
          : '#0f0f0e',
        border: meta.accent
          ? '1px solid rgba(255,87,26,0.35)'
          : '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Top accent bar */}
      {meta.accent && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #ff571a 50%, transparent 100%)' }}
        />
      )}

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: meta.accent
            ? 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,87,26,0.07) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,87,26,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <div
        className="px-6 pt-7 pb-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Tag pill */}
        <div className="mb-4">
          <span
            className="inline-block font-[family-name:var(--font-body)] text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1"
            style={
              meta.accent
                ? { background: '#ff571a', color: '#000' }
                : { background: 'rgba(255,255,255,0.06)', color: '#6b7280' }
            }
          >
            {meta.tag}
          </span>
        </div>

        {/* Title */}
        <h2
          className="font-[family-name:var(--font-outfit)] font-black uppercase leading-none tracking-[-0.03em] mb-2"
          style={{
            fontSize: 'clamp(20px, 2.8vw, 30px)',
            color: meta.accent ? '#fff' : '#e2e3e1',
          }}
        >
          {meta.title}
        </h2>
        <p
          className="font-[family-name:var(--font-body)] text-sm leading-snug"
          style={{ color: '#6b7280' }}
        >
          {meta.subtitle}
        </p>
      </div>

      {/* Price grid — all plans side-by-side */}
      <div
        className="grid gap-px"
        style={{
          gridTemplateColumns: `repeat(${sortedPlans.length}, 1fr)`,
          background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {sortedPlans.map(plan => {
          const isAnnual = plan.billing_period === 'annually'
          return (
            <div
              key={plan.id}
              className="relative flex flex-col items-center justify-center py-5 px-2"
              style={{
                background: isAnnual
                  ? (meta.accent ? 'rgba(255,87,26,0.12)' : 'rgba(255,87,26,0.06)')
                  : '#0f0f0e',
              }}
            >
              {isAnnual && (
                <span
                  className="absolute -top-px left-0 right-0 h-[1px]"
                  style={{ background: '#ff571a' }}
                />
              )}
              <span
                className="font-[family-name:var(--font-outfit)] font-black text-center leading-none mb-1"
                style={{
                  fontSize: 'clamp(16px, 2.2vw, 22px)',
                  color: isAnnual ? '#ff571a' : (meta.accent ? '#c4c0bb' : '#9ca3af'),
                }}
              >
                ₹{plan.price?.toLocaleString('en-IN')}
              </span>
              <span
                className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-wider text-center"
                style={{ color: isAnnual ? 'rgba(255,87,26,0.7)' : '#3a3530' }}
              >
                {PERIOD_LABEL[plan.billing_period] ?? plan.billing_period}
              </span>
              {isAnnual && (
                <span
                  className="mt-1.5 font-[family-name:var(--font-body)] text-[9px] uppercase tracking-widest font-black"
                  style={{ color: '#ff571a' }}
                >
                  BEST VALUE
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Features */}
      <div className="flex-1 px-6 py-5">
        <ul className="space-y-2.5">
          {meta.features.map((feat, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckIcon />
              <span
                className="font-[family-name:var(--font-body)] text-sm leading-snug"
                style={{ color: '#9ca3af' }}
              >
                {feat}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6 pt-2 flex flex-col gap-2.5">
        {plans.some(p => p.price && p.price > 0) && (
          <MembershipCheckout
            plans={sortedPlans.map(p => ({
              id: p.id,
              name: p.sort_label ?? p.billing_period,
              price: p.price ?? 0,
              billingPeriod: p.billing_period,
            }))}
            batchCategory={cat}
            batchTitle={meta.title}
          />
        )}
        <WhatsAppCTA
          whatsappNumber={settings?.whatsapp_number ?? null}
          context="membership"
          variant="secondary"
          label={`ENQUIRE`}
        />
      </div>
    </div>
  )
}

export function MembershipBatchCards({ grouped, settings }: MembershipBatchCardsProps) {
  return (
    <div className="space-y-6 md:space-y-0">
      {/* Section label */}
      <div className="flex items-center gap-4 mb-10 md:mb-14">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span
          className="font-[family-name:var(--font-body)] text-xs font-black uppercase tracking-[0.25em]"
          style={{ color: '#3a3530' }}
        >
          Choose Your Batch
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px"
        style={{ background: 'rgba(255,255,255,0.04)' }}>
        {BATCH_ORDER.map((cat, i) => {
          const catPlans = grouped[cat]
          if (!catPlans || catPlans.length === 0) return null
          return (
            <BatchCard
              key={cat}
              cat={cat}
              plans={catPlans}
              settings={settings}
              index={i}
            />
          )
        })}
      </div>
    </div>
  )
}
