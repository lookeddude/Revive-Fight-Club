import { Reveal } from '@/components/ui/Reveal'
import { GsapCountUp } from '@/components/gsap/GsapCountUp'

const stats = [
  { target: 500,  decimals: 0, label: 'Active Members',   suffix: '+' },
  { target: 8,    decimals: 0, label: 'Programs',          suffix: '+' },
  { target: 5.0,  decimals: 1, label: 'Google Rating',     suffix: '★' },
  { target: 15,   decimals: 0, label: 'Years Experience',  suffix: '+' },
]

export function HomeStats() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#0E0C10' }}
    >
      {/* Top separator */}
      <div className="sep-white" aria-hidden="true" />

      <div className="max-w-[1320px] mx-auto px-5 md:px-12 py-14 md:py-18">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80} threshold={0.1}>
              <div className="relative flex flex-col items-center justify-center py-10 px-6">
                {/* Vertical divider */}
                {i < stats.length - 1 && (
                  <div
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12"
                    style={{ background: 'rgba(255,255,255,0.07)' }}
                    aria-hidden="true"
                  />
                )}

                {/* Number */}
                <div className="flex items-start gap-0.5 mb-2">
                  <GsapCountUp
                    target={stat.target}
                    decimals={stat.decimals}
                    duration={1.8}
                    className="stat-number text-[clamp(44px,6vw,72px)] text-[#FCFDFD]"
                  />
                  <span
                    className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] mt-1.5"
                    style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', opacity: 0.5 }}
                  >
                    {stat.suffix}
                  </span>
                </div>

                {/* Label */}
                <span className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.15em] text-[#707078]">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Bottom separator */}
      <div className="sep-white" aria-hidden="true" />
    </section>
  )
}
