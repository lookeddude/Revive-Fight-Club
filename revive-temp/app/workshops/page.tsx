import type { Metadata } from 'next'
import Link from 'next/link'
import * as motion from 'motion/react-client'
import { WorkshopCard } from '@/components/workshops/WorkshopCard'

export const metadata: Metadata = {
  title: 'Workshops & Events | Revive Fight Club',
  description: 'Join upcoming combat sports workshops, seminars, and special events at Revive Fight Club in Bengaluru.',
  alternates: {
    canonical: 'https://revivefightclub.com/workshops',
  },
  openGraph: {
    url: 'https://revivefightclub.com/workshops',
  },
}

export const revalidate = 300

// Mock data fetcher to mimic getPublishedWorkshops
async function getPublishedWorkshops() {
  return [
    {
      id: '1',
      slug: 'intro-to-mma',
      title: 'Intro to MMA Bootcamp',
      shortDescription: 'A 2-hour intensive workshop covering the fundamentals of MMA for complete beginners.',
      date: 'Sat, Oct 14 • 10:00 AM',
      location: 'Revive Fight Club, Fraser Town',
      imagePath: null,
      status: 'open',
      ctaLabel: 'Register Now',
      pricingType: 'free',
      price: null,
      availableSeats: 20
    },
    {
      id: '2',
      slug: 'advanced-striking',
      title: 'Advanced Striking Seminar',
      shortDescription: 'Master complex striking combinations and footwork with our head coach.',
      date: 'Sun, Oct 22 • 2:00 PM',
      location: 'Revive Fight Club, Fraser Town',
      imagePath: null,
      status: 'full',
      ctaLabel: 'Waitlist',
      pricingType: 'paid',
      price: 1500,
      availableSeats: 0
    }
  ]
}

export default async function WorkshopsPage() {
  const workshops = await getPublishedWorkshops()

  return (
    <div className="pt-14 md:pt-20 pb-16 md:pb-24">
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-[#DC2626]" />
            <p className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.18em] uppercase text-[#DC2626]">
              Events & Seminars
            </p>
          </div>
          <h1 className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-[0.95] tracking-[-0.03em] text-[clamp(36px,5vw,72px)] max-w-2xl mb-4">
            UPCOMING WORKSHOPS
          </h1>
          <p className="font-[family-name:var(--font-body)] text-base text-[#A0A0A8] max-w-2xl leading-relaxed mb-3">
            Learn from the best in specialized, focused workshops. From beginner fundamentals to advanced seminars for competitors.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          {workshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((workshop, idx) => (
                <motion.div
                  key={workshop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <WorkshopCard {...workshop} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-white/10 rounded-lg">
              <p className="font-[family-name:var(--font-body)] text-[#A0A0A8] mb-6">
                No upcoming workshops at the moment.
              </p>
              <Link href="/programs" className="inline-block bg-[#DC2626] text-white font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white hover:text-black transition-all duration-300">
                EXPLORE PROGRAMS
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
