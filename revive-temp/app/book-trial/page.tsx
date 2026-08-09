import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BookTrialForm } from '@/components/forms/BookTrialForm'
import { getActivePrograms, getBusinessSettings } from '@/lib/data/content'

export const metadata: Metadata = {
  title: 'Book a Trial Class | Revive Fight Club',
  description:
    'Book your free trial class at Revive Fight Club. Experience world-class MMA, Muay Thai, and BJJ training in Frazer Town, Bengaluru.',
  robots: { index: false, follow: false }, // Form pages don't need indexing
}

// Revalidate every 5 min — programs may change
export const revalidate = 300

interface BookTrialPageProps {
  searchParams: Promise<{ program?: string }>
}

export default async function BookTrialPage({ searchParams }: BookTrialPageProps) {
  const params = await searchParams

  // Parallel fetch: active programs + business settings (for WhatsApp/phone)
  const [programs, settings] = await Promise.all([
    getActivePrograms(),
    getBusinessSettings(),
  ])

  const safePrograms = programs ?? []

  // Verify preselected program ID is actually valid (active program)
  const preselectedId =
    params.program && safePrograms.some((p) => p.id === params.program)
      ? params.program
      : null

  const preselectedProgram = preselectedId
    ? safePrograms.find((p) => p.id === preselectedId)
    : null

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14 md:pt-20">
        <section className="py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left: Form */}
              <div className="lg:col-span-7">
                {/* Breadcrumb */}
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase text-[#c8c6c5] hover:text-[#e2e3e1] transition-colors mb-10"
                  aria-label="Return to homepage"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="square" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  RETURN TO SITE
                </Link>

                <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-4">
                  First Step
                </p>
                <h1 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase leading-tight tracking-[-0.02em] text-[clamp(28px,4vw,48px)] mb-4">
                  BOOK A TRIAL CLASS
                </h1>

                {preselectedProgram ? (
                  <p className="font-[family-name:var(--font-inter)] text-base text-[#bab8b7] mb-10 leading-relaxed">
                    You&apos;re enquiring about{' '}
                    <span className="text-[#ff571a] font-semibold">{preselectedProgram.name}</span>.
                    Fill in your details and our team will contact you within 24 hours.
                  </p>
                ) : (
                  <p className="font-[family-name:var(--font-inter)] text-base text-[#bab8b7] mb-10 leading-relaxed">
                    Fill in your details and our team will get back to you within 24 hours to 
                    confirm your first session.
                  </p>
                )}

                <BookTrialForm
                  programs={safePrograms.map((p) => ({ id: p.id, name: p.name, slug: p.slug }))}
                  preselectedProgramId={preselectedId}
                  whatsappNumber={settings?.whatsapp_number ?? null}
                  phone={settings?.phone ?? null}
                />
              </div>

              {/* Right: Info panel */}
              <div className="lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-12 flex flex-col gap-8">
                {/* What to expect */}
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-4">
                    What to Expect
                  </p>
                  <ul className="flex flex-col gap-4">
                    {[
                      { step: '01', text: 'Submit this form with your details' },
                      { step: '02', text: 'Our team contacts you within 24 hours' },
                      { step: '03', text: 'Confirm your trial session time' },
                      { step: '04', text: 'Show up and train with our coaches' },
                    ].map(({ step, text }) => (
                      <li key={step} className="flex items-start gap-4">
                        <span className="font-[family-name:var(--font-outfit)] text-lg font-bold text-[#ff571a] flex-shrink-0 leading-none mt-0.5">
                          {step}
                        </span>
                        <p className="font-[family-name:var(--font-inter)] text-sm text-[#bab8b7] leading-relaxed">
                          {text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Contact */}
                <div className="border-t border-white/10 pt-8">
                  <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-4">
                    Prefer to talk directly?
                  </p>
                  <div className="flex flex-col gap-3">
                    {settings?.whatsapp_number && (
                      <a
                        href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent("Hi Revive Fight Club, I'd like to enquire about a trial session.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 text-[#25D366] hover:text-white transition-colors font-[family-name:var(--font-inter)] text-sm font-bold"
                        aria-label="Chat on WhatsApp"
                      >
                        <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        WhatsApp Us
                      </a>
                    )}
                    {settings?.phone && (
                      <a
                        href={`tel:${settings.phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-3 text-[#e2e3e1] hover:text-[#ff571a] transition-colors font-[family-name:var(--font-inter)] text-sm font-bold"
                        aria-label={`Call us at ${settings.phone}`}
                      >
                        <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                        {settings.phone}
                      </a>
                    )}
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

                {/* Opening Days & Time */}
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
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
