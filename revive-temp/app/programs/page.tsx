import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getActivePrograms, getBusinessSettings } from '@/lib/data/content'
import { getSlotImages } from '@/lib/data/images'
import { getFirstProgramSlides } from '@/lib/data/programSlides'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'

export const metadata: Metadata = {
  title: 'Programs | Revive Fight Club',
  description: 'Explore MMA, Muay Thai, Brazilian Jiu-Jitsu and Strength & Conditioning programs at Revive Fight Club, Bengaluru.',
}

export const revalidate = 300


export default async function ProgramsPage() {
  const [programs, settings] = await Promise.all([
    getActivePrograms(),
    getBusinessSettings(),
  ])

  const slotKeys = programs.map(p => `program.${p.slug}`)
  const [slotImages, slideImages] = await Promise.all([
    slotKeys.length > 0 ? getSlotImages(slotKeys) : Promise.resolve({} as Record<string, string | null>),
    getFirstProgramSlides(programs.map(p => p.id)),
  ])

  // Priority: uploaded program slide → slot image → image_path → null
  const getImage = (slug: string, id: string, imagePath: string | null): string | null =>
    slideImages[id] ?? slotImages[`program.${slug}`] ?? imagePath ?? null

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14 md:pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 border-b border-white/10">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-4">
              Training Programs
            </p>
            <h1 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase leading-tight tracking-[-0.02em] text-[clamp(32px,5vw,64px)] max-w-2xl mb-4">
              ELITE PROGRAMS
            </h1>
            <p className="font-[family-name:var(--font-inter)] text-lg text-[#bab8b7] max-w-xl leading-relaxed">
              World-class combat sports and fitness training for every level — from first-timers to competitive fighters.
            </p>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            {programs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {programs.map((program) => {
                  const img = getImage(program.slug, program.id, program.image_path)
                  return (
                    <div key={program.id} className="group flex flex-col">
                      <div className="relative overflow-hidden aspect-[4/3] bg-[#1a1c1b] mb-6">
                        {img ? (
                          <Image
                            src={img}
                            alt={program.name}
                            fill
                            className="object-cover image-hover-scale"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-[family-name:var(--font-inter)] text-xs text-[#3a3530] uppercase tracking-wider">No Image</span>
                          </div>
                        )}
                        {program.level && (
                          <span className="absolute top-4 left-4 bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase px-3 py-1">
                            {program.level.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      {program.category && (
                        <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-2">
                          {program.category}
                        </p>
                      )}
                      <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-2xl uppercase tracking-tight mb-3">
                        {program.name}
                      </h2>
                      {program.short_description && (
                        <p className="font-[family-name:var(--font-inter)] text-sm text-[#bab8b7] leading-relaxed mb-6 flex-1">
                          {program.short_description}
                        </p>
                      )}
                      <div className="flex gap-3 flex-wrap">
                        <Link
                          href={`/book-trial?program=${program.id}`}
                          className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-6 py-3 hover:bg-white transition-all duration-300 active:scale-95"
                        >
                          BOOK TRIAL
                        </Link>
                        <Link
                          href={`/programs/${program.slug}`}
                          className="inline-flex items-center gap-2 font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-6 py-3 transition-all duration-300 hover:border-white/30 text-[#f0ede8]"
                          style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}
                        >
                          SEE MORE
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="square" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="font-[family-name:var(--font-inter)] text-[#bab8b7] mb-8">
                  Program details coming soon. Contact us to find out more.
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
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-white/10 bg-[#0d0f0e]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 text-center">
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase text-3xl mb-4">
              NOT SURE WHERE TO START?
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-[#bab8b7] mb-8">
              Book a trial class and our coaches will help you find the right program.
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
