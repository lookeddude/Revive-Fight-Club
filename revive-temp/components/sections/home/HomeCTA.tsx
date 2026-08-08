import Link from 'next/link'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'

interface HomeCTAProps {
  whatsappNumber?: string | null
}

export function HomeCTA({ whatsappNumber }: HomeCTAProps) {
  return (
    <section className="relative overflow-hidden grain-overlay" style={{ background: 'linear-gradient(135deg, #1a0d06 0%, #0d0c0b 40%, #160a04 100%)' }}>
      {/* Orange glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(255,87,26,0.18) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Diagonal lines decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,87,26,0.4), transparent)' }} />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${(i + 1) * 16}%`,
              background: 'linear-gradient(to bottom, transparent, rgba(255,87,26,0.04), transparent)',
              transform: 'skewX(-12deg)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16 py-28 text-center">

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-px bg-[#ff571a]" />
          <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.2em] uppercase text-[#ff571a]">
            Take the first step
          </p>
          <div className="w-12 h-px bg-[#ff571a]" />
        </div>

        {/* Headline */}
        <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.04em] text-[clamp(40px,7vw,84px)] mb-8 max-w-4xl mx-auto">
          READY TO<br />
          <span className="text-[#ff571a]">TRANSFORM</span><br />
          YOUR PERFORMANCE?
        </h2>

        <p className="font-[family-name:var(--font-inter)] text-lg leading-relaxed text-[#8a7e76] max-w-xl mx-auto mb-12">
          Book your trial class and experience what elite combat sports training truly feels like. First session is on us.
        </p>

        {/* Badges */}
        <div className="flex items-center justify-center gap-6 mb-12 flex-wrap">
          {['No Experience Needed', 'Free First Trial', 'Expert Coaches'].map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#ff571a]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-[family-name:var(--font-inter)] text-sm text-[#a09890] tracking-[0.08em] uppercase font-bold">
                {badge}
              </span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/book-trial"
            className="inline-flex items-center justify-center gap-2 bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-black tracking-[0.12em] uppercase px-12 py-5 hover:bg-white transition-all duration-300 active:scale-95 orange-glow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            BOOK FREE TRIAL
          </Link>
          <WhatsAppCTA
            whatsappNumber={whatsappNumber ?? null}
            context="general"
            variant="secondary"
            label="WHATSAPP US"
            className="justify-center border-white/15 hover:border-white/30"
          />
        </div>
      </div>
    </section>
  )
}
