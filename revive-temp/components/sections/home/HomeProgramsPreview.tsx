import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
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
    <section className="py-24 section-divider relative" style={{ background: 'linear-gradient(180deg, #0d0c0b 0%, #111009 100%)' }}>
      {/* Background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,87,26,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16">

        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#ff571a]" />
            <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.18em] uppercase text-[#ff571a]">
              Training Disciplines
            </p>
          </div>
          <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.95] tracking-[-0.03em] text-[clamp(36px,5vw,56px)]">
            OUR<br />
            <span className="text-[#ff571a]">PROGRAMS</span>
          </h2>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {programs.map((program, i) => (
            <Link
              key={program.id}
              href={`/programs/${program.slug}`}
              className="group relative overflow-hidden flex flex-col justify-end border border-white/[0.08] hover:border-[#ff571a]/30 transition-colors duration-300"
              style={{ height: '380px' }}
              aria-label={`View ${program.name} program`}
            >
              {/* Background Image — Next.js Image for optimization */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={getImage(program, slideImages)}
                  alt={program.name}
                  fill
                  className="object-cover opacity-65 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b] via-[#0d0c0b]/60 to-transparent" />
                {/* Orange hover glow */}
                <div className="absolute inset-0 bg-[#ff571a]/0 group-hover:bg-[#ff571a]/5 transition-all duration-500" />
              </div>

              {/* Category badge */}
              {program.category && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="orange">{program.category}</Badge>
                </div>
              )}

              {/* Number */}
              <div className="absolute top-4 right-4 z-10">
                <span
                  className="font-[family-name:var(--font-outfit)] font-black text-4xl"
                  style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,87,26,0.3)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Card Content */}
              <div className="relative z-10 p-6">
                <h3 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] text-2xl leading-tight tracking-[-0.02em] group-hover:text-white transition-colors uppercase mb-2">
                  {program.name}
                </h3>
                {/* Short description — visible on hover */}
                {program.short_description && (
                  <p className="font-[family-name:var(--font-inter)] text-xs text-[#d4cfc9] leading-relaxed mb-3 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-10 overflow-hidden">
                    {program.short_description}
                  </p>
                )}
                {/* Animated accent line */}
                <div className="w-0 h-0.5 bg-[#ff571a] group-hover:w-10 transition-all duration-400" />
              </div>
            </Link>
          ))}
        </div>

        {/* Explore All */}
        <div className="flex justify-center mt-10">
          <Link
            href="/programs"
            className="group flex items-center gap-3 font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.12em] uppercase text-[#f0ede8] hover:text-[#ff571a] transition-colors"
          >
            EXPLORE ALL PROGRAMS
            <span className="flex items-center justify-center w-8 h-8 border border-white/15 group-hover:border-[#ff571a] group-hover:bg-[#ff571a]/10 transition-all duration-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="square" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
