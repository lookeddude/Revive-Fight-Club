import Link from 'next/link'
import Image from 'next/image'
import { buildWhatsAppUrl, WHATSAPP_MESSAGES } from '@/lib/business'

interface HomeHeroProps {
  whatsappNumber?: string | null
  heroImage?: string | null
}

const DEFAULT_HERO = 'https://hnmtjcpmdywwtafgexxk.supabase.co/storage/v1/object/public/revive-brand/seconf.png'

export function HomeHero({ whatsappNumber, heroImage }: HomeHeroProps) {
  const whatsappUrl = buildWhatsAppUrl(whatsappNumber ?? null, WHATSAPP_MESSAGES.general)
  const bgImage = heroImage ?? DEFAULT_HERO

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">

      {/* ── Background Photo ───────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        {/* next/image with priority — loads instantly, auto WebP/AVIF */}
        <Image
          src={bgImage}
          alt="Revive Fight Club athletes training"
          fill
          priority
          quality={85}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />

        {/* Strong left-to-right gradient — text on left, photo visible on right */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, rgba(13,12,11,0.97) 0%, rgba(13,12,11,0.88) 30%, rgba(13,12,11,0.55) 55%, rgba(13,12,11,0.15) 75%, rgba(13,12,11,0.0) 100%)',
          }}
        />

        {/* Top vignette — keeps nav area dark and readable */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(13,12,11,0.7) 0%, transparent 30%)',
          }}
        />

        {/* Bottom vignette — grounds the section */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(13,12,11,1) 0%, rgba(13,12,11,0.4) 25%, transparent 50%)',
          }}
        />

        {/* Orange warm glow — bottom left atmospheric */}
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[300px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at bottom left, rgba(255,87,26,0.14) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── Hero Content ──────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 md:px-16 py-16 md:py-24">
        <div className="max-w-[620px]">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-8 h-0.5"
              style={{ background: 'linear-gradient(to right, #ff571a, #e03020)' }}
            />
            <p className="font-[family-name:var(--font-inter)] text-xs font-black tracking-[0.22em] uppercase text-[#ff571a]">
              MMA · MUAY THAI · BOXING · BJJ
            </p>
          </div>

          {/* Main Headline */}
          <h1 className="font-[family-name:var(--font-outfit)] font-black uppercase leading-[0.9] tracking-[-0.03em] mb-8">

            {/* REVIVE — white solid */}
            <span
              className="block text-[#f0ede8]"
              style={{ fontSize: 'clamp(60px, 11vw, 116px)' }}
            >
              REVIVE
            </span>

            {/* FIGHT — orange with left border accent */}
            <span
              className="block text-[#ff571a] relative"
              style={{ fontSize: 'clamp(60px, 11vw, 116px)' }}
            >
              FIGHT
              {/* Decorative line */}
              <span
                className="absolute -left-5 top-1/2 -translate-y-1/2 w-1 h-4/5"
                style={{ background: 'linear-gradient(to bottom, #ff571a, #e03020)', opacity: 0.6 }}
              />
            </span>

            {/* CLUB — outlined / ghost */}
            <span
              className="block"
              style={{
                fontSize: 'clamp(60px, 11vw, 116px)',
                color: 'transparent',
                WebkitTextStroke: '2px #f0ede8',
                opacity: 0.9,
              }}
            >
              CLUB
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="font-[family-name:var(--font-inter)] text-lg leading-[1.75] text-[#c0b8b0] mb-10 pl-5"
            style={{ borderLeft: '2px solid rgba(255,87,26,0.5)' }}
          >
            Elite combat sports training in the heart of<br />
            <span className="text-[#f0ede8] font-semibold">Frazer Town, Bengaluru.</span>{' '}
            Precision. Discipline. Transformation.
          </p>

          {/* Social Proof */}
          <div className="flex items-center gap-3 mb-10 flex-wrap">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-4 h-4 fill-[#f5a623]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="font-[family-name:var(--font-inter)] text-sm font-black text-[#f0ede8] ml-1.5">5.0</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <span className="font-[family-name:var(--font-inter)] text-sm text-[#9a9088]">126+ Verified Reviews</span>
            <div className="w-px h-4 bg-white/20" />
            <span className="font-[family-name:var(--font-inter)] text-sm text-[#9a9088]">Frazer Town, Bengaluru</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/book-trial"
              className="inline-flex items-center justify-center gap-2 text-black font-[family-name:var(--font-inter)] text-sm font-black tracking-[0.14em] uppercase px-10 py-5 active:scale-95 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #ff571a 0%, #e03020 100%)',
                boxShadow: '0 4px 24px rgba(255,87,26,0.4)',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              BOOK FREE TRIAL
            </Link>

            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.12em] uppercase px-10 py-5 transition-all duration-300 active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  color: '#f0ede8',
                }}
                aria-label="Contact Revive Fight Club on WhatsApp"
              >
                <svg className="w-4 h-4 fill-[#25d366]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WHATSAPP US
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.12em] uppercase px-10 py-5 transition-all duration-300 text-[#f0ede8]"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                CONTACT US
              </Link>
            )}
          </div>

          {/* Scroll hint */}
          <div className="mt-14 flex items-center gap-3 opacity-35">
            <div
              className="w-px h-8"
              style={{ background: 'linear-gradient(to bottom, #ff571a, transparent)' }}
            />
            <span className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#f0ede8]">
              Scroll to explore
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
