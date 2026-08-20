import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getActiveSchedule } from '@/lib/data/listings'
import { getBusinessSettings } from '@/lib/data/content'
import { Button } from '@/components/ui/Button'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'
import { GsapHeroReveal } from '@/components/gsap/GsapHeroReveal'
import { GsapStagger } from '@/components/gsap/GsapStagger'

export const metadata: Metadata = {
  title: 'Class Schedule | Revive Fight Club',
  description: 'View the weekly MMA, Boxing, Kickboxing, Jiu-Jitsu and fitness class schedule at Revive Fight Club in Fraser Town, Bengaluru. Morning and evening batches available.',
  alternates: {
    canonical: 'https://revivefightclub.com/schedule',
  },
  openGraph: {
    url: 'https://revivefightclub.com/schedule',
  },
}

export const revalidate = 300

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatTime(time: string | null | undefined): string {
  if (!time) return '—'
  const [h, m] = time.split(':')
  if (!h || !m) return time
  const hour = parseInt(h)
  const period = hour >= 12 ? 'PM' : 'AM'
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${display}:${m} ${period}`
}

export default async function SchedulePage() {
  const [scheduleItems, settings] = await Promise.all([
    getActiveSchedule(),
    getBusinessSettings(),
  ])

  // Group by day_of_week
  const byDay: Record<number, typeof scheduleItems> = {}
  ;(scheduleItems ?? []).forEach((item) => {
    if (!byDay[item.day_of_week]) byDay[item.day_of_week] = []
    byDay[item.day_of_week].push(item)
  })

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen pt-14 md:pt-20">
        <GsapHeroReveal>
        <section className="py-16 md:py-24 border-b border-white/10">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <p className="gsap-label font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-4">
              Weekly Class Schedule
            </p>
            <h1 className="gsap-heading font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase leading-tight tracking-[-0.02em] text-[clamp(32px,5vw,64px)] mb-4">
              TRAINING SCHEDULE
            </h1>
            <p className="gsap-text font-[family-name:var(--font-body)] text-base text-[#bab8b7] max-w-xl">
              These are our regular training sessions. Book a trial class to join one — your spot is confirmed by our team.
            </p>
          </div>
        </section>
        </GsapHeroReveal>

        <section className="py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            {scheduleItems.length > 0 ? (
              <div className="flex flex-col gap-12">
                {Object.entries(byDay)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([day, items]) => (
                    <div key={day}>
                      <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-2xl uppercase tracking-tight mb-6 border-b border-white/10 pb-4">
                        {DAYS[Number(day)] ?? `Day ${day}`}
                      </h2>
                      <div className="flex flex-col gap-4">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10 p-5 hover:border-white/20 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="font-[family-name:var(--font-body)] text-sm font-bold text-[#ff571a] min-w-[140px]">
                                {formatTime(item.start_time)} – {formatTime(item.end_time)}
                              </div>
                              <div>
                                <p className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-lg uppercase">
                                  {item.programs?.name ?? 'Class'}
                                </p>
                                {item.trainers?.name && (
                                  <p className="font-[family-name:var(--font-body)] text-sm text-[#bab8b7]">
                                    with {item.trainers.name}
                                  </p>
                                )}
                                {item.location && (
                                  <p className="font-[family-name:var(--font-body)] text-xs text-[#c8c6c5]">
                                    {item.location}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              {item.level && (
                                <span className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.1em] uppercase text-[#c8c6c5] border border-white/10 px-3 py-1">
                                  {item.level.replaceAll('_', ' ')}
                                </span>
                              )}
                              <Link
                                href={`/book-trial${item.program_id ? `?program=${item.program_id}` : ''}`}
                                className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.1em] uppercase text-[#ff571a] hover:text-white transition-colors whitespace-nowrap"
                              >
                                BOOK →
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="font-[family-name:var(--font-body)] text-[#bab8b7] mb-8">
                  Schedule details coming soon. Contact us for current session times.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    href="/book-trial"
                  >
                    BOOK A TRIAL
                  </Button>
                  <WhatsAppCTA
                    whatsappNumber={settings?.whatsapp_number ?? null}
                    context="general"
                    variant="secondary"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-16 border-t border-white/10 bg-[#0d0f0e]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 text-center">
            <p className="font-[family-name:var(--font-body)] text-sm text-[#bab8b7] mb-6">
              Schedule subject to change. Booking a trial confirms your spot with our team.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                href="/book-trial"
              >
                BOOK A TRIAL CLASS
              </Button>
              <WhatsAppCTA
                whatsappNumber={settings?.whatsapp_number ?? null}
                context="general"
                variant="secondary"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
