import Link from 'next/link'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'

interface HomeCTAProps {
  whatsappNumber?: string | null
}

export function HomeCTA({ whatsappNumber }: HomeCTAProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface)]">
      {/* Top line separator */}
      <div className="absolute top-0 left-0 right-0 sep-orange" aria-hidden="true" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16 py-16 md:py-28 text-center">
        {/* Section label */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-px bg-[#ff571a]" aria-hidden="true" />
          <p className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.22em] uppercase text-[#ff571a]">
            Take the first step
          </p>
          <div className="w-12 h-px bg-[#ff571a]" aria-hidden="true" />
        </div>

        {/* Headline */}
        <h2
          className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.9] tracking-[-0.04em] mb-8 max-w-4xl mx-auto"
          style={{ fontSize: 'clamp(42px, 8vw, 90px)' }}
        >
          READY TO{' '}
          <br className="hidden sm:block" />
          <span className="text-[#ff571a]">TRANSFORM</span>{' '}
          <br className="hidden sm:block" />
          YOUR PERFORMANCE?
        </h2>

        <p className="font-[family-name:var(--font-body)] text-lg leading-relaxed text-[#9ca3af] max-w-lg mx-auto mb-12">
          Book your trial class and experience what elite combat sports training truly feels like.
          First session is on us.
        </p>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-8 mb-14 flex-wrap">
          {[
            { icon: '⚡', label: 'No Experience Needed' },
            { icon: '★', label: 'Free First Trial' },
            { icon: '✓', label: 'Expert Coaches' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <span className="text-[#ff571a] text-base" aria-hidden="true">{icon}</span>
              <span className="font-[family-name:var(--font-body)] text-sm text-[#8a7e76] tracking-[0.1em] uppercase font-bold">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/book-trial"
            className="inline-flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 transition-colors duration-200 active:scale-95 bg-[var(--color-primary)] text-black hover:bg-[var(--color-primary-hover)]"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            BOOK TRIAL
          </Link>
          <WhatsAppCTA
            whatsappNumber={whatsappNumber ?? null}
            context="general"
            variant="secondary"
            label="WHATSAPP US"
            className="justify-center"
          />
        </div>
      </div>
    </section>
  )
}
