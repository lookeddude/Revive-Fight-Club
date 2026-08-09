export function HomePhilosophy() {
  return (
    <section
      className="py-14 md:py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0d0c0b 0%, #111210 50%, #0d0c0b 100%)' }}
    >
      {/* Background radial warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 75% 50%, rgba(255,87,26,0.05) 0%, transparent 55%)' }}
        aria-hidden="true"
      />
      {/* Subtle dot grid */}
      <div className="absolute inset-0 bg-dots-subtle opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">

          {/* Left: Headline + pillars */}
          <div className="md:col-span-5 relative">
            {/* RFC watermark */}
            <div
              className="absolute -top-8 -left-4 font-[family-name:var(--font-outfit)] font-black leading-none select-none pointer-events-none watermark-text"
              style={{ fontSize: 'clamp(100px, 14vw, 180px)', letterSpacing: '-0.05em' }}
              aria-hidden="true"
            >
              RFC
            </div>

            <div className="relative z-10">
              <p className="section-label mb-6">Our Philosophy</p>

              <h2
                className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.04em] mb-10"
                style={{ fontSize: 'clamp(38px, 5.5vw, 62px)' }}
              >
                WHERE{' '}
                <span className="text-[#ff571a]">PERFORMANCE</span>{' '}
                MEETS{' '}
                DISCIPLINE
              </h2>

              {/* Three pillars */}
              <div className="flex flex-col gap-5">
                {[
                  { num: '01', label: 'Technical Mastery' },
                  { num: '02', label: 'Physical Conditioning' },
                  { num: '03', label: 'Mental Resilience' },
                ].map(({ num, label }, i) => (
                  <div key={label} className="flex items-center gap-4 group cursor-default">
                    <span
                      className="font-[family-name:var(--font-outfit)] font-black text-[#ff571a] text-xl w-8 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ opacity: 1 - i * 0.2 }}
                    >
                      {num}
                    </span>
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(255,87,26,0.2), transparent)' }} aria-hidden="true" />
                    <span className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.12em] uppercase text-[#c8bfb8] group-hover:text-[#f0ede8] transition-colors">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Body text + quote */}
          <div className="md:col-span-7">
            <div className="relative pl-8" style={{ borderLeft: '2px solid rgba(255,87,26,0.25)' }}>
              {/* Orange top accent on border */}
              <div
                className="absolute top-0 left-0 w-0.5 h-20"
                style={{ background: 'linear-gradient(to bottom, #ff571a, rgba(255,87,26,0.1))' }}
                aria-hidden="true"
              />

              <p className="font-[family-name:var(--font-inter)] leading-[1.9] text-[#8a8079] mb-6" style={{ fontSize: 'clamp(16px, 1.5vw, 20px)' }}>
                We reject the superficial. Revive Fight Club is built on the foundations of{' '}
                <strong className="text-[#c8bfb8] font-semibold">technical mastery</strong>,{' '}
                <strong className="text-[#c8bfb8] font-semibold">physical conditioning</strong>, and{' '}
                <strong className="text-[#c8bfb8] font-semibold">mental resilience</strong>.
              </p>

              <p className="font-[family-name:var(--font-inter)] text-base leading-[1.85] text-[#5a5249] mb-10">
                Our facility is a sanctuary for those dedicated to the craft of combat sports and elite
                fitness. Every session, every round, every rep — it all counts here.
              </p>

              {/* Quote callout */}
              <div
                className="p-6 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,87,26,0.06) 0%, rgba(255,87,26,0.02) 100%)',
                  border: '1px solid rgba(255,87,26,0.15)',
                }}
              >
                {/* Large quote mark */}
                <div
                  className="absolute -top-2 right-4 font-[family-name:var(--font-outfit)] font-black text-[80px] leading-none text-[#ff571a] opacity-15 select-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </div>
                <p className="font-[family-name:var(--font-outfit)] font-bold text-[#e8e4df] text-lg uppercase tracking-tight leading-snug relative z-10">
                  Train like a fighter.{' '}
                  <span className="text-[#ff571a]">Perform</span> like a champion.
                </p>
                <p className="font-[family-name:var(--font-inter)] text-xs text-[#5a5249] mt-2 tracking-[0.12em] uppercase">
                  — Revive Fight Club
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
