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
      <main className="min-h-screen pt-20">
        <section className="py-16 md:py-24 border-b border-white/10">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-4">
              Membership
            </p>
            <h1 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase leading-tight tracking-[-0.02em] text-[clamp(32px,5vw,64px)] max-w-2xl mb-4">
              MEMBERSHIP PLANS
            </h1>
            <p className="font-[family-name:var(--font-inter)] text-lg text-[#bab8b7] max-w-xl leading-relaxed">
              Flexible plans to match your training goals. Try a free trial class before committing.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            {plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`border p-8 flex flex-col gap-6 ${
                      plan.is_featured ? 'border-[#ff571a] bg-[#1a1c1b]' : 'border-white/10'
                    }`}
                  >
                    {plan.is_featured && (
                      <span className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase px-3 py-1 self-start">
                        MOST POPULAR
                      </span>
                    )}
                    <div>
                      <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-2xl uppercase tracking-tight mb-2">
                        {plan.name}
                      </h2>
                      {plan.description && (
                        <p className="font-[family-name:var(--font-inter)] text-sm text-[#bab8b7]">
                          {plan.description}
                        </p>
                      )}
                    </div>
                    <div>
                      {plan.price !== null ? (
                        <p className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-4xl">
                          ₹{plan.price.toLocaleString('en-IN')}
                          <span className="text-base font-normal text-[#bab8b7] ml-1">
                            /{plan.billing_period}
                          </span>
                        </p>
                      ) : (
                        <p className="font-[family-name:var(--font-inter)] text-sm text-[#bab8b7]">
                          Contact us for pricing
                        </p>
                      )}
                    </div>
                    {plan.features && plan.features.length > 0 && (
                      <ul className="flex flex-col gap-2 flex-1">
                        {plan.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 font-[family-name:var(--font-inter)] text-sm text-[#bab8b7]"
                          >
                            <svg
                              className="w-4 h-4 text-[#ff571a] fill-current mt-0.5 flex-shrink-0"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    <WhatsAppCTA
                      whatsappNumber={settings?.whatsapp_number ?? null}
                      context="membership"
                      variant="secondary"
                      label={plan.price !== null ? 'ENQUIRE NOW' : 'GET PRICING'}
                      className="w-full justify-center"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="font-[family-name:var(--font-inter)] text-[#bab8b7] mb-8">
                  Membership plans coming soon. Contact us to enquire.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <WhatsAppCTA
                    whatsappNumber={settings?.whatsapp_number ?? null}
                    context="membership"
                    variant="primary"
                    label="ENQUIRE ON WHATSAPP"
                  />
                  <Link
                    href="/contact"
                    className="inline-block border border-white/10 text-[#e2e3e1] font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-[#383a38] transition-all duration-300"
                  >
                    CONTACT US
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-16 border-t border-white/10 bg-[#0d0f0e]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 text-center">
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase text-3xl mb-4">
              NOT READY TO COMMIT?
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-[#bab8b7] mb-8">
              Start with a free trial class. No pressure, no commitment.
            </p>
            <Link
              href="/book-trial"
              className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300"
            >
              BOOK A FREE TRIAL
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
