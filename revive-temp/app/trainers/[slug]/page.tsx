import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { getBusinessSettings } from '@/lib/data/content'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'

export const revalidate = 300

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&q=80&fit=crop',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&fit=crop',
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
    title: `${trainer.name} | Revive Fight Club`,
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

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14 md:pt-20" style={{ background: '#0d0c0b' }}>

        {/* Breadcrumb */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-6">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-[#6b6059] hover:text-[#ff571a] transition-colors font-[family-name:var(--font-inter)]">Home</Link>
            <span className="text-[#3a3530]">/</span>
            <Link href="/trainers" className="text-[#6b6059] hover:text-[#ff571a] transition-colors font-[family-name:var(--font-inter)]">Trainers</Link>
            <span className="text-[#3a3530]">/</span>
            <span className="text-[#f0ede8] font-[family-name:var(--font-inter)] font-semibold">{trainer.name}</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="max-w-[1280px] mx-auto px-5 md:px-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Image */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <div className="relative aspect-[3/4] overflow-hidden" style={{ background: '#111' }}>
                  <Image
                    src={image}
                    alt={trainer.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 41vw"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,12,11,0.8) 0%, transparent 50%)' }} />
                  {trainer.is_featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-black uppercase tracking-wider px-3 py-1">
                        Head Coach
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7 flex flex-col gap-6 lg:pt-4">
              <div>
                <span className="font-[family-name:var(--font-inter)] text-xs font-black tracking-[0.15em] uppercase text-[#ff571a]">
                  {trainer.role}
                </span>
                <h1 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.03em] text-[clamp(40px,6vw,72px)] mt-2">
                  {trainer.name}
                </h1>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-3">
                {trainer.years_experience && (
                  <div className="px-4 py-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="font-[family-name:var(--font-outfit)] font-bold text-[#f0ede8] text-xl">{trainer.years_experience}+</p>
                    <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#6b6059] uppercase tracking-wider mt-0.5">Yrs Experience</p>
                  </div>
                )}
              </div>

              {/* Short bio */}
              {trainer.short_bio && (
                <p className="font-[family-name:var(--font-inter)] text-lg leading-relaxed text-[#a09890]"
                  style={{ borderLeft: '2px solid rgba(255,87,26,0.4)', paddingLeft: '1.25rem' }}>
                  {trainer.short_bio}
                </p>
              )}

              {/* Specialties */}
              {trainer.specialties && trainer.specialties.length > 0 && (
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.15em] uppercase text-[#6b6059] mb-3">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {trainer.specialties.map((s: string) => (
                      <span key={s} className="px-3 py-1.5 font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#e2e3e1]" style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/book-trial"
                  className="inline-flex items-center justify-center gap-2 text-black font-[family-name:var(--font-inter)] text-sm font-black tracking-[0.14em] uppercase px-8 py-4 transition-all duration-300 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #ff571a, #e03020)', boxShadow: '0 4px 20px rgba(255,87,26,0.35)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  BOOK A TRIAL
                </Link>
                <WhatsAppCTA
                  whatsappNumber={settings?.whatsapp_number ?? null}
                  context="general"
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Full Bio */}
        {trainer.bio && (
          <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
            <div className="max-w-[1280px] mx-auto px-5 md:px-16">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-[#ff571a]" />
                  <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.18em] uppercase text-[#ff571a]">About {trainer.name}</p>
                </div>
                <p className="font-[family-name:var(--font-inter)] text-lg leading-[1.9] text-[#8a8079] whitespace-pre-line">{trainer.bio}</p>
              </div>
            </div>
          </section>
        )}

        {/* Back nav */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-12">
          <Link href="/trainers" className="inline-flex items-center gap-2 font-[family-name:var(--font-inter)] text-sm font-bold uppercase tracking-wider text-[#6b6059] hover:text-[#f0ede8] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7" /></svg>
            All Trainers
          </Link>
        </div>

      </main>
      <Footer />
    </>
  )
}
