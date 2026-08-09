import Link from 'next/link'
import Image from 'next/image'
import type { TrainerCard } from '@/lib/data/content'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&q=80&fit=crop',
  'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=800&q=80&fit=crop',
]

interface HomeTrainersPreviewProps {
  trainers: TrainerCard[]
}

export function HomeTrainersPreview({ trainers }: HomeTrainersPreviewProps) {
  if (trainers.length === 0) return null

  return (
    <section
      className="py-14 md:py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0d0c0b 0%, #111210 50%, #0d0c0b 100%)' }}
    >
      {/* Top separator */}
      <div className="sep-subtle" aria-hidden="true" />

      {/* Warm right-side glow */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 100% 50%, rgba(255,87,26,0.04) 0%, transparent 60%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="section-label">Coaching Staff</p>
            <h2
              className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(38px, 6vw, 64px)' }}
            >
              MEET THE <span className="text-[#ff571a]">COACHES</span>
            </h2>
          </div>
          <Link
            href="/trainers"
            className="group flex items-center gap-3 font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.12em] uppercase text-[#6b6059] hover:text-[#ff571a] transition-colors self-start md:self-end"
          >
            VIEW ALL TRAINERS
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="square" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Trainer Cards — Compact horizontal on mobile, editorial alternating on desktop */}
        <div className="flex flex-col gap-4">
          {trainers.map((trainer, index) => {
            const imageRight = index % 2 !== 0
            const image = trainer.profile_image_path ?? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]

            return (
              <Link
                key={trainer.id}
                href={`/trainers/${trainer.slug}`}
                className="group card-premium overflow-hidden"
                aria-label={`View ${trainer.name} profile`}
              >
                {/* Mobile: compact horizontal card */}
                <div className="flex md:hidden" style={{ minHeight: '140px' }}>
                  {/* Image — fixed width left column */}
                  <div className="relative flex-shrink-0 overflow-hidden" style={{ width: '38%' }}>
                    <Image
                      src={image}
                      alt={`${trainer.name}, ${trainer.role}`}
                      fill
                      className="object-cover trainer-img"
                      sizes="38vw"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, rgba(22,20,18,0.5))' }} aria-hidden="true" />
                  </div>
                  {/* Content */}
                  <div className="flex flex-col justify-center px-5 py-4 flex-1" style={{ background: 'rgba(22,20,18,0.5)' }}>
                    <span className="font-[family-name:var(--font-inter)] text-[10px] font-black tracking-[0.18em] uppercase text-[#ff571a] mb-1 block">
                      {trainer.role}
                    </span>
                    <h3 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase tracking-[-0.02em] leading-tight mb-2" style={{ fontSize: '20px' }}>
                      {trainer.name}
                    </h3>
                    {trainer.specialties && trainer.specialties.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {trainer.specialties.slice(0, 2).map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-0.5 font-[family-name:var(--font-inter)] text-[9px] font-bold tracking-[0.08em] uppercase text-[#8a7e76]"
                            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.12em] uppercase text-[#ff571a]">
                      VIEW PROFILE
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="square" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Desktop: editorial alternating layout */}
                <div
                  className="hidden md:grid md:grid-cols-12"
                  style={{ minHeight: '360px' }}
                >
                  {/* Image */}
                  <div
                    className={`md:col-span-7 relative overflow-hidden ${
                      imageRight ? 'md:order-2' : 'md:order-1'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${trainer.name}, ${trainer.role}`}
                      fill
                      className="object-cover trainer-img group-hover:scale-104 transition-transform duration-600"
                      sizes="58vw"
                    />
                  </div>
                  {/* Content */}
                  <div
                    className={`md:col-span-5 flex flex-col justify-center p-10 ${
                      imageRight ? 'md:order-1' : 'md:order-2'
                    }`}
                    style={{ background: 'rgba(22,20,18,0.5)' }}
                  >
                    <span className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.18em] uppercase text-[#ff571a] mb-3 block">
                      {trainer.role}
                    </span>
                    <h3
                      className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase tracking-[-0.02em] mb-4 leading-tight"
                      style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}
                    >
                      {trainer.name}
                    </h3>
                    {trainer.short_bio && (
                      <p className="font-[family-name:var(--font-inter)] text-[15px] leading-[1.8] text-[#7a7068] mb-6">
                        {trainer.short_bio}
                      </p>
                    )}
                    {trainer.specialties && trainer.specialties.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {trainer.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-3 py-1 font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.1em] uppercase text-[#8a7e76]"
                            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-6 flex items-center gap-2 font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.12em] uppercase text-[#ff571a] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      VIEW PROFILE
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="square" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Mobile: View All link */}
        <div className="flex justify-center mt-8 md:hidden">
          <Link
            href="/trainers"
            className="flex items-center gap-2 font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.14em] uppercase text-[#f0ede8] px-6 py-3 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
          >
            VIEW ALL TRAINERS
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="square" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
