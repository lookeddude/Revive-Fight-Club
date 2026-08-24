import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Featured Membership Plans — Homepage section.
 * Shows Beginners Batch and Kids Batch with ALL pricing tiers.
 * Placed between Reviews and CTA for optimal conversion flow.
 */

type PriceTier = {
  label: string
  shortLabel: string
  price: string
  perMonth: string
  best?: boolean
}

const FEATURED_PLANS = [
  {
    id: 'beginners',
    icon: '🥊',
    title: 'BEGINNERS BATCH',
    subtitle: 'Your combat sports journey starts here',
    points: [
      'No experience needed — learn from scratch',
      'MMA, Boxing, Kickboxing fundamentals',
      'Expert coaches guide every session',
    ],
    tiers: [
      { label: 'Monthly', shortLabel: '1 Mo', price: '6,500', perMonth: '6,500' },
      { label: 'Quarterly', shortLabel: '3 Mo', price: '13,000', perMonth: '4,333' },
      { label: 'Semiannual', shortLabel: '6 Mo', price: '20,000', perMonth: '3,333' },
      { label: 'Yearly', shortLabel: '12 Mo', price: '40,000', perMonth: '3,333', best: true },
    ] as PriceTier[],
    accent: 'rgba(252,253,253,0.9)',
    accentLight: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.12)',
  },
  {
    id: 'kids',
    icon: '⚡',
    title: 'KIDS BATCH',
    subtitle: 'Build discipline, fitness & confidence early',
    points: [
      'Ages 6–15 welcome',
      'Weekday & weekend batches available',
      'Safe, structured training environment',
    ],
    tiers: [
      { label: 'Monthly', shortLabel: '1 Mo', price: '4,500', perMonth: '4,500' },
      { label: 'Quarterly', shortLabel: '3 Mo', price: '10,000', perMonth: '3,333' },
      { label: 'Semiannual', shortLabel: '6 Mo', price: '15,000', perMonth: '2,500' },
      { label: 'Yearly', shortLabel: '12 Mo', price: '26,000', perMonth: '2,167', best: true },
    ] as PriceTier[],
    accent: '#C8963E',
    accentLight: 'rgba(200,150,62,0.06)',
    border: 'rgba(200,150,62,0.18)',
  },
]


export function HomeMembership() {
  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ background: '#0d0c0b' }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(255,87,26,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-5 md:px-16">
        {/* Section header */}
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#ff571a]" />
              <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.22em] uppercase text-[#ff571a]">
                Start Training
              </p>
              <div className="w-8 h-px bg-[#ff571a]" />
            </div>
            <h2
              className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-[0.95] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(32px, 6vw, 56px)' }}
            >
              CHOOSE YOUR<br />
              <span style={{ color: '#ff571a' }}>BATCH</span>
            </h2>
          </div>
        </Reveal>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {FEATURED_PLANS.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 140}>
              <div
                className="group relative overflow-hidden h-full"
                style={{
                  background: 'linear-gradient(160deg, #131211 0%, #0f0e0d 100%)',
                  border: `1px solid ${plan.border}`,
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${plan.accent}, transparent)` }}
                />

                <div className="relative p-6 md:p-8">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{plan.icon}</span>
                    <div>
                      <h3
                        className="font-[family-name:var(--font-outfit)] font-black uppercase tracking-tight leading-tight"
                        style={{ color: plan.accent, fontSize: 'clamp(18px, 2.5vw, 24px)' }}
                      >
                        {plan.title}
                      </h3>
                      <p className="font-[family-name:var(--font-body)] text-xs text-[#707078] mt-0.5">
                        {plan.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Pricing grid — 2×2 */}
                  <div className="grid grid-cols-2 gap-2.5 mb-6">
                    {plan.tiers.map((tier) => (
                      <div
                        key={tier.label}
                        className="relative p-3.5 md:p-4 overflow-hidden"
                        style={{
                          background: tier.best ? plan.accentLight : 'rgba(255,255,255,0.02)',
                          border: tier.best ? `1px solid ${plan.border}` : '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        {/* Best value badge */}
                        {tier.best && (
                          <div
                            className="absolute top-0 right-0 px-2 py-0.5"
                            style={{ background: plan.accent }}
                          >
                            <span className="font-[family-name:var(--font-body)] text-[9px] font-black tracking-[0.12em] uppercase" style={{ color: '#0d0c0b' }}>
                              Best Value
                            </span>
                          </div>
                        )}

                        <p className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.15em] uppercase text-[#707078] mb-1.5">
                          {tier.label}
                        </p>
                        <div className="flex items-baseline gap-0.5">
                          <span
                            className="font-[family-name:var(--font-outfit)] font-black leading-none"
                            style={{
                              color: tier.best ? plan.accent : '#FCFDFD',
                              fontSize: 'clamp(20px, 3vw, 28px)',
                            }}
                          >
                            ₹{tier.price}
                          </span>
                        </div>
                        <p className="font-[family-name:var(--font-body)] text-[11px] text-[#707078] mt-1">
                          ≈ ₹{tier.perMonth}/mo
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Points */}
                  <ul className="space-y-2 mb-7">
                    {plan.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <svg
                          className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                          style={{ color: plan.accent }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-[family-name:var(--font-body)] text-sm text-[#A0A0A8] leading-snug">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href="/membership"
                    className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-xs font-black tracking-[0.14em] uppercase px-7 py-3.5 transition-all duration-300 active:scale-95"
                    style={{
                      background: '#C8963E',
                      color: '#0d0c0b',
                    }}
                  >
                    Join Now
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom link */}
        <Reveal delay={300}>
          <div className="text-center mt-8">
            <Link
              href="/membership"
              className="font-[family-name:var(--font-body)] text-sm text-[#ff571a] hover:text-white transition-colors font-semibold underline underline-offset-4 decoration-[#ff571a]/30"
            >
              View all batches & pricing →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
 
