import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getBusinessSettings } from '@/lib/data/content'
import { createClient } from '@/lib/supabase/server'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'

export const metadata: Metadata = {
  title: 'Membership & Pricing | Revive Fight Club',
  description: 'Transparent pricing for all batches — Beginners, Fighters, Kids (Weekday & Weekend). Join Revive Fight Club, Bengaluru\'s elite combat gym.',
}

export const revalidate = 3600

type Plan = {
  id: string
  name: string
  price: number | null
  billing_period: string
  sort_label: string | null
  batch_category: string | null
  description: string | null
  features: string[] | null
  is_active: boolean
  is_featured: boolean
  sort_order: number
}

const BATCH_META: Record<string, { title: string; subtitle: string; icon: string; accent: boolean }> = {
  beginners:    { title: 'BEGINNERS Batch',              subtitle: 'Perfect for those starting their combat sports journey.',           icon: '🥊', accent: false },
  fighters:     { title: 'FIGHTERS Batch',               subtitle: 'Intense training for serious competitors and advanced athletes.',     icon: '🔥', accent: true  },
  kids_weekday: { title: 'KIDS Batch',                   subtitle: 'Monday to Friday — build discipline, fitness and confidence early.',  icon: '⚡', accent: false },
  kids_weekend: { title: 'KIDS Batch (Weekend)',         subtitle: 'Saturday & Sunday — active weekends for young warriors.',             icon: '🏅', accent: false },
}

const BATCH_ORDER = ['beginners', 'fighters', 'kids_weekday', 'kids_weekend']

