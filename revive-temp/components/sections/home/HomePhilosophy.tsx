export function HomePhilosophy() {
  return (
    <section className="py-24 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Heading */}
          <div className="md:col-span-5">
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase leading-tight tracking-[-0.02em] text-[clamp(32px,4vw,48px)]">
              WHERE PERFORMANCE
              <br />
              MEETS DISCIPLINE
            </h2>
          </div>

          {/* Divider */}
          <div className="hidden md:block md:col-span-1">
            <div className="w-px h-24 bg-white/10 mx-auto" />
          </div>

          {/* Right: Body text */}
          <div className="md:col-span-6">
            <p className="font-[family-name:var(--font-inter)] text-lg leading-[1.6] text-[#bab8b7]">
              We reject the superficial. Revive Fight Club is built on the foundations of technical
              mastery, physical conditioning, and mental resilience. Our facility is a sanctuary for
              those dedicated to the craft of combat sports and elite fitness.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
