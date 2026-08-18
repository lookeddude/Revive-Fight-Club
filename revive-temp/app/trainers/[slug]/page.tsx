import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { getBusinessSettings } from '@/lib/data/content'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'

export const revalidate = 300

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=900&q=85&fit=crop',
  'https://images.unsplash.com/photo-1549476464-37392f717541?w=900&q=85&fit=crop',
]

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: trainer } = await supabase
    .from('trainers')
    .select('name, role, short_bio')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  if (!trainer) return { title: 'Trainer Not Found' }
  return {
    title: `${trainer.name} — ${trainer.role} | Revive Fight Club`,
    description: trainer.short_bio ?? `${trainer.name} — ${trainer.role} at Revive Fight Club, Bengaluru.`,
  }
}

export default async function TrainerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const [trainerRes, settings] = await Promise.all([
    supabase
      .from('trainers')
      .select('id, name, slug, role, short_bio, bio, profile_image_path, specialties, years_experience, is_active, is_featured')
      .eq('slug', slug)
      .eq('is_active', true)
      .single(),
    getBusinessSettings(),
  ])

  if (!trainerRes.data) notFound()
  const trainer = trainerRes.data
  const image = trainer.profile_image_path ?? FALLBACK_IMAGES[0]
  const specialties: string[] = Array.isArray(trainer.specialties) ? trainer.specialties as string[] : []

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen pt-14 md:pt-20" style={{ background: '#0a0b0a' }}>

        {/* ── Breadcrumb ─────────────────────────────────── */}
        <div
          className="border-b"
          style={{ background: '#0d0c0b', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-4">
            <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="font-[family-name:var(--font-body)] text-[#4b5563] hover:text-[#ff571a] transition-colors text-xs uppercase tracking-wider">Home</Link>
              <span className="text-[#2a2520]">/</span>
              <Link href="/trainers" className="font-[family-name:var(--font-body)] text-[#4b5563] hover:text-[#ff571a] transition-colors text-xs uppercase tracking-wider">Trainers</Link>
              <span className="text-[#2a2520]">/</span>
              <span className="font-[family-name:var(--font-body)] text-[#e2e3e1] text-xs uppercase tracking-wider">{trainer.name}</span>
            </nav>
          </div>
        </div>

        {/* ── Hero — Split Panel ─────────────────────────── */}
        <section style={{ background: '#0d0c0b', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: '72vh' }}>

              {/* ── LEFT: Text content ── */}
              <div className="flex flex-col justify-center px-5 md:px-16 py-14 md:py-24 order-2 md:order-1">

                {/* Featured badge */}
                {trainer.is_featured && (
                  <div className="mb-5">
                    <span
                      className="font-[family-name:var(--font-body)] text-xs font-black uppercase tracking-[0.18em] px-3 py-1.5"
                      style={{ background: '#ff571a', color: '#000' }}
                    >
                      ★ HEAD COACH
                    </span>
                  </div>
                )}

                {/* Role */}
                <p className="font-[family-name:var(--font-body)] text-xs font-black uppercase tracking-[0.22em] text-[#ff571a] mb-3">
                  {trainer.role}
                </p>

                {/* Name */}
                <h1
                  className="font-[family-name:var(--font-outfit)] font-black text-white uppercase leading-[0.88] tracking-[-0.03em] mb-8"
                  style={{ fontSize: 'clamp(44px, 6vw, 80px)' }}
                >
                  {trainer.name}
                </h1>

                {/* Stats row */}
                <div className="flex flex-wrap gap-3 mb-7">
                  {trainer.years_experience && (
                    <div className="px-4 py-3" style={{ background: 'rgba(255,87,26,0.1)', border: '1px solid rgba(255,87,26,0.25)' }}>
                      <p className="font-[family-name:var(--font-outfit)] font-black text-[#ff571a] text-xl leading-none">{trainer.years_experience}+</p>
                      <p className="font-[family-name:var(--font-body)] text-xs text-[#ff571a]/60 uppercase tracking-wider mt-0.5">Yrs Exp</p>
                    </div>
                  )}
                  {specialties.length > 0 && (
                    <div className="px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="font-[family-name:var(--font-outfit)] font-black text-white text-xl leading-none">{specialties.length}</p>
                      <p className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] uppercase tracking-wider mt-0.5">Disciplines</p>
                    </div>
                  )}
                  <div className="px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="font-[family-name:var(--font-outfit)] font-black text-white text-xl leading-none">PRO</p>
                    <p className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] uppercase tracking-wider mt-0.5">Fighter</p>
                  </div>
                </div>

                {/* Short bio */}
                {trainer.short_bio && (
                  <p
                    className="font-[family-name:var(--font-body)] text-sm text-[#9ca3af] leading-relaxed mb-8 max-w-md"
                    style={{ borderLeft: '2px solid rgba(255,87,26,0.4)', paddingLeft: '1rem' }}
                  >
                    {trainer.short_bio}
                  </p>
                )}

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/book-trial"
                    className="inline-flex items-center justify-center gap-2 text-black font-[family-name:var(--font-body)] text-sm font-black tracking-[0.12em] uppercase px-8 py-4 transition-colors duration-200 hover:bg-white"
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

              {/* ── RIGHT: Photo ── */}
              <div className="relative overflow-hidden order-1 md:order-2" style={{ minHeight: '420px' }}>
                <Image
                  src={image}
                  alt={trainer.name}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={image.startsWith('http')}
                />
                {/* Feather-edge blend — left only, very subtle */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to right, rgba(13,12,11,0.55) 0%, transparent 35%)' }}
                  aria-hidden="true"
                />
                {/* Bottom edge fade */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(13,12,11,0.4) 0%, transparent 25%)' }}
                  aria-hidden="true"
                />
              </div>

            </div>
          </div>
        </section>

        {/* ── Areas of Expertise ───────────────────────────── */}
        {specialties.length > 0 && (
          <section
            className="py-16 md:py-20"
            style={{ background: '#0d0c0b', borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="max-w-[1280px] mx-auto px-5 md:px-16">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-px bg-[#ff571a]" />
                <h2 className="font-[family-name:var(--font-body)] text-sm font-black uppercase tracking-[0.2em] text-[#ff571a]">Areas of Expertise</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {specialties.map((s, i) => (
                  <div
                    key={s}
                    className="flex items-center gap-2.5 px-4 py-2.5"
                    style={{
                      background: i < 3 ? 'rgba(255,87,26,0.08)' : 'rgba(255,255,255,0.03)',
                      border: i < 3 ? '1px solid rgba(255,87,26,0.25)' : '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: i < 3 ? '#ff571a' : 'rgba(255,255,255,0.2)' }}
                    />
                    <span
                      className="font-[family-name:var(--font-body)] text-sm font-semibold"
                      style={{ color: i < 3 ? '#f0ede8' : '#9ca3af' }}
                    >
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Full Bio ─────────────────────────────────────── */}
        {trainer.bio && (
          <section
            className="py-16 md:py-20"
            style={{ background: '#111210', borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="max-w-[1280px] mx-auto px-5 md:px-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-3 mb-2 lg:mb-0">
                    <div className="w-8 h-px bg-[#ff571a]" />
                    <h2 className="font-[family-name:var(--font-body)] text-sm font-black uppercase tracking-[0.2em] text-[#ff571a]">About</h2>
                  </div>
                  <h3
                    className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-none tracking-[-0.02em] mt-4 lg:mt-6"
                    style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
                  >
                    {trainer.name}
                  </h3>
                </div>
                <div className="lg:col-span-9">
                  <p className="font-[family-name:var(--font-body)] text-[15px] leading-[2] text-[#c8c4bf]">
                    {trainer.bio}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Bottom CTA ───────────────────────────────────── */}
        <section
          className="py-16 md:py-20"
          style={{ background: '#0d0c0b', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3
                  className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-none tracking-[-0.02em] mb-2"
                  style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}
                >
                  TRAIN WITH {trainer.name.toUpperCase()}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-sm text-[#9ca3af]">
                  Book a trial class and experience expert coaching first-hand.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href="/book-trial"
                  className="inline-flex items-center gap-2 text-black font-[family-name:var(--font-body)] font-black text-sm uppercase tracking-[0.1em] px-8 py-4 transition-all duration-200 hover:bg-white"
                  style={{ background: '#ff571a' }}
                >
                  BOOK A TRIAL
                </Link>
                <Link
                  href="/trainers"
                  className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] font-bold text-sm uppercase tracking-[0.1em] px-6 py-4 transition-all duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  All Trainers
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
