import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
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
import { getActiveHeroSlides, getHeroSettings } from '@/lib/data/heroSlideshow'
import { getFirstProgramSlides } from '@/lib/data/programSlides'

export const metadata: Metadata = {
  title: 'Revive Fight Club | MMA, Boxing & Fitness Gym in Bengaluru',
  description:
    'Revive Fight Club — MMA, Boxing, Kickboxing, Jiu-Jitsu, Muay Thai and fitness training in Fraser Town, Bengaluru. World-class coaches. Premium facilities. Book a trial class today.',
  alternates: {
    canonical: 'https://revivefightclub.com',
  },
  openGraph: {
    url: 'https://revivefightclub.com',
    title: 'Revive Fight Club | MMA, Boxing & Fitness Gym in Bengaluru',
    description: 'MMA, Boxing, Kickboxing, Jiu-Jitsu, Muay Thai and fitness training in Fraser Town, Bengaluru. World-class coaches. Book a trial class today.',
  },
}

export const revalidate = 300

export default async function HomePage() {
  const [programs, trainers, reviews, settings, heroSlides, heroSettings] = await Promise.all([
    getFeaturedPrograms(),
    getFeaturedTrainers(),
    getFeaturedReviews(10),
    getBusinessSettings(),
    getActiveHeroSlides(),
    getHeroSettings(),
  ])

  // Fetch first slide image per program (overrides image_path on cards)
  const slideImages = await getFirstProgramSlides(programs.map(p => p.id))

  return (
    <>
      <Navbar />
      <main id="main">
        <HomeHero
          whatsappNumber={settings?.whatsapp_number ?? null}
          slides={heroSlides}
          settings={heroSettings}
          programNames={programs.map(p => p.name)}
        />
        <HomeStats />
        <HomePhilosophy />
        <HomeProgramsPreview programs={programs} slideImages={slideImages} />
        <HomeTrainersPreview trainers={trainers} />
        <HomeReviews reviews={reviews} />
        <HomeCTA whatsappNumber={settings?.whatsapp_number ?? null} />
      </main>
      <Footer />
    </>
  )
}
