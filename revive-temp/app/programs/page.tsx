import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
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

  const getImage = (slug: string, id: string, imagePath: string | null): string | null =>
    slideImages[id] ?? slotImages[`program.${slug}`] ?? imagePath ?? null

  const levelLabel = (level: string | null | undefined) => {
    if (!level) return null
    return level.replaceAll('_', ' ')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-14 md:pt-20">
        {/* Hero */}
        <section className="py-16 md:py-20 border-b border-white/10">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#ff571a]" />
              <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.18em] uppercase text-[#ff571a]">
                Training Programs
              </p>
            </div>
            <h1 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.95] tracking-[-0.03em] text-[clamp(36px,5vw,72px)] max-w-2xl mb-4">
              ELITE PROGRAMS
            </h1>
            <p className="font-[family-name:var(--font-inter)] text-base text-[#8a8079] max-w-xl leading-relaxed">
              World-class combat sports and fitness training for every level — from first-timers to competitive fighters.
            </p>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            {programs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((program) => {
                  const img = getImage(program.slug, program.id, program.image_path)
                  const level = levelLabel(program.level)
                  return (
                    <div key={program.id} className="group flex flex-col border border-white/[0.07] hover:border-white/20 transition-all duration-300" style={{ background: '#0f0e0d' }}>
                      {/* Image */}
                      <div className="relative overflow-hidden bg-[#1a1c1b]" style={{ height: '240px' }}>
                        {img ? (
                          <Image
                            src={img}
                            alt={program.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-[family-name:var(--font-inter)] text-xs text-[#3a3530] uppercase tracking-wider">No Image</span>
                          </div>
                        )}
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,14,13,1) 0%, rgba(15,14,13,0.3) 50%, transparent 100%)' }} />
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                          {program.category && (
                            <span className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-[10px] font-black tracking-[0.1em] uppercase px-2.5 py-1">
                              {program.category}
                            </span>
                          )}
                          {level && (
                            <span className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)', color: '#d4cfc9' }}>
                              {level}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-6">
                        <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] text-2xl uppercase tracking-tight mb-3 leading-tight group-hover:text-white transition-colors">
                          {program.name}
                        </h2>
                        {program.short_description ? (
                          <p className="font-[family-name:var(--font-inter)] text-sm text-[#8a8079] leading-relaxed mb-5 flex-1">
                            {program.short_description}
                          </p>
                        ) : (
                          <div className="flex-1" />
                        )}

                        <div className="flex gap-3 flex-wrap">
                          <Link
                            href={`/book-trial?program=${program.id}`}
                            className="inline-flex items-center gap-2 text-black font-[family-name:var(--font-inter)] text-xs font-black tracking-[0.12em] uppercase px-5 py-3 transition-all duration-300 active:scale-95"
                            style={{ background: 'linear-gradient(135deg, #ff571a, #e03020)' }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            BOOK TRIAL
                          </Link>
                          <Link
                            href={`/programs/${program.slug}`}
                            className="inline-flex items-center gap-2 font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase px-5 py-3 transition-all duration-300 hover:border-white/30 text-[#f0ede8]"
                            style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}
                          >
                            VIEW MORE
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="font-[family-name:var(--font-inter)] text-[#8a8079] mb-8">
                  Program details coming soon. Contact us to find out more.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/book-trial" className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300">
                    BOOK A TRIAL
                  </Link>
                  <WhatsAppCTA whatsappNumber={settings?.whatsapp_number ?? null} context="general" variant="secondary" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 border-t border-white/10" style={{ background: '#0a0b0a' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 text-center">
            <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase text-[clamp(24px,3vw,36px)] tracking-[-0.02em] mb-4">
              NOT SURE WHERE TO START?
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-[#8a8079] mb-8 max-w-md mx-auto">
              Book a trial class and our coaches will help you find the right program.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/book-trial" className="inline-flex items-center gap-2 text-black font-[family-name:var(--font-inter)] text-sm font-black tracking-[0.12em] uppercase px-8 py-4 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #ff571a, #e03020)' }}>
                BOOK TRIAL
              </Link>
              <WhatsAppCTA whatsappNumber={settings?.whatsapp_number ?? null} context="general" variant="secondary" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
