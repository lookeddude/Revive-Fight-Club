import Link from 'next/link'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'

interface HomeCTAProps {
  whatsappNumber?: string | null
}

export function HomeCTA({ whatsappNumber }: HomeCTAProps) {
  return (
    <section className="py-24 border-t border-white/10 bg-[#0d0f0e] relative overflow-hidden">
      {/* Kinetic radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at top right, rgba(255,87,26,0.06), transparent 60%), radial-gradient(circle at bottom left, rgba(255,87,26,0.03), transparent 50%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16 text-center">
        <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-4">
          Take the first step
        </p>
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase leading-tight tracking-[-0.02em] text-[clamp(36px,5vw,64px)] mb-6 max-w-3xl mx-auto">
          READY TO TRANSFORM YOUR PERFORMANCE?
        </h2>
        <p className="font-[family-name:var(--font-inter)] text-lg leading-relaxed text-[#bab8b7] max-w-xl mx-auto mb-10">
          Book your trial class and experience what elite combat sports training truly feels like.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/book-trial"
            className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300 active:scale-95"
          >
            BOOK A TRIAL
          </Link>
          {/* WhatsApp number sourced from Supabase business_settings — not hard-coded */}
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