export default async function MembershipPage() {
  const supabase = await createClient()
  const [{ data: rawPlans }, settings] = await Promise.all([
    supabase.from('membership_plans').select('*').eq('is_active', true).order('sort_order'),
    getBusinessSettings(),
  ])

  const plans: Plan[] = rawPlans ?? []

  // Group plans by batch_category
  const grouped = BATCH_ORDER.reduce<Record<string, Plan[]>>((acc, cat) => {
    acc[cat] = plans.filter(p => p.batch_category === cat)
    return acc
  }, {})

  // Fallback: if no batch_category data, show flat grid
  const hasBatches = plans.some(p => p.batch_category)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-14 md:pt-20" style={{ backgroundColor: '#0a0b0a' }}>

        {/* ── Hero ──────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden py-20 md:py-28"
          style={{
            background: 'linear-gradient(180deg, #0d0c0b 0%, #111210 100%)',
            borderBottom: '1px solid rgba(255,87,26,0.15)',
          }}
        >
          {/* Decorative background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,87,26,0.08) 0%, transparent 70%)',
            }}
          />
          <div className="relative max-w-[1280px] mx-auto px-5 md:px-16 text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#ff571a]" />
              <p className="font-[family-name:var(--font-inter)] text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff571a]">Price List</p>
              <div className="w-8 h-px bg-[#ff571a]" />
            </div>
            <h1
              className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.9] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}
            >
              MEMBERSHIP
            </h1>
            <h1
              className="font-[family-name:var(--font-outfit)] font-black uppercase leading-[0.9] tracking-[-0.03em] mb-6"
              style={{ fontSize: 'clamp(48px, 8vw, 96px)', color: '#ff571a' }}
            >
              PLANS
            </h1>
            <p className="font-[family-name:var(--font-inter)] text-base text-[#6b6059] max-w-xl mx-auto leading-relaxed">
              Transparent pricing for every batch. No hidden fees — just dedicated training.
            </p>
          </div>
        </section>

        {/* ── Pricing Batches ───────────────────────────────── */}
        <section className="py-16 md:py-24" style={{ backgroundColor: '#0d0c0b' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 space-y-10">

            {hasBatches ? (
              BATCH_ORDER.map((cat, catIdx) => {
                const meta = BATCH_META[cat]
                const catPlans = grouped[cat]
                if (!catPlans || catPlans.length === 0) return null

                return (
                  <div
                    key={cat}
                    className="relative overflow-hidden"
                    style={{
                      background: meta.accent ? 'linear-gradient(135deg, #161210 0%, #1a1008 100%)' : '#111210',
                      border: meta.accent ? '1px solid rgba(255,87,26,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: meta.accent ? '0 0 40px rgba(255,87,26,0.08)' : 'none',
                    }}
                  >
                    {/* Featured glow strip */}
                    {meta.accent && (
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{ background: 'linear-gradient(90deg, transparent, #ff571a, transparent)' }}
                      />
                    )}

                    {/* Batch header */}
                    <div
                      className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 md:px-8 py-5 md:py-6"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{meta.icon}</span>
                        <div>
                          <h2
                            className="font-[family-name:var(--font-outfit)] font-black uppercase tracking-tight"
                            style={{
                              fontSize: 'clamp(18px, 2.5vw, 26px)',
                              color: meta.accent ? '#fff' : '#e2e3e1',
                            }}
                          >
                            {meta.title}
                          </h2>
                          <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b6059] mt-0.5">{meta.subtitle}</p>
                        </div>
                      </div>
                      {meta.accent && (
                        <span
                          className="inline-flex items-center font-[family-name:var(--font-inter)] text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1"
                          style={{ background: 'rgba(255,87,26,0.15)', color: '#ff571a', border: '1px solid rgba(255,87,26,0.3)' }}
                        >
                          ★ RECOMMENDED
                        </span>
                      )}
                    </div>

                    {/* Pricing rows */}
                    <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      {catPlans.map((plan, idx) => {
                        const isHighlight = plan.billing_period === 'annually'
                        return (
                          <div
                            key={plan.id}
                            className="flex items-center justify-between px-6 md:px-8 py-4 transition-colors duration-150"
                            style={{
                              background: isHighlight
                                ? 'rgba(255,87,26,0.05)'
                                : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                            }}
                          >
                            {/* Duration */}
                            <div className="flex items-center gap-3">
                              <div
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: isHighlight ? '#ff571a' : 'rgba(255,255,255,0.2)' }}
                              />
                              <span
                                className="font-[family-name:var(--font-inter)] font-semibold"
                                style={{
                                  fontSize: 'clamp(13px, 1.5vw, 15px)',
                                  color: isHighlight ? '#f0ede8' : '#9ca3af',
                                }}
                              >
                                {plan.sort_label ?? plan.billing_period}
                              </span>
                              {isHighlight && (
                                <span
                                  className="hidden sm:inline font-[family-name:var(--font-inter)] text-[9px] font-black uppercase tracking-wider px-2 py-0.5"
                                  style={{ background: 'rgba(255,87,26,0.15)', color: '#ff571a' }}
                                >
                                  Best Value
                                </span>
                              )}
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-1.5">
                              <span
                                className="font-[family-name:var(--font-outfit)] font-black"
                                style={{
                                  fontSize: 'clamp(18px, 2.5vw, 26px)',
                                  color: isHighlight ? '#ff571a' : (meta.accent ? '#e2e3e1' : '#c4c0bb'),
                                }}
                              >
                                ₹{plan.price?.toLocaleString('en-IN')}
                              </span>
                              <span className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563]">/-</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Batch CTA */}
                    <div className="px-6 md:px-8 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <WhatsAppCTA
                        whatsappNumber={settings?.whatsapp_number ?? null}
                        context="membership"
                        variant={meta.accent ? 'primary' : 'secondary'}
                        label={`ENQUIRE — ${meta.title}`}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              /* Fallback flat grid if no batch data */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                  <div key={plan.id} className="bg-[#111210] border border-white/[0.07] p-6">
                    <h3 className="font-[family-name:var(--font-outfit)] font-black text-[#e2e3e1] text-xl uppercase mb-2">{plan.name}</h3>
                    <p className="font-[family-name:var(--font-outfit)] font-black text-[#ff571a] text-3xl">₹{plan.price?.toLocaleString('en-IN')}</p>
                    <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280] mt-1 capitalize">{plan.billing_period}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* ── Note Section ──────────────────────────────────── */}
        <section className="pb-16 md:pb-20" style={{ backgroundColor: '#0d0c0b' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div
              className="p-6 md:p-8"
              style={{
                background: '#111210',
                border: '1px solid rgba(255,87,26,0.15)',
                borderLeft: '3px solid #ff571a',
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <svg className="w-5 h-5 text-[#ff571a] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <h3 className="font-[family-name:var(--font-outfit)] font-black uppercase tracking-tight text-[#f0ede8] text-lg">Note</h3>
              </div>
              <ul className="space-y-2">
                {[
                  'Trial class — ₹1,000 per session.',
                  'Please carry all the essentials required for training.',
                  'Terms and conditions apply.',
                ].map((note, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff571a] shrink-0 mt-[6px]" />
                    <span className="font-[family-name:var(--font-inter)] text-sm text-[#9ca3af] leading-relaxed">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Trial CTA ─────────────────────────────────────── */}
        <section
          className="py-16 md:py-24"
          style={{
            background: 'linear-gradient(180deg, #111210 0%, #0d0c0b 100%)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 text-center">
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#ff571a]" />
              <p className="font-[family-name:var(--font-inter)] text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff571a]">Try Before You Commit</p>
              <div className="w-8 h-px bg-[#ff571a]" />
            </div>
            <h2
              className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase tracking-[-0.02em] mb-3"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
            >
              NOT READY TO COMMIT?
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-[#6b6059] mb-8">Start with a trial class. ₹1,000 per session — no pressure, no commitment.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/book-trial"
                className="inline-flex items-center gap-2 bg-[#ff571a] text-black font-[family-name:var(--font-inter)] font-black text-sm uppercase tracking-[0.1em] px-8 py-4 hover:bg-white transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                BOOK TRIAL
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/10 text-[#e2e3e1] font-[family-name:var(--font-inter)] font-bold text-sm uppercase tracking-[0.1em] px-8 py-4 hover:border-white/30 hover:bg-white/5 transition-all duration-200"
              >
                CONTACT US
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
