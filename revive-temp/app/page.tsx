import type { Metadata } from 'next'
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

// ISR — page cached for 5 minutes on Vercel edge, then regenerated
export const revalidate = 300

export default async function HomePage() {
  // All 4 queries run in parallel — single round trip to Supabase
  const [programs, trainers, reviews, settings] = await Promise.all([
    getFeaturedPrograms(),
    getFeaturedTrainers(),
    getFeaturedReviews(3),
    getBusinessSettings(),
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
