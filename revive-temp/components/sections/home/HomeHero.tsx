import Link from 'next/link'
import { buildWhatsAppUrl, WHATSAPP_MESSAGES } from '@/lib/business'

interface HomeHeroProps {
  whatsappNumber?: string | null
}

export function HomeHero({ whatsappNumber }: HomeHeroProps) {
  const whatsappUrl = buildWhatsAppUrl(whatsappNumber ?? null, WHATSAPP_MESSAGES.general)

  return (
    <section className="relative min-h-screen flex items-end pb-20 md:pb-32 pt-20 grain-overlay overflow-hidden">
      {/* Background Image — less dark, more energy */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=85&fit=crop')`,
          }}
          role="img"
          aria-label="Elite MMA fighters training in a cinematic gym setting"
        />
        {/* Warm gradient — shows more of the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b] via-[#0d0c0b]/55 to-[#0d0c0b]/10" />
        {/* Left-side vignette for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c0b]/80 via-transparent to-transparent" />
        {/* Orange atmospheric glow bottom-left */}
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at bottom left, rgba(255,87,26,0.12) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Diagonal accent line — top right */}
      <div
        className="absolute top-24 right-0 w-px h-64 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,87,26,0.4), transparent)' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 md:px-16">

        {/* Eyebrow tag */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-6 h-px bg-[#ff571a]" />
          <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.18em] uppercase text-[#ff571a]">
            MMA · MUAY THAI · BOXING · BJJ
          </p>
        </div>

        {/* Headline — massive, impactful */}
        <h1 className="font-[family-name:var(--font-outfit)] font-extrabold text-[#f0ede8] leading-[0.92] tracking-[-0.04em] mb-8 uppercase">
          <span className="block text-[clamp(56px,10vw,110px)]">REVIVE</span>
          <span
            className="block text-[clamp(56px,10vw,110px)]"
            style={{ WebkitTextStroke: '2px rgba(255,87,26,0.6)', color: 'transparent' }}
          >
            FIGHT
          </span>
          <span className="block text-[clamp(56px,10vw,110px)] text-[#ff571a]">CLUB</span>
        </h1>

        {/* Subtext with left accent bar */}
        <p className="font-[family-name:var(--font-inter)] text-lg leading-[1.7] text-[#c8bfb8] max-w-xl accent-bar pl-6 mb-10">
          Elite combat sports training in the heart of Frazer Town, Bengaluru.
          Precision. Discipline. Transformation.
        </p>

        {/* Social Proof bar */}
        <div className="flex items-center gap-4 mb-12 flex-wrap">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} className="w-4 h-4 fill-[#f5a623]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span className="font-[family-name:var(--font-inter)] text-sm font-black text-[#f0ede8] ml-1">5.0</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <span className="font-[family-name:var(--font-inter)] text-sm text-[#a09890]">
            126+ Verified Athlete Reviews
          </span>
          <div className="w-px h-4 bg-white/20" />
          <span className="font-[family-name:var(--font-inter)] text-sm text-[#a09890]">
            Frazer Town, Bengaluru
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/book-trial"
            className="inline-flex items-center justify-center gap-2 bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-black tracking-[0.12em] uppercase px-10 py-5 hover:bg-white transition-all duration-300 active:scale-95 orange-glow-sm"
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
              className="inline-flex items-center justify-center gap-2 bg-white/8 backdrop-blur-sm border border-white/15 text-[#f0ede8] font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.12em] uppercase px-10 py-5 hover:bg-white/15 hover:border-white/30 transition-all duration-300 active:scale-95"
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
              className="inline-flex items-center justify-center gap-2 bg-white/8 backdrop-blur-sm border border-white/15 text-[#f0ede8] font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.12em] uppercase px-10 py-5 hover:bg-white/15 transition-all duration-300 active:scale-95"
            >
              CONTACT US
            </Link>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex items-center gap-3 opacity-40">
          <div className="w-px h-8 bg-[#ff571a]" />
          <span className="font-[family-name:var(--font-inter)] text-xs tracking-[0.2em] uppercase text-[#f0ede8]">Scroll to explore</span>
        </div>
      </div>
    </section>
  )
}
