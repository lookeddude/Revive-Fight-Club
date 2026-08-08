import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HomeHero } from '@/components/sections/home/HomeHero'
import { HomePhilosophy } from '@/components/sections/home/HomePhilosophy'
import { HomeStats } from '@/components/sections/home/HomeStats'
import { HomeProgramsPreview } from '@/components/sections/home/HomeProgramsPreview'
import { HomeTrainersPreview } from '@/components/sections/home/HomeTrainersPreview'
import { HomeReviews } from '@/components/sections/home/HomeReviews'
import { HomeCTA } from '@/components/sections/home/HomeCTA'
import {
  getFeaturedPrograms,
  getFeaturedTrainers,
  getFeaturedReviews,
  getBusinessSettings,
} from '@/lib/data/content'

export const metadata: Metadata = {
  title: 'Revive Fight Club | Elite MMA & Fitness in Bengaluru',
  description:
    'Elite MMA, Muay Thai, BJJ and fitness training in Frazer Town, Bengaluru. World-class coaches. Premium facilities. Book your trial class today.',
  alternates: {
    canonical: 'https://revivefightclub.com',
  },
}

// Cache for 5 minutes — fast loads, data stays fresh
export const revalidate = 300

// Cached data fetchers — prevents repeated DB calls on same render cycle
const getCachedPrograms = unstable_cache(
  getFeaturedPrograms,
  ['featured-programs'],
  { revalidate: 300, tags: ['programs'] }
)

const getCachedTrainers = unstable_cache(
  getFeaturedTrainers,
  ['featured-trainers'],
  { revalidate: 300, tags: ['trainers'] }
)

const getCachedReviews = unstable_cache(
  () => getFeaturedReviews(3),
  ['featured-reviews'],
  { revalidate: 300, tags: ['reviews'] }
)

const getCachedSettings = unstable_cache(
  getBusinessSettings,
  ['business-settings'],
  { revalidate: 600, tags: ['settings'] }
)

export default async function HomePage() {
  // Parallel fetch — all 4 queries run simultaneously
  const [programs, trainers, reviews, settings] = await Promise.all([
    getCachedPrograms(),
    getCachedTrainers(),
    getCachedReviews(),
    getCachedSettings(),
  ])

  return (
    <>
      <Header />
      <main>
        <HomeHero whatsappNumber={settings?.whatsapp_number ?? null} />
        <HomeStats />
        <HomePhilosophy />
        <HomeProgramsPreview programs={programs} />
        <HomeTrainersPreview trainers={trainers} />
        <HomeReviews reviews={reviews} />
        <HomeCTA whatsappNumber={settings?.whatsapp_number ?? null} />
      </main>
      <Footer />
    </>
  )
}
