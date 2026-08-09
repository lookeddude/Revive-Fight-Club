import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactForm } from '@/components/forms/ContactForm'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'
import { PhoneCTA } from '@/components/ui/PhoneCTA'
import { DirectionsCTA } from '@/components/ui/DirectionsCTA'
import { getBusinessSettings } from '@/lib/data/content'

export const metadata: Metadata = {
  title: 'Contact | Revive Fight Club',
  description:
    'Get in touch with Revive Fight Club. Contact us by form, WhatsApp, phone, or visit us at Frazer Town, Bengaluru.',
  alternates: {
    canonical: 'https://revivefightclub.com/contact',
  },
}

export const revalidate = 3600 // Settings rarely change

export default async function ContactPage() {
  const settings = await getBusinessSettings()

  // Opening hours from JSONB — expected shape: { "Monday": "06:00–22:00", ... }
  const openingHours = settings?.opening_hours as Record<string, string> | null

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14 md:pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 border-b border-white/10">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-4">
              Get In Touch
            </p>
            <h1 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase leading-tight tracking-[-0.02em] text-[clamp(32px,4vw,64px)] max-w-2xl mb-6">
              CONTACT REVIVE FIGHT CLUB
            </h1>
            <p className="font-[family-name:var(--font-inter)] text-lg text-[#bab8b7] max-w-xl leading-relaxed">
              Have a question? Want to visit? Looking to join? We&apos;re here to help.
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Contact form */}
              <div className="lg:col-span-7">
                <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-8">
                  Send a Message
                </p>
                <ContactForm
                  whatsappNumber={settings?.whatsapp_number ?? null}
                  phone={settings?.phone ?? null}
                />
              </div>

              {/* Info sidebar */}
              <div className="lg:col-span-5 flex flex-col gap-10">
                {/* Quick actions */}
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-6">
                    Quick Contact
                  </p>
                  <div className="flex flex-col gap-3">
                    <WhatsAppCTA
                      whatsappNumber={settings?.whatsapp_number ?? null}
                      context="contact"
                      variant="secondary"
                      label="WHATSAPP US"
                      className="w-full justify-center sm:justify-start"
                    />
                    <PhoneCTA
                      phone={settings?.phone ?? null}
                      variant="secondary"
                      label={settings?.phone ? `CALL  ${settings.phone}` : 'CALL US'}
                      className="w-full justify-center sm:justify-start"
                    />
                    <DirectionsCTA
                      googleMapsUrl={settings?.google_maps_url ?? null}
                      variant="secondary"
                      label="GET DIRECTIONS"
                      className="w-full justify-center sm:justify-start"
                    />
                  </div>
                </div>

                {/* Address — footer-style Google Maps button */}
                <div className="border-t border-white/10 pt-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-px bg-[#ff571a]" />
                    <p className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#ff571a]">
                      Our Location
                    </p>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/HDkr8hrYK1Tuop7G6?g_st=ac"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Revive Fight Club location in Google Maps"
                    className="group inline-flex items-start gap-2.5 hover:opacity-100 transition-all duration-200"
                    style={{ opacity: 0.75 }}
                  >
                    <svg
                      className="w-4 h-4 text-[#ff571a] shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                      fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span className="font-[family-name:var(--font-inter)] text-sm text-[#c8c6c5] leading-snug group-hover:text-[#f0ede8] transition-colors">
                      3rd floor, 157, MM Road,<br />
                      above Indian Overseas Bank,<br />
                      Fraser Town, Bengaluru,<br />
                      Karnataka 560005
                    </span>
                  </a>
                </div>

                {/* Opening Days & Time — always shown */}
                <div className="border-t border-white/10 pt-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-px bg-[#ff571a]" />
                    <p className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#ff571a]">
                      Opening Days &amp; Time
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-[family-name:var(--font-inter)] text-sm text-[#c8c6c5]">
                      Monday – Sunday
                    </p>
                    <p className="font-[family-name:var(--font-inter)] text-sm font-semibold text-[#e2e3e1]">
                      6 AM – 11 PM
                    </p>
                  </div>
                </div>

                {/* Social links */}
                {(settings?.instagram_url || settings?.facebook_url || settings?.youtube_url) && (
                  <div className="border-t border-white/10 pt-8">
                    <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-4">
                      Follow Us
                    </p>
                    <div className="flex gap-4">
                      {settings.instagram_url && (
                        <a
                          href={settings.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-[family-name:var(--font-inter)] text-sm text-[#c8c6c5] hover:text-[#e2e3e1] transition-colors"
                          aria-label="Revive Fight Club on Instagram"
                        >
                          Instagram
                        </a>
                      )}
                      {settings.facebook_url && (
                        <a
                          href={settings.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-[family-name:var(--font-inter)] text-sm text-[#c8c6c5] hover:text-[#e2e3e1] transition-colors"
                          aria-label="Revive Fight Club on Facebook"
                        >
                          Facebook
                        </a>
                      )}
                      {settings.youtube_url && (
                        <a
                          href={settings.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-[family-name:var(--font-inter)] text-sm text-[#c8c6c5] hover:text-[#e2e3e1] transition-colors"
                          aria-label="Revive Fight Club on YouTube"
                        >
                          YouTube
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Book trial prompt */}
                <div className="border-t border-white/10 pt-8">
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#bab8b7] mb-4 leading-relaxed">
                    Ready to start training? Skip the enquiry and book a trial class directly.
                  </p>
                  <a
                    href="/book-trial"
                    className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300 active:scale-95"
                  >
                    BOOK A TRIAL
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
