import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getBusinessSettings } from '@/lib/data/content'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'
import { DirectionsCTA } from '@/components/ui/DirectionsCTA'
import { PhoneCTA } from '@/components/ui/PhoneCTA'

export const metadata: Metadata = {
  title: 'About | Revive Fight Club',
  description: 'Learn about Revive Fight Club — elite MMA and fitness training in Frazer Town, Bengaluru.',
}

export const revalidate = 3600

export default async function AboutPage() {
  const settings = await getBusinessSettings()

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14 md:pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 border-b border-white/10">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-4">
              Our Story
            </p>
            <h1 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase leading-tight tracking-[-0.02em] text-[clamp(32px,5vw,64px)] max-w-2xl mb-6">
              ABOUT REVIVE FIGHT CLUB
            </h1>
            <p className="font-[family-name:var(--font-inter)] text-lg text-[#bab8b7] max-w-2xl leading-relaxed border-l-2 border-[#ff571a] pl-6">
              {settings?.tagline ??
                'Elite combat sports and fitness training in the heart of Frazer Town, Bengaluru. Built for athletes who demand more.'}
            </p>
          </div>
        </section>

        {/* Mission + Location */}
        <section className="py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase text-3xl tracking-tight mb-6">
                  OUR MISSION
                </h2>
                <p className="font-[family-name:var(--font-inter)] text-base text-[#bab8b7] leading-relaxed mb-6">
                  Revive Fight Club exists to provide world-class combat sports and fitness training to
                  athletes of all levels in Bengaluru.
                </p>
                <p className="font-[family-name:var(--font-inter)] text-base text-[#bab8b7] leading-relaxed mb-8">
                  We believe in structured discipline, expert coaching, and a community that pushes each
                  other to become better athletes — and better people.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/programs"
                    className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300"
                  >
                    VIEW PROGRAMS
                  </Link>
                  <Link
                    href="/trainers"
                    className="inline-block border border-white/10 text-[#e2e3e1] font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-[#383a38] transition-all duration-300"
                  >
                    MEET COACHES
                  </Link>
                </div>
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase text-3xl tracking-tight mb-6">
                  FIND US
                </h2>
                {(settings?.address || settings?.city) && (
                  <address className="not-italic font-[family-name:var(--font-inter)] text-base text-[#bab8b7] leading-relaxed mb-2">
                    {settings.address && <span className="block">{settings.address}</span>}
                    <span className="block">
                      {settings.city}
                      {settings.state ? `, ${settings.state}` : ''}
                      {settings.postal_code ? ` – ${settings.postal_code}` : ''}
                    </span>
                  </address>
                )}
                {!settings?.address && !settings?.city && (
                  <p className="font-[family-name:var(--font-inter)] text-base text-[#bab8b7] leading-relaxed mb-2">
                    Frazer Town, Bengaluru
                  </p>
                )}

                {/* Opening hours */}
                {settings?.opening_hours && Object.keys(settings.opening_hours as Record<string, string>).length > 0 && (
                  <div className="mt-6 mb-6">
                    <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-3">
                      Opening Hours
                    </p>
                    <dl className="flex flex-col gap-1">
                      {Object.entries(settings.opening_hours as Record<string, string>).map(([day, hours]) => (
                        <div key={day} className="flex justify-between max-w-xs">
                          <dt className="font-[family-name:var(--font-inter)] text-sm text-[#c8c6c5]">{day}</dt>
                          <dd className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1] font-medium">{hours}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                <div className="flex flex-col gap-3 mt-6">
                  <DirectionsCTA googleMapsUrl={settings?.google_maps_url ?? null} variant="secondary" />
                  <PhoneCTA phone={settings?.phone ?? null} variant="secondary" />
                  <WhatsAppCTA
                    whatsappNumber={settings?.whatsapp_number ?? null}
                    context="general"
                    variant="secondary"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-white/10 bg-[#0d0f0e]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 text-center">
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase text-3xl mb-4">
              START YOUR JOURNEY
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-[#bab8b7] mb-8">
              Experience Revive Fight Club for yourself. Book your trial class today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/book-trial"
                className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300"
              >
                BOOK A TRIAL
              </Link>
              <Link
                href="/contact"
                className="inline-block border border-white/10 text-[#e2e3e1] font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-[#383a38] transition-all duration-300"
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
