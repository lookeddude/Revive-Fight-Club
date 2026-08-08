import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'

const programs = [
  {
    slug: 'mma',
    title: 'Mixed Martial Arts',
    category: 'FLAGSHIP PROGRAM',
    image:
      'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80&fit=crop',
    alt: 'Two MMA fighters training in a dark cinematic gym with dramatic lighting',
  },
  {
    slug: 'muay-thai',
    title: 'Muay Thai',
    category: 'STRIKING',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&fit=crop',
    alt: 'Muay Thai fighter executing a powerful kick during pad work training',
  },
  {
    slug: 'bjj',
    title: 'Brazilian Jiu-Jitsu',
    category: 'GRAPPLING',
    image:
      'https://images.unsplash.com/photo-1549476464-37392f717541?w=800&q=80&fit=crop',
    alt: 'Two BJJ practitioners engaged in technical ground control on dark mats',
  },
  {
    slug: 'strength-conditioning',
    title: 'Strength & Conditioning',
    category: 'PERFORMANCE',
    image:
      'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=800&q=80&fit=crop',
    alt: 'Athlete performing strength training in a premium dark gym facility',
  },
]

export function HomeProgramsPreview() {
  return (
    <section className="py-24 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-3">
              Training Disciplines
            </p>
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase leading-tight tracking-[-0.02em] text-[clamp(32px,4vw,48px)]">
              OUR PROGRAMS
            </h2>
          </div>
          <Link
            href="/programs"
            className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase text-[#ff571a] hover:text-white transition-colors flex items-center gap-2 self-start md:self-auto"
          >
            EXPLORE ALL PROGRAMS
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="square" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {programs.map((program) => (
            <Link
              key={program.slug}
              href={`/programs/${program.slug}`}
              className="group relative overflow-hidden h-80 flex flex-col justify-end p-6 border border-white/10 hover:border-white/20 transition-colors"
              aria-label={`View ${program.title} program`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity"
                  style={{ backgroundImage: `url('${program.image}')` }}
                  role="img"
                  aria-label={program.alt}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121413] via-[#121413]/60 to-transparent" />
              </div>

              {/* Card Content */}
              <div className="relative z-10">
                <Badge variant="orange" className="mb-3">
                  {program.category}
                </Badge>
                <h3 className="font-[family-name:var(--font-outfit)] font-semibold text-[#e2e3e1] text-2xl leading-tight tracking-[-0.01em] group-hover:text-white transition-colors">
                  {program.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
