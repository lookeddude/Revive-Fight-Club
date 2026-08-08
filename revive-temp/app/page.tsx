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
import { getFeaturedPrograms } from '@/lib/data/content'
import { getFeaturedTrainers } from '@/lib/data/content'
import { getFeaturedReviews } from '@/lib/data/content'

export const metadata: Metadata = {
  title: 'Revive Fight Club | Elite MMA & Fitness in Bengaluru',
  description:
    'Elite MMA, Muay Thai, BJJ and fitness training in Frazer Town, Bengaluru. World-class coaches. Premium facilities. Book your trial class today.',
  alternates: {
    canonical: 'https://revivefightclub.com',
  },
}

// Revalidate every 60 seconds — ISR keeps homepage fast without stale content
export const revalidate = 60

export default async function HomePage() {
  // Server-side parallel fetches — all public, all typed
  const [programs, trainers, reviews] = await Promise.all([
    getFeaturedPrograms(),
    getFeaturedTrainers(),
    getFeaturedReviews(3),
  ])

  return (
    <>
      <Header />
      <main>
        <HomeHero />
        <HomePhilosophy />
        <HomeStats />
        {/* Programs section — shows only if active data exists in DB */}
        <HomeProgramsPreview programs={programs} />
        {/* Trainers section — shows only if active data exists in DB */}
        <HomeTrainersPreview trainers={trainers} />
        {/* Reviews section — shows only if published reviews exist */}
        <HomeReviews reviews={reviews} />
        <HomeCTA />
      </main>
      <Footer />
    </>
  )
}
