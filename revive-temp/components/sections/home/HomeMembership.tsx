import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Featured Membership Plans — Homepage section.
 * Shows Beginners Batch and Kids Batch as two featured cards.
 * Placed between Reviews and CTA for optimal conversion flow.
 *
 * Data is hardcoded display copy (batch names, starting prices, selling points).
 * Starting prices come from the DB: Beginners ₹6,500/mo, Kids ₹3,500/mo.
 * The full dynamic pricing is on /membership.
 */

const FEATURED_PLANS = [
  {
    id: 'beginners',
    icon: '🥊',
    title: 'BEGINNERS BATCH',
    subtitle: 'Your combat sports journey starts here',
    startingPrice: '6,500',
    period: '/month',
    points: [
      'No experience needed',
      'MMA, Boxing, Kickboxing fundamentals',
      'Expert coaches guide every session',
      'Flexible monthly, quarterly & yearly plans',
    ],
    accent: '#ff571a',
    glowFrom: 'rgba(255,87,26,0.06)',
    border: 'rgba(255,87,26,0.2)',
  },
  {
    id: 'kids',
    icon: '⚡',
    title: 'KIDS BATCH',
    subtitle: 'Build discipline, fitness & confidence early',
    startingPrice: '3,500',
    period: '/month',
    points: [
      'Ages 6–15 welcome',
      'Weekday & weekend batches available',
      'Safe, structured environment',
      'Builds focus, strength & self-defence skills',
    ],
    accent: '#f5a623',
    glowFrom: 'rgba(245,166,35,0.06)',
    border: 'rgba(245,166,35,0.2)',
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
              className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.95] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(32px, 6vw, 56px)' }}
            >
              CHOOSE YOUR<br />
              <span style={{ color: '#ff571a' }}>BATCH</span>
            </h2>
          </div>
        </Reveal>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {FEATURED_PLANS.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 140}>
              <div
                className="group relative overflow-hidden transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(160deg, #131211 0%, #0f0e0d 100%)`,
                  border: `1px solid ${plan.border}`,
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${plan.accent}, transparent)` }}
                />

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${plan.glowFrom}, transparent 70%)` }}
                />

                <div className="relative p-7 md:p-9">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-3xl">{plan.icon}</span>
                    <div>
                      <h3
                        className="font-[family-name:var(--font-outfit)] font-black uppercase tracking-tight leading-tight"
                        style={{ color: plan.accent, fontSize: 'clamp(18px, 2.5vw, 24px)' }}
                      >
                        {plan.title}
                      </h3>
                      <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] mt-0.5">
                        {plan.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] uppercase tracking-wider">Starting at</span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] text-4xl md:text-5xl leading-none">
                        ₹{plan.startingPrice}
                      </span>
                      <span className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] font-medium">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Points */}
                  <ul className="space-y-2.5 mb-8">
                    {plan.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <svg
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: plan.accent }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-[family-name:var(--font-body)] text-sm text-[#c0bfbd] leading-snug">
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
                      background: plan.accent,
                      color: '#0d0c0b',
                    }}
                  >
                    View Plans
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
 
