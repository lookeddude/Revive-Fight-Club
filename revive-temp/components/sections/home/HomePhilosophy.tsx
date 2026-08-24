import { Reveal } from '@/components/ui/Reveal'

export function HomePhilosophy() {
  return (
    <section
      className="py-16 md:py-28 relative overflow-hidden"
      style={{ background: '#121116' }}
    >
      <div className="sep-white" aria-hidden="true" />

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 md:px-12 pt-16 md:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-14 md:gap-20 items-start">

          {/* Left: Headline + pillars */}
          <div className="md:col-span-5 relative">
            <Reveal direction="left">
              <div className="relative z-10">
                <p className="section-label mb-6">Our Philosophy</p>

                <h2
                  className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-[0.92] tracking-[-0.04em] mb-10"
                  style={{ fontSize: 'clamp(34px, 5vw, 60px)' }}
                >
                  TRAIN LIKE A FIGHTER.{' '}
                  <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(252,253,253,0.3)' }}>
                    THINK LIKE A CHAMPION.
                  </span>
                </h2>

                {/* Three pillars */}
                <div className="flex flex-col gap-4">
                  {[
                    { num: '01', label: 'Technical Mastery' },
                    { num: '02', label: 'Physical Conditioning' },
                    { num: '03', label: 'Mental Resilience' },
                  ].map(({ num, label }, i) => (
                    <div key={label} className="flex items-center gap-4 group cursor-default">
                      <span
                        className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] text-lg w-8 flex-shrink-0"
                        style={{ opacity: 0.15 + i * 0.05 }}
                      >
                        {num}
                      </span>
                      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} aria-hidden="true" />
                      <span className="font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.12em] uppercase text-[#707078] group-hover:text-[#FCFDFD] transition-colors">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Body text + quote */}
          <Reveal delay={180} direction="up" className="md:col-span-7">
            <div className="relative pl-8" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Top highlight on border */}
              <div
                className="absolute top-0 left-0 w-px h-16"
                style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)' }}
                aria-hidden="true"
              />

              <p className="font-[family-name:var(--font-body)] leading-[1.9] text-[#A0A0A8] mb-6" style={{ fontSize: 'clamp(16px, 1.4vw, 19px)' }}>
                We reject the superficial. Revive Fight Club is built on the foundations of{' '}
                <strong className="text-[#FCFDFD] font-semibold">technical mastery</strong>,{' '}
                <strong className="text-[#FCFDFD] font-semibold">physical conditioning</strong>, and{' '}
                <strong className="text-[#FCFDFD] font-semibold">mental resilience</strong>.
              </p>

              <p className="font-[family-name:var(--font-body)] text-[15px] leading-[1.85] text-[#707078] mb-10">
                Our facility in Fraser Town, Bengaluru is built for those serious about combat sports and
                fitness — MMA, Boxing, Kickboxing, Muay Thai and more. Every session, every round,
                every rep counts here.
              </p>

              {/* Quote callout */}
              <div
                className="p-6 relative"
                style={{
                  background: '#19181E',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {/* Large quote mark */}
                <div
                  className="absolute -top-3 left-5 font-[family-name:var(--font-outfit)] font-black text-[64px] leading-none select-none"
                  style={{ color: '#C8963E', opacity: 0.3 }}
                  aria-hidden="true"
                >
                  &ldquo;
                </div>
                <p className="font-[family-name:var(--font-outfit)] font-bold text-[#FCFDFD] text-lg tracking-tight leading-snug relative z-10">
                  Train like a fighter.{' '}
                  <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(252,253,253,0.4)' }}>Perform</span>{' '}
                  like a champion.
                </p>
                <p className="font-[family-name:var(--font-body)] text-[11px] text-[#707078] mt-2 tracking-[0.16em] uppercase">
                  — Revive Fight Club
                </p>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}
