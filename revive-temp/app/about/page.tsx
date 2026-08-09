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
        <section className="py-16 md:py-24 border-b border-white/10" style={{ backgroundColor: '#0d0c0b' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#ff571a]" />
              <p className="section-label">
                Our Story
              </p>
            </div>
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
        <section className="py-16 md:py-24" style={{ backgroundColor: '#111210' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div style={{ backgroundColor: '#161412', border: '1px solid rgba(255,240,230,0.07)' }} className="p-8">
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
                    className="btn-primary inline-block px-8 py-4 transition-all duration-300"
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

              <div style={{ backgroundColor: '#161412', border: '1px solid rgba(255,240,230,0.07)' }} className="p-8">
                <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase text-3xl tracking-tight mb-6">
                  FIND US
                </h2>
                {/* Location — footer style */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-px bg-[#ff571a]" aria-hidden="true" />
                  <p className="font-[family-name:var(--font-inter)] text-[10px] font-black tracking-[0.2em] uppercase text-[#ff571a]">Location</p>
                </div>
                <a
                  href={settings?.google_maps_url ?? 'https://maps.app.goo.gl/HDkr8hrYK1Tuop7G6?g_st=ac'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Revive Fight Club location in Google Maps"
                  className="group inline-flex items-start gap-2.5 mb-6"
                >
                  <svg className="w-4 h-4 text-[#ff571a] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <address className="not-italic font-[family-name:var(--font-inter)] text-[14px] text-[#8a8079] leading-snug group-hover:text-[#c8c6c5] transition-colors">
                    {settings?.address
                      ? <>{settings.address}<br />{settings.city}{settings.state ? `, ${settings.state}` : ''}{settings.postal_code ? ` – ${settings.postal_code}` : ''}</>
                      : <>3rd floor, 157, MM Road,<br />Fraser Town, Bengaluru,<br />Karnataka 560005</>
                    }
                  </address>
                </a>

                {/* Opening hours */}
                {settings?.opening_hours && Object.keys(settings.opening_hours as Record<string, string>).length > 0 && (
                  <div className="mt-6 mb-6">
                    <p className="section-label mb-3">
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
                  {settings?.instagram_url && (
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Revive Fight Club on Instagram"
                      className="group inline-flex items-center gap-3 font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase text-[#e2e3e1] transition-all duration-300 px-5 py-3 hover:border-white/20"
                      style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
                    >
                      <svg className="w-4 h-4 text-[#E1306C] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Follow on Instagram
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-white/10" style={{ backgroundColor: '#0d0c0b' }}>
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
                className="btn-primary inline-block px-8 py-4 transition-all duration-300"
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
