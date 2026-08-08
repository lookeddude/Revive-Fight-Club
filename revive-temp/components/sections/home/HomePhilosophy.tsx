export function HomePhilosophy() {
  return (
    <section className="py-24 section-divider relative overflow-hidden">
      {/* Background warm gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 80% 50%, rgba(255,87,26,0.04) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">

          {/* Left: Giant background text + heading */}
          <div className="md:col-span-6 relative">
            {/* Watermark text */}
            <div
              className="absolute -top-6 -left-4 font-[family-name:var(--font-outfit)] font-black text-[120px] md:text-[160px] leading-none select-none pointer-events-none"
              style={{
                color: 'transparent',
                WebkitTextStroke: '1px rgba(255,87,26,0.06)',
                letterSpacing: '-0.05em',
              }}
              aria-hidden="true"
            >
              RFC
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-[#ff571a]" />
                <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.18em] uppercase text-[#ff571a]">
                  Our Philosophy
                </p>
              </div>

              <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.95] tracking-[-0.03em] text-[clamp(36px,5vw,56px)] mb-8">
                WHERE PERFORMANCE<br />
                <span className="text-[#ff571a]">MEETS</span><br />
                DISCIPLINE
              </h2>

              {/* Three pillars */}
              <div className="flex flex-col gap-4">
                {['Technical Mastery', 'Physical Conditioning', 'Mental Resilience'].map((pillar, i) => (
                  <div key={pillar} className="flex items-center gap-4">
                    <span
                      className="font-[family-name:var(--font-outfit)] font-black text-[#ff571a] text-lg w-6 text-center"
                      style={{ opacity: 1 - i * 0.2 }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 h-px bg-white/8" />
                    <span className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase text-[#c8bfb8]">
                      {pillar}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Body text + visual accent */}
          <div className="md:col-span-6">
            <div className="relative border-l-2 border-[#ff571a]/30 pl-8">
              <div
                className="absolute top-0 left-0 w-0.5 h-16"
                style={{ background: 'linear-gradient(to bottom, #ff571a, #e03020)' }}
              />

              <p className="font-[family-name:var(--font-inter)] text-xl leading-[1.75] text-[#a09890] mb-8">
                We reject the superficial. Revive Fight Club is built on the foundations of technical
                mastery, physical conditioning, and mental resilience.
              </p>

              <p className="font-[family-name:var(--font-inter)] text-base leading-[1.8] text-[#6b6059]">
                Our facility is a sanctuary for those dedicated to the craft of combat sports and elite
                fitness. Every session, every round, every rep — it all counts here.
              </p>

              {/* Gym callout */}
              <div className="mt-10 p-5 border border-white/8" style={{ background: 'rgba(255,87,26,0.04)' }}>
                <p className="font-[family-name:var(--font-outfit)] font-bold text-[#f0ede8] text-lg uppercase tracking-tight">
                  &ldquo;Train like a fighter. Perform like a champion.&rdquo;
                </p>
                <p className="font-[family-name:var(--font-inter)] text-xs text-[#7a6e68] mt-2 tracking-[0.1em] uppercase">
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
