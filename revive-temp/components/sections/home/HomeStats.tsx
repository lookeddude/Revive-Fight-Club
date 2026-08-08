const stats = [
  { value: '5.0', label: 'Google Rating', suffix: '★' },
  { value: '126', label: 'Verified Reviews', suffix: '+' },
  { value: '8', label: 'Programs', suffix: '+' },
  { value: '15', label: 'Years Experience', suffix: '+' },
]

export function HomeStats() {
  return (
    <section className="relative py-0 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1410 0%, #0d0c0b 50%, #160e09 100%)' }}>
      {/* Orange top border */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, #ff571a, #e03020, transparent)' }} />

      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="group relative flex flex-col items-center justify-center py-10 px-6 cursor-default"
            >
              {/* Vertical divider between items */}
              {i < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-white/8" />
              )}

              {/* Number */}
              <div className="flex items-start gap-0.5 mb-2">
                <span
                  className="font-[family-name:var(--font-outfit)] font-black text-[clamp(44px,6vw,72px)] leading-none text-[#f0ede8] group-hover:text-[#ff571a] transition-colors duration-400 stat-glow"
                  style={{ letterSpacing: '-0.04em' }}
                >
                  {stat.value}
                </span>
                <span className="font-[family-name:var(--font-outfit)] font-black text-2xl md:text-3xl text-[#ff571a] mt-2">
                  {stat.suffix}
                </span>
              </div>

              {/* Label */}
              <span className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.15em] uppercase text-[#7a6e68] group-hover:text-[#a09890] transition-colors duration-300">
                {stat.label}
              </span>

              {/* Hover bottom accent */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#ff571a] group-hover:w-12 transition-all duration-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Orange bottom border */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, rgba(255,87,26,0.3), transparent)' }} />
    </section>
  )
}
