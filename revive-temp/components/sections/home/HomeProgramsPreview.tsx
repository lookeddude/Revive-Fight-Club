import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/ui/Reveal'
import type { ProgramCard } from '@/lib/data/content'

const FALLBACK_IMAGES: Record<string, string> = {
  mma: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=85&fit=crop',
  'muay-thai': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=85&fit=crop',
  bjj: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=800&q=85&fit=crop',
  boxing: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834b?w=800&q=85&fit=crop',
  default: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=800&q=85&fit=crop',
}

function getImage(program: ProgramCard, slideImages: Record<string, string>): string {
  if (slideImages[program.id]) return slideImages[program.id]
  if (program.image_path) return program.image_path
  return FALLBACK_IMAGES[program.slug] ?? FALLBACK_IMAGES.default
}

interface HomeProgramsPreviewProps {
  programs: ProgramCard[]
  slideImages: Record<string, string>
}

export function HomeProgramsPreview({ programs, slideImages }: HomeProgramsPreviewProps) {
  if (programs.length === 0) return null

  return (
    <section
      className="py-16 md:py-28 relative overflow-hidden"
      style={{ background: '#0E0C10' }}
    >
      <div className="sep-white" aria-hidden="true" />

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 md:px-12 pt-16 md:pt-24">

        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="section-label">Combat Sports &amp; Fitness</p>
              <h2
                className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-[0.92] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(38px, 6vw, 72px)' }}
              >
                OUR PROGRAMS
              </h2>
            </div>
            <Link
              href="/programs"
              aria-label="Explore all training programs at Revive Fight Club"
              className="group hidden md:flex items-center gap-3 font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.14em] uppercase text-[#707078] hover:text-[#FCFDFD] transition-colors self-end"
            >
              EXPLORE ALL
              <span className="flex items-center justify-center w-7 h-7 border border-white/10 group-hover:border-white/25 transition-all duration-300">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="square" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </Reveal>

        {/* Programs Grid */}
        <Reveal delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {programs.map((program, i) => (
              <Link
                key={program.id}
                href={`/programs/${program.slug}`}
                className="group relative overflow-hidden flex flex-col justify-end h-[300px] md:h-[440px]"
                style={{ background: '#19181E', border: '1px solid rgba(255,255,255,0.06)' }}
                aria-label={`View ${program.name} program`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={getImage(program, slideImages)}
                    alt={`${program.name} training at Revive Fight Club, Bengaluru`}
                    fill
                    loading="lazy"
                    quality={75}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    style={{ opacity: 0.65 }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Cinematic overlay */}
                  <div className="absolute inset-0 img-cinematic" aria-hidden="true" />
                  {/* Border glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)' }}
                    aria-hidden="true"
                  />
                </div>

                {/* Number top-right */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className="font-[family-name:var(--font-outfit)] font-black text-[36px] leading-none"
                    style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.12)', letterSpacing: '-0.04em' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Category tag */}
                {program.category && (
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.16em] uppercase px-2.5 py-1 text-[#A0A0A8]"
                      style={{ background: 'rgba(14,12,16,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      {program.category}
                    </span>
                  </div>
                )}

                {/* Card Content */}
                <div className="relative z-10 p-5">
                  <h3
                    className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] text-xl leading-tight tracking-[-0.02em] uppercase mb-2 group-hover:text-white transition-colors"
                  >
                    {program.name}
                  </h3>
                  {program.short_description && (
                    <p className="font-[family-name:var(--font-body)] text-[12px] text-[#707078] leading-relaxed mb-3 line-clamp-2">
                      {program.short_description}
                    </p>
                  )}
                  {/* Animated bottom line on hover */}
                  <div
                    className="w-0 h-px bg-white/40 group-hover:w-10 transition-all duration-500"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* Mobile — View All */}
        <div className="flex justify-center mt-10 md:hidden">
          <Link
            href="/programs"
            className="flex items-center gap-2 font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.14em] uppercase text-[#A0A0A8] px-6 py-3 transition-colors hover:text-[#FCFDFD]"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            EXPLORE ALL PROGRAMS
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="square" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
