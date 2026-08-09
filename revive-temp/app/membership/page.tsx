import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getActiveMembershipPlans } from '@/lib/data/listings'
import { getBusinessSettings } from '@/lib/data/content'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'

export const metadata: Metadata = {
  title: 'Membership | Revive Fight Club',
  description: 'Explore membership plans at Revive Fight Club, Bengaluru.',
}

export const revalidate = 3600

export default async function MembershipPage() {
  const [plans, settings] = await Promise.all([
    getActiveMembershipPlans(),
    getBusinessSettings(),
  ])

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14 md:pt-20">
        {/* Hero */}
        <section className="py-16 md:py-20 border-b border-white/10" style={{ backgroundColor: '#0d0c0b' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#ff571a]" />
              <p className="section-label">Membership</p>
            </div>
            <h1 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.95] tracking-[-0.03em] text-[clamp(36px,5vw,72px)] max-w-2xl mb-4">
              MEMBERSHIP PLANS
            </h1>
            <p className="font-[family-name:var(--font-inter)] text-base text-[#8a8079] max-w-xl leading-relaxed">
              Flexible plans to match your training goals. Try a free trial class before committing.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24" style={{ backgroundColor: '#111210' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-6 h-px bg-[#ff571a]" />
              <h2 className="section-label">Membership Plans</h2>
            </div>
            {plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="relative flex flex-col gap-6 rounded-lg"
                    style={plan.is_featured ? {
                      background: '#161412',
                      border: '2px solid rgba(255,87,26,0.4)',
                      boxShadow: '0 8px 32px rgba(255,87,26,0.1)',
                      padding: '2rem',
                      transform: 'scale(1.02)',
                    } : {
                      background: '#161412',
                      border: '1px solid rgba(255,240,230,0.07)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                      padding: '2rem',
                    }}
                  >
                    {plan.is_featured && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-[11px] font-black tracking-[0.15em] uppercase px-4 py-1 whitespace-nowrap rounded" style={{ boxShadow: '0 0 16px rgba(255,87,26,0.5)' }}>
                          POPULAR
                        </span>
                      </div>
                    )}

                    <div>
                      <h2 className={`font-[family-name:var(--font-outfit)] font-black uppercase tracking-tight text-2xl mb-2 ${plan.is_featured ? 'text-white' : 'text-[#e2e3e1]'}`}>
                        {plan.name}
                      </h2>
                      {plan.description && (
                        <p className="font-[family-name:var(--font-inter)] text-sm text-[#8a8079]">{plan.description}</p>
                      )}
                    </div>

                    <div className="border-t border-white/[0.07] pt-5">
                      {plan.price !== null ? (
                        <div className="flex items-end gap-1">
                          <span className={`font-[family-name:var(--font-outfit)] font-black leading-none ${plan.is_featured ? 'text-[#ff571a] text-6xl' : 'text-[#e2e3e1] text-5xl'}`}>
                            ₹{plan.price.toLocaleString('en-IN')}
                          </span>
                          <span className="font-[family-name:var(--font-inter)] text-sm text-[#6b6059] mb-2">/{plan.billing_period}</span>
                        </div>
                      ) : (
                        <p className="font-[family-name:var(--font-inter)] text-sm text-[#8a8079]">Contact us for pricing</p>
                      )}
                    </div>

                    {Array.isArray(plan.features) && plan.features.length > 0 && (
                      <ul className="flex flex-col gap-3 flex-1">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 font-[family-name:var(--font-inter)] text-sm text-[#a09890]">
                            <svg className="w-5 h-5 text-[#ff571a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    <WhatsAppCTA
                      whatsappNumber={settings?.whatsapp_number ?? null}
                      context="membership"
                      variant={plan.is_featured ? 'primary' : 'secondary'}
                      label={plan.price !== null ? 'ENQUIRE NOW' : 'GET PRICING'}
                      className="w-full justify-center"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="font-[family-name:var(--font-inter)] text-[#8a8079] mb-8">
                  Membership plans coming soon. Contact us to enquire.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <WhatsAppCTA whatsappNumber={settings?.whatsapp_number ?? null} context="membership" variant="primary" label="ENQUIRE ON WHATSAPP" />
                  <Link href="/contact" className="inline-block border border-white/10 text-[#e2e3e1] font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-[#383a38] transition-all duration-300">CONTACT US</Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-16 border-t border-white/10" style={{ background: '#0d0c0b' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 text-center">
            <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase text-[clamp(24px,3vw,36px)] tracking-[-0.02em] mb-4">
              NOT READY TO COMMIT?
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-[#8a8079] mb-8">Start with a free trial class. No pressure, no commitment.</p>
            <Link href="/book-trial" className="btn-primary inline-flex items-center gap-2 px-8 py-4 transition-all duration-300">
              BOOK A FREE TRIAL
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
