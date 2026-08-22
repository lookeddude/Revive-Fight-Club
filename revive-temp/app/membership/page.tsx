import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getBusinessSettings } from '@/lib/data/content'
import { createClient } from '@/lib/supabase/server'
import { MembershipHero } from '@/components/membership/MembershipHero'
import { MembershipBatchCards } from '@/components/membership/MembershipBatchCards'
import { MembershipTrialCTA } from '@/components/membership/MembershipTrialCTA'
import { BATCH_ORDER } from '@/lib/membership-constants'

export const metadata: Metadata = {
  title: 'Membership & Pricing | Revive Fight Club',
  description: "Transparent membership pricing for all levels — Beginners, Fighters, Kids. Weekday & Weekend batches. Join Revive Fight Club, Bengaluru's elite combat sports gym.",
  alternates: { canonical: 'https://revivefightclub.com/membership' },
  openGraph: { url: 'https://revivefightclub.com/membership' },
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


export default async function MembershipPage() {
  const supabase = await createClient()
  const [{ data: rawPlans }, settings] = await Promise.all([
    supabase.from('membership_plans').select('*').eq('is_active', true).order('sort_order'),
    getBusinessSettings(),
  ])

  const plans: Plan[] = rawPlans ?? []
  const grouped = BATCH_ORDER.reduce<Record<string, Plan[]>>((acc, cat) => {
    acc[cat] = plans.filter(p => p.batch_category === cat)
    return acc
  }, {})
  const hasBatches = plans.some(p => p.batch_category)

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen" style={{ backgroundColor: '#0a0b0a' }}>

        {/* ── Hero ── */}
        <MembershipHero />

        {/* ── Batch Cards ── */}
        <section className="py-20 md:py-32" style={{ backgroundColor: '#0a0b0a' }}>
          <div className="max-w-[1360px] mx-auto px-5 md:px-12">

            {hasBatches ? (
              <MembershipBatchCards
                grouped={grouped}
                settings={settings}
              />
            ) : (
              /* Fallback flat grid */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                  <div key={plan.id} className="bg-[#111210] border border-white/[0.07] p-6">
                    <h3 className="font-[family-name:var(--font-outfit)] font-black text-[#e2e3e1] text-xl uppercase mb-2">{plan.name}</h3>
                    <p className="font-[family-name:var(--font-outfit)] font-black text-[#ff571a] text-3xl">₹{plan.price?.toLocaleString('en-IN')}</p>
                    <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] mt-1 capitalize">{plan.billing_period}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Notes ── */}
        <section className="pb-12" style={{ backgroundColor: '#0a0b0a' }}>
          <div className="max-w-[1360px] mx-auto px-5 md:px-12">
            <div className="border border-white/[0.06] bg-[#111210] p-6 md:p-8 flex flex-col sm:flex-row gap-6 sm:gap-10">
              {[
                { icon: '💡', text: 'Trial class — ₹1,000 per session.' },
                { icon: '🎒', text: 'Carry all essentials required for training.' },
                { icon: '📋', text: 'Terms and conditions apply.' },
              ].map((note, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg shrink-0 mt-0.5">{note.icon}</span>
                  <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trial CTA ── */}
        <MembershipTrialCTA whatsappNumber={settings?.whatsapp_number ?? null} />

      </main>
      <Footer />
    </>
  )
}
