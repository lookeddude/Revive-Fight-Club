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

export const metadata: Metadata = {
  title: 'Revive Fight Club | Elite MMA & Fitness in Bengaluru',
  description:
    'Elite MMA, Muay Thai, BJJ and fitness training in Frazer Town, Bengaluru. World-class coaches. Premium facilities. Book your trial class today.',
  alternates: {
    canonical: 'https://revivefightclub.com',
  },
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HomeHero />
        <HomePhilosophy />
        <HomeStats />
        <HomeProgramsPreview />
        <HomeTrainersPreview />
        <HomeReviews />
        <HomeCTA />
      </main>
      <Footer />
    </>
  )
}
