import Link from 'next/link'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'
import { Reveal } from '@/components/ui/Reveal'

interface HomeCTAProps {
  whatsappNumber?: string | null
}

export function HomeCTA({ whatsappNumber }: HomeCTAProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#121116', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="relative z-10 max-w-[1320px] mx-auto px-5 md:px-12 py-20 md:py-32 text-center">

        {/* Eyebrow */}
        <Reveal>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-10 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} aria-hidden="true" />
            <p className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.22em] uppercase text-[#707078]">
              Take the first step
            </p>
            <div className="w-10 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} aria-hidden="true" />
          </div>
        </Reveal>

        {/* Headline */}
        <Reveal delay={80}>
          <h2
            className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-[0.9] tracking-[-0.04em] mb-6 max-w-4xl mx-auto"
            style={{ fontSize: 'clamp(42px, 8vw, 100px)' }}
          >
            START TRAINING{' '}
            <br className="hidden sm:block" />
            AT REVIVE{' '}
            <br className="hidden sm:block" />
            <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(252,253,253,0.3)' }}>
              FIGHT CLUB
            </span>
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <p className="font-[family-name:var(--font-body)] text-base leading-relaxed text-[#707078] max-w-lg mx-auto mb-12">
            Book a trial class at our Fraser Town gym. No experience needed — just show up and train.
          </p>
        </Reveal>

        {/* Trust badges */}
        <Reveal delay={240}>
          <div className="flex items-center justify-center gap-8 mb-14 flex-wrap">
            {[
              { label: 'No Experience Needed' },
              { label: 'Book First Class' },
              { label: 'Expert Coaches' },
            ].map(({ label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-white/25 flex-shrink-0" aria-hidden="true" />
                <span className="font-[family-name:var(--font-body)] text-xs text-[#707078] tracking-[0.14em] uppercase font-bold">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={320}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book-trial"
              className="inline-flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-10 py-4 bg-[#FCFDFD] text-[#0E0C10] hover:bg-white hover:-translate-y-[2px] transition-all duration-200 active:scale-95"
            >
              BOOK A TRIAL
            </Link>
            <WhatsAppCTA
              whatsappNumber={whatsappNumber ?? null}
              context="general"
              variant="secondary"
              label="WHATSAPP US"
              className="justify-center"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
