const stats = [
  { value: '5.0', label: 'Google Rating', suffix: '★' },
  { value: '126', label: 'Verified Reviews', suffix: '+' },
  { value: '8', label: 'Programs', suffix: '+' },
  { value: '15', label: 'Years Experience', suffix: '+' },
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
            <div
              key={stat.label}
              className="group relative flex flex-col items-center justify-center py-10 px-6 cursor-default"
            >
              {/* Vertical divider */}
              {i < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-14"
                  style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,87,26,0.15), transparent)' }}
                  aria-hidden="true"
                />
              )}

              {/* Number */}
              <div className="flex items-start gap-0.5 mb-3">
                <span
                  className="stat-number text-[clamp(52px,7vw,80px)] group-hover:text-[#ff571a] transition-colors duration-500"
                  style={{ textShadow: 'none' }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-[family-name:var(--font-outfit)] font-black text-[#ff571a] mt-2"
                  style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}
                >
                  {stat.suffix}
                </span>
              </div>

              {/* Label */}
              <span className="font-[family-name:var(--font-inter)] text-[11px] font-bold tracking-[0.18em] uppercase text-[#6b6059] group-hover:text-[#9ca3a0] transition-colors duration-300">
                {stat.label}
              </span>

              {/* Hover bottom accent */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#ff571a] group-hover:w-16 transition-all duration-500" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom separator */}
      <div className="sep-subtle" aria-hidden="true" />
    </section>
  )
}
