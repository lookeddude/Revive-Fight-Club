import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProgramSlideshow } from '@/components/ui/ProgramSlideshow'
import { getProgramBySlug, getBusinessSettings } from '@/lib/data/content'
import { getSlotImages } from '@/lib/data/images'
import { getProgramSlides } from '@/lib/data/programSlides'

export const revalidate = 300

const FALLBACK_IMAGES: Record<string, string> = {
  mma: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200&q=85&fit=crop',
  kickboxing: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=1200&q=85&fit=crop',
  boxing: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834b?w=1200&q=85&fit=crop',
  'muay-thai': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=85&fit=crop',
  'jiu-jitsu': 'https://images.unsplash.com/photo-1549476464-37392f717541?w=1200&q=85&fit=crop',
  'strength-conditioning': 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=1200&q=85&fit=crop',
  bodybuilding: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=85&fit=crop',
  'weight-loss': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=85&fit=crop',
  default: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=1200&q=85&fit=crop',
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const program = await getProgramBySlug(slug)
  if (!program) return { title: 'Program Not Found' }
  return {
    title: `${program.name} | Revive Fight Club`,
    description: program.short_description ?? `${program.name} training at Revive Fight Club, Bengaluru.`,
  }
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [program, settings, slotImages, dbSlides] = await Promise.all([
    getProgramBySlug(slug),
    getBusinessSettings(),
    getSlotImages([`program.${slug}`]),
    // We need program id — fetch slides after getting program
    Promise.resolve([] as Awaited<ReturnType<typeof getProgramSlides>>),
  ])

  if (!program) notFound()

  // Fetch slides with the real program id
  const programSlides = await getProgramSlides(program.id)

  // Image priority: DB slides → slot image → program image_path → Unsplash fallback
  const slotImage = slotImages[`program.${slug}`]
  const slideUrls = programSlides.map(s => s.image_url)
  const mainImage = slotImage ?? program.image_path ?? FALLBACK_IMAGES[slug] ?? FALLBACK_IMAGES.default
  const allImages = slideUrls.length > 0
    ? (slotImage && !slideUrls.includes(slotImage) ? [slotImage, ...slideUrls] : slideUrls)
    : [mainImage]

  const levelLabel = program.level?.replace('_', ' ') ?? 'All Levels'

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14 md:pt-20" style={{ background: '#0d0c0b' }}>

        {/* ── Breadcrumb ─────────────────────────────────── */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-6">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-[#6b6059] hover:text-[#ff571a] transition-colors font-[family-name:var(--font-inter)]">Home</Link>
            <span className="text-[#3a3530]">/</span>
            <Link href="/programs" className="text-[#6b6059] hover:text-[#ff571a] transition-colors font-[family-name:var(--font-inter)]">Programs</Link>
            <span className="text-[#3a3530]">/</span>
            <span className="text-[#f0ede8] font-[family-name:var(--font-inter)] font-semibold">{program.name}</span>
          </nav>
        </div>

        {/* ── Hero + Slideshow ────────────────────────────── */}
        <section className="max-w-[1280px] mx-auto px-5 md:px-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Slideshow */}
            <div className="lg:col-span-7">
              <div className="sticky top-24">
                <ProgramSlideshow images={allImages} programName={program.name} />
              </div>
            </div>

            {/* Program Info */}
            <div className="lg:col-span-5 flex flex-col gap-6">

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                {program.category && (
                  <span className="font-[family-name:var(--font-inter)] text-xs font-black tracking-[0.15em] uppercase text-[#ff571a]">
                    {program.category}
                  </span>
                )}
                <span className="text-[#3a3530]">·</span>
                <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider font-[family-name:var(--font-inter)]"
                  style={{ background: 'rgba(255,87,26,0.12)', border: '1px solid rgba(255,87,26,0.25)', color: '#ff571a' }}>
                  {levelLabel}
                </span>
                {program.duration_minutes && (
                  <>
                    <span className="text-[#3a3530]">·</span>
                    <span className="font-[family-name:var(--font-inter)] text-xs text-[#6b6059]">
                      {program.duration_minutes} min / session
                    </span>
                  </>
                )}
              </div>

              {/* Name */}
              <h1 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.03em] text-[clamp(40px,6vw,64px)]">
                {program.name}
              </h1>

              {/* Short desc */}
              {program.short_description && (
                <p className="font-[family-name:var(--font-inter)] text-lg leading-relaxed text-[#a09890]"
                  style={{ borderLeft: '2px solid rgba(255,87,26,0.4)', paddingLeft: '1.25rem' }}>
                  {program.short_description}
                </p>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={`/book-trial?program=${program.id}`}
                  className="inline-flex items-center justify-center gap-2 text-black font-[family-name:var(--font-inter)] text-sm font-black tracking-[0.14em] uppercase px-8 py-4 transition-all duration-300 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #ff571a, #e03020)', boxShadow: '0 4px 20px rgba(255,87,26,0.35)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  BOOK FREE TRIAL
                </Link>
                <Link
                  href="/programs"
                  className="inline-flex items-center justify-center gap-2 font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.12em] uppercase px-8 py-4 transition-all duration-300 text-[#f0ede8] hover:border-white/30"
                  style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}
                >
                  ← ALL PROGRAMS
                </Link>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { label: 'Level', value: levelLabel },
                  { label: 'Duration', value: program.duration_minutes ? `${program.duration_minutes}m` : 'Varies' },
                  { label: 'Category', value: program.category ?? 'Training' },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="font-[family-name:var(--font-outfit)] font-bold text-[#f0ede8] text-base uppercase">{value}</p>
                    <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#6b6059] uppercase tracking-wider mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Full Description ─────────────────────────────── */}
        {program.description && (
          <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
            <div className="max-w-[1280px] mx-auto px-5 md:px-16">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-[#ff571a]" />
                  <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.18em] uppercase text-[#ff571a]">
                    About This Program
                  </p>
                </div>
                <p className="font-[family-name:var(--font-inter)] text-lg leading-[1.9] text-[#8a8079] whitespace-pre-line">
                  {program.description}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── Bottom CTA ───────────────────────────────────── */}
        <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, #150e08 0%, #0d0c0b 100%)' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 text-center">
            <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase text-[clamp(28px,4vw,48px)] tracking-[-0.02em] mb-4">
              READY TO START <span className="text-[#ff571a]">{program.name}?</span>
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-[#8a8079] mb-8 max-w-md mx-auto">
              Book your free trial class today — no experience needed.
            </p>
            <Link
              href={`/book-trial?program=${program.id}`}
              className="inline-flex items-center gap-2 text-black font-[family-name:var(--font-inter)] text-sm font-black tracking-[0.14em] uppercase px-12 py-5 transition-all duration-300 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #ff571a, #e03020)', boxShadow: '0 4px 32px rgba(255,87,26,0.3)' }}
            >
              BOOK FREE TRIAL
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
