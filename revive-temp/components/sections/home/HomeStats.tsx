import { Reveal } from '@/components/ui/Reveal'
import { GsapCountUp } from '@/components/gsap/GsapCountUp'

const stats = [
  { target: 5.0, decimals: 1, label: 'Google Rating', suffix: '★' },
  { target: 126, decimals: 0, label: 'Verified Reviews', suffix: '+' },
  { target: 8,   decimals: 0, label: 'Programs', suffix: '+' },
  { target: 15,  decimals: 0, label: 'Years Experience', suffix: '+' },
]

export function HomeStats() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0908 0%, #0d0c0b 100%)' }}
    >
      {/* Top separator */}
      <div className="sep-orange" aria-hidden="true" />

      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90} threshold={0.1}>
              <div
                className="relative flex flex-col items-center justify-center py-10 px-6"
              >
                {/* Vertical divider */}
                {i < stats.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-14"
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,87,26,0.15), transparent)' }}
                    aria-hidden="true"
                  />
                )}

                {/* Number — GSAP count-up */}
                <div className="flex items-start gap-0.5 mb-3">
                  <GsapCountUp
                    target={stat.target}
                    decimals={stat.decimals}
                    duration={1.8}
                    className="stat-number text-[clamp(52px,7vw,80px)]"
                    style={{ textShadow: 'none' }}
                  />
                  <span
                    className="font-[family-name:var(--font-outfit)] font-black text-[#ff571a] mt-2"
                    style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}
                  >
                    {stat.suffix}
                  </span>
                </div>

                {/* Label */}
                <span className="font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.18em] uppercase text-[#9ca3af]">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Bottom separator */}
      <div className="sep-subtle" aria-hidden="true" />
    </section>
  )
}
