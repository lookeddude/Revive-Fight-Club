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
      className="py-14 md:py-24 relative overflow-hidden section-divider"
      style={{ background: '#0d0c0b' }}
    >


      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16">

        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="section-label">Combat Sports & Fitness</p>
              <h2
                className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(38px, 6vw, 64px)' }}
              >
                OUR <span className="text-[#ff571a]">PROGRAMS</span>
              </h2>
            </div>
            <Link
              href="/programs"
              aria-label="Explore all training programs at Revive Fight Club"
              className="group hidden md:flex items-center gap-3 font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.12em] uppercase text-[#9ca3af] hover:text-[#ff571a] transition-colors self-end"
            >
              EXPLORE ALL PROGRAMS
              <span className="flex items-center justify-center w-8 h-8 border border-white/10 group-hover:border-[#ff571a]/40 group-hover:bg-[#ff571a]/08 transition-all duration-300">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="square" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </Reveal>

        {/* Programs Grid — 4-up on large, 2-up on tablet, 1-up on mobile */}
        <Reveal delay={120}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {programs.map((program, i) => (
            <Link
              key={program.id}
              href={`/programs/${program.slug}`}
              className="group relative overflow-hidden flex flex-col justify-end card-premium h-[280px] md:h-[420px]"
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
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ opacity: 0.72 }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Bottom gradient overlay - not full bleed */}
                <div className="absolute inset-0 img-overlay-bottom" aria-hidden="true" />
                {/* Subtle orange hover glow */}
                <div className="absolute inset-0 bg-[#ff571a]/0 group-hover:bg-[#ff571a]/04 transition-all duration-500" aria-hidden="true" />
              </div>

              {/* Top badges */}
              <div className="absolute top-4 left-4 z-10 flex gap-2 items-center">
                {program.category && (
                  <Badge variant="orange">{program.category}</Badge>
                )}
              </div>

              {/* Top-right number */}
              <div className="absolute top-4 right-4 z-10">
                <span
                  className="font-[family-name:var(--font-outfit)] font-black text-[40px] leading-none"
                  style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,87,26,0.25)', letterSpacing: '-0.04em' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Card Content */}
              <div className="relative z-10 p-6">
                <h3
                  className="font-[family-name:var(--font-outfit)] font-black text-white text-2xl leading-tight tracking-[-0.02em] uppercase mb-3 group-hover:text-white transition-colors"
                >
                  {program.name}
                </h3>
                {/* Description - always visible on mobile and desktop */}
                {program.short_description && (
                  <p className="font-[family-name:var(--font-body)] text-xs text-[#c8c4bf] leading-relaxed mb-3 line-clamp-2">
                    {program.short_description}
                  </p>
                )}
                {/* Orange accent underline */}
                <div className="w-0 h-[2px] bg-[var(--color-primary)] group-hover:w-12 transition-all duration-500" aria-hidden="true" />
              </div>
            </Link>
          ))}
          </div>
        </Reveal>

        {/* Mobile - View All */}
        <div className="flex justify-center mt-10 md:hidden">
          <Link
            href="/programs"
            className="btn-ghost"
          >
            EXPLORE ALL PROGRAMS
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="square" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
