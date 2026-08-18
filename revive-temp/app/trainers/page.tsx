import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getActiveTrainers, getBusinessSettings } from '@/lib/data/content'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'

export const metadata: Metadata = {
  title: 'Trainers | Revive Fight Club',
  description: 'Train under world-class MMA coaches at Revive Fight Club, Bengaluru. Professional fighters with 10+ years of combat sports coaching experience.',
}

export const revalidate = 300

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=900&q=85&fit=crop',
  'https://images.unsplash.com/photo-1549476464-37392f717541?w=900&q=85&fit=crop',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85&fit=crop',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=85&fit=crop',
]

export default async function TrainersPage() {
  const [trainers, settings] = await Promise.all([
    getActiveTrainers(),
    getBusinessSettings(),
  ])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-14 md:pt-20" style={{ backgroundColor: '#0a0b0a' }}>

        {/* ── Hero ─────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden py-20 md:py-28"
          style={{
            background: 'linear-gradient(180deg, #0d0c0b 0%, #111210 100%)',
            borderBottom: '1px solid rgba(255,87,26,0.12)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,87,26,0.07) 0%, transparent 70%)',
            }}
          />
          <div className="relative max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#ff571a]" />
              <p className="font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.2em] text-[#ff571a]">Our Coaches</p>
            </div>
            <h1
              className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.9] tracking-[-0.03em] mb-4"
              style={{ fontSize: 'clamp(44px, 7vw, 88px)' }}
            >
              WORLD-CLASS<br />
              <span style={{ color: '#ff571a' }}>TRAINERS</span>
            </h1>
            <p className="font-[family-name:var(--font-body)] text-base text-[#9ca3af] max-w-xl leading-relaxed">
              Professional fighters and experienced coaches dedicated to your development — from complete beginners to competitive athletes.
            </p>
          </div>
        </section>

        {/* ── Trainers Grid ─────────────────────────────────── */}
        <section className="py-16 md:py-24" style={{ backgroundColor: '#0d0c0b' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            {trainers.length > 0 ? (
              <div className="flex flex-col gap-5">
                {trainers.map((trainer, i) => {
                  const imgSrc = trainer.profile_image_path || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]
                  return (
                    <Link
                      key={trainer.id}
                      href={`/trainers/${trainer.slug}`}
                      className="group flex flex-col sm:flex-row overflow-hidden transition-all duration-300"
                      style={{
                        background: '#111210',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      {/* Photo — fixed small square */}
                      <div className="relative shrink-0 overflow-hidden" style={{ width: '100%', maxWidth: '220px', minHeight: '220px' }}>
                        <Image
                          src={imgSrc}
                          alt={trainer.name}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          sizes="220px"
                          unoptimized={imgSrc.startsWith('http')}
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, #111210)' }} />
                        {trainer.is_featured && (
                          <div className="absolute top-3 left-3">
                            <span className="font-[family-name:var(--font-body)] text-xs font-black uppercase tracking-[0.15em] px-2 py-1" style={{ background: '#ff571a', color: '#000' }}>
                              HEAD COACH
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col justify-center px-6 py-5 flex-1 min-w-0">
                        {/* Role */}
                        <p className="font-[family-name:var(--font-body)] text-xs font-black uppercase tracking-[0.2em] text-[#ff571a] mb-1">
                          {trainer.role}
                        </p>
                        {/* Name */}
                        <h2
                          className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-none tracking-[-0.02em] mb-3"
                          style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}
                        >
                          {trainer.name}
                        </h2>
                        {/* Stats */}
                        <div className="flex items-center gap-4 mb-3">
                          {trainer.years_experience && (
                            <div className="flex items-center gap-1.5">
                              <span className="font-[family-name:var(--font-outfit)] font-black text-[#ff571a] text-lg leading-none">{trainer.years_experience}+</span>
                              <span className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] uppercase tracking-wider">Yrs Exp</span>
                            </div>
                          )}
                          <div className="w-px h-4 bg-white/10" />
                          <div className="flex items-center gap-1.5">
                            <span className="font-[family-name:var(--font-outfit)] font-black text-white text-lg leading-none">{(trainer.specialties as string[])?.length ?? 0}</span>
                            <span className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] uppercase tracking-wider">Disciplines</span>
                          </div>
                          <div className="w-px h-4 bg-white/10" />
                          <span className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#4b5563]">Pro Fighter</span>
                        </div>
                        {/* Short bio */}
                        {trainer.short_bio && (
                          <p className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] leading-relaxed mb-4 line-clamp-2 max-w-xl">
                            {trainer.short_bio}
                          </p>
                        )}
                        {/* Specialty tags */}
                        {trainer.specialties && (trainer.specialties as string[]).length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {(trainer.specialties as string[]).slice(0, 5).map((s: string) => (
                              <span key={s} className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-2 py-1" style={{ background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.07)' }}>
                                {s}
                              </span>
                            ))}
                            {(trainer.specialties as string[]).length > 5 && (
                              <span className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-2 py-1" style={{ background: 'rgba(255,87,26,0.1)', color: '#ff571a', border: '1px solid rgba(255,87,26,0.2)' }}>
                                +{(trainer.specialties as string[]).length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                        {/* View profile */}
                        <div className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-xs font-black uppercase tracking-wider text-[#ff571a] opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                          View Full Profile
                          <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="square" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Right orange accent line on hover */}
                      <div className="w-0 group-hover:w-1 shrink-0 transition-all duration-300" style={{ background: '#ff571a' }} />
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="font-[family-name:var(--font-body)] text-[#6b7280] mb-8">Trainer profiles coming soon.</p>
                <Link href="/book-trial" className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300">
                  BOOK A TRIAL
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── Stats Bar ─────────────────────────────────────── */}
        <section
          style={{ background: '#111210', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {[
                { val: '10+', label: 'Years Experience' },
                { val: '2', label: 'Expert Coaches' },
                { val: '12+', label: 'Disciplines' },
                { val: '100%', label: 'Dedicated' },
              ].map(stat => (
                <div key={stat.label} className="text-center py-8 px-4">
                  <p
                    className="font-[family-name:var(--font-outfit)] font-black leading-none mb-1"
                    style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#ff571a' }}
                  >
                    {stat.val}
                  </p>
                  <p className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ────────────────────────────────────── */}
        <section
          className="py-20 md:py-28"
          style={{ background: 'linear-gradient(180deg, #0d0c0b 0%, #111210 100%)' }}
        >
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 text-center">
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#ff571a]" />
              <p className="font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.2em] text-[#ff571a]">Train With The Best</p>
              <div className="w-8 h-px bg-[#ff571a]" />
            </div>
            <h2
              className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-none tracking-[-0.02em] mb-4"
              style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
            >
              READY TO START?
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[#9ca3af] mb-8 max-w-md mx-auto leading-relaxed">
              Book a trial session and experience world-class coaching first-hand.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/book-trial"
                className="inline-flex items-center gap-2 text-black font-[family-name:var(--font-body)] font-black text-sm uppercase tracking-[0.1em] px-8 py-4 transition-all duration-200 hover:bg-white"
                style={{ background: '#ff571a' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                BOOK A TRIAL
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
