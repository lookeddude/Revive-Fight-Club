import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HomeHero } from '@/components/sections/home/HomeHero'
import { HomePhilosophy } from '@/components/sections/home/HomePhilosophy'
import { HomeVideo } from '@/components/sections/home/HomeVideo'
import { HomeStats } from '@/components/sections/home/HomeStats'
import { HomeProgramsPreview } from '@/components/sections/home/HomeProgramsPreview'
import { HomeTrainersPreview } from '@/components/sections/home/HomeTrainersPreview'
import { HomeReviews } from '@/components/sections/home/HomeReviews'
import { HomeMembership } from '@/components/sections/home/HomeMembership'
import { HomeSuccessStories } from '@/components/sections/home/HomeSuccessStories'
import { HomeCTA } from '@/components/sections/home/HomeCTA'
import { HomeFeaturedWorkshop } from '@/components/sections/home/HomeFeaturedWorkshop'
import {
  getFeaturedPrograms,
  getFeaturedTrainers,
  getFeaturedReviews,
  getBusinessSettings,
} from '@/lib/data/content'
import { getActiveHeroSlides, getHeroSettings } from '@/lib/data/heroSlideshow'
import { getFirstProgramSlides } from '@/lib/data/programSlides'
import { getFeaturedWorkshops } from '@/lib/data/workshops'

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

export const revalidate = 3600 // 1 hour — content is stable, no need to re-fetch every 5 min

export default async function HomePage() {
  const [programs, trainers, reviews, settings, heroSlides, heroSettings, featuredWorkshops, allSlideImages] = await Promise.all([
    getFeaturedPrograms(),
    getFeaturedTrainers(),
    getFeaturedReviews(10),
    getBusinessSettings(),
    getActiveHeroSlides(),
    getHeroSettings(),
    getFeaturedWorkshops(),
    getFirstProgramSlides([]), // fetches ALL active slides in one query; filtered below
  ])

  // Filter slide images to only those matching the fetched programs
  const programIds = programs.map(p => p.id)
  const slideImages = Object.fromEntries(
    Object.entries(allSlideImages).filter(([k]) => programIds.includes(k))
  )

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
        {featuredWorkshops.length > 0 && (
          <HomeFeaturedWorkshop workshops={featuredWorkshops} />
        )}
        <HomeTrainersPreview trainers={trainers} />
        <HomeVideo videoUrl={settings?.homepage_video_url ?? null} />
        <HomeReviews reviews={reviews} />
        <HomeSuccessStories />
        <HomeMembership />
        <HomeCTA whatsappNumber={settings?.whatsapp_number ?? null} />
      </main>
      <Footer />
    </>
  )
}
