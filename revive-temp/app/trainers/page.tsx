import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getActiveTrainers, getBusinessSettings } from '@/lib/data/content'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'

export const metadata: Metadata = {
  title: 'Trainers | Revive Fight Club',
  description: 'Meet the world-class coaching staff at Revive Fight Club, Bengaluru.',
}

export const revalidate = 300

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&q=80&fit=crop',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&fit=crop',
  'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=800&q=80&fit=crop',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80&fit=crop',
]

export default async function TrainersPage() {
  const [trainers, settings] = await Promise.all([
    getActiveTrainers(),
    getBusinessSettings(),
  ])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-14 md:pt-20">
        <section className="py-16 md:py-24 border-b border-white/10">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-4">
              Our Coaches
            </p>
            <h1 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase leading-tight tracking-[-0.02em] text-[clamp(32px,5vw,64px)] max-w-2xl mb-4">
              WORLD-CLASS TRAINERS
            </h1>
            <p className="font-[family-name:var(--font-inter)] text-lg text-[#bab8b7] max-w-xl leading-relaxed">
              Experienced coaches dedicated to your development — whether you&apos;re a beginner or a competitive fighter.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            {trainers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {trainers.map((trainer, i) => (
                  <Link key={trainer.id} href={`/trainers/${trainer.slug}`} className="group block border border-white/[0.06] hover:border-white/20 transition-all duration-300">
                    <div className="relative overflow-hidden aspect-[3/4] bg-[#1a1c1b] mb-5">
                      <Image
                        src={trainer.profile_image_path || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                        alt={trainer.name}
                        fill
                        className="object-cover image-hover-scale"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-1">
                      {trainer.role}
                    </p>
                    <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight mb-2">
                      {trainer.name}
                    </h2>
                    {trainer.short_bio && (
                      <p className="font-[family-name:var(--font-inter)] text-sm text-[#bab8b7] leading-relaxed">
                        {trainer.short_bio}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 mt-3 font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#ff571a] opacity-0 group-hover:opacity-100 transition-opacity">
                      View Profile
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="font-[family-name:var(--font-inter)] text-[#bab8b7] mb-8">
                  Trainer profiles coming soon.
                </p>
                <Link
                  href="/book-trial"
                  className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300"
                >
                  BOOK A TRIAL
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="py-16 border-t border-white/10 bg-[#0d0f0e]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 text-center">
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase text-3xl mb-4">
              TRAIN WITH THE BEST
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-[#bab8b7] mb-8">
              Book a trial and train alongside our world-class coaches.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/book-trial"
                className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300"
              >
                BOOK A TRIAL
              </Link>
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
