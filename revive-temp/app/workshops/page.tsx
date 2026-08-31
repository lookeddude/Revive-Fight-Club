import type { Metadata } from 'next'
import type React from 'react'
import Link from 'next/link'
import { WorkshopCard } from '@/components/workshops/WorkshopCard'
import { getPublishedWorkshops } from '@/lib/data/workshops'
import { getWorkshopAvailability } from '@/lib/workshops'

export const metadata: Metadata = {
  title: 'Workshops & Events | Revive Fight Club',
  description: 'Join upcoming combat sports workshops, seminars, and special events at Revive Fight Club in Bengaluru.',
  alternates: { canonical: 'https://revivefightclub.com/workshops' },
  openGraph: { url: 'https://revivefightclub.com/workshops' },
}

export const revalidate = 300

export default async function WorkshopsPage() {
  const workshops = await getPublishedWorkshops()

  return (
    <div className="pt-14 md:pt-20 pb-16 md:pb-24">
      <section className="py-16 md:py-20 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-[#DC2626]" />
            <p className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.18em] uppercase text-[#DC2626]">Events &amp; Seminars</p>
          </div>
          <h1 className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-[0.95] tracking-[-0.03em] text-[clamp(36px,5vw,72px)] max-w-2xl mb-4">UPCOMING WORKSHOPS</h1>
          <p className="font-[family-name:var(--font-body)] text-base text-[#A0A0A8] max-w-2xl leading-relaxed mb-3">Learn from the best in specialized, focused workshops. From beginner fundamentals to advanced seminars for competitors.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          {workshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((workshop, idx) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const avail = getWorkshopAvailability({
                  status: workshop.status as any,
                  registrationDeadline: workshop.registration_deadline,
                  capacity: workshop.capacity,
                  confirmedCount: workshop.confirmedCount,
                  waitlistEnabled: workshop.waitlist_enabled,
                  startDatetime: workshop.start_datetime,
                })
                return (
                  <div
                    key={workshop.id}
                    className="ws-card-reveal"
                    style={{ '--ws-card-delay': `${idx * 0.1}s` } as React.CSSProperties}
                  >
                    <WorkshopCard
                      id={workshop.id}
                      slug={workshop.slug}
                      title={workshop.title}
                      shortDescription={workshop.short_description ?? ''}
                      date={new Date(workshop.start_datetime).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      location={workshop.workshop_mode === 'online' ? 'Online' : 'Revive Fight Club'}
                      imagePath={workshop.cover_image_path}
                      status={avail.isFull ? 'full' : avail.canRegister ? 'open' : 'closed'}
                      ctaLabel={avail.ctaLabel}
                      pricingType={workshop.pricing_type}
                      price={workshop.price}
                      availableSeats={avail.remainingSeats}
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-24 border border-white/10 rounded-lg">
              <p className="font-[family-name:var(--font-body)] text-[#A0A0A8] mb-6">No upcoming workshops at the moment.</p>
              <Link href="/programs" className="inline-block bg-[#DC2626] text-white font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white hover:text-black transition-all duration-300">EXPLORE PROGRAMS</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
