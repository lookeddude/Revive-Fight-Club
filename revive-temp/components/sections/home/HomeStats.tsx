const stats = [
  { value: '5.0', label: 'Google Rating', icon: 'star' },
  { value: '126+', label: 'Verified Reviews', icon: 'verified' },
  { value: '8+', label: 'Programs Offered', icon: 'fitness_center' },
  { value: '15+', label: 'Years Experience', icon: 'emoji_events' },
]

export function HomeStats() {
  return (
    <section className="py-12 border-t border-b border-white/10 bg-[#121413]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group border border-white/10 p-6 flex flex-col gap-1 hover:border-[#ff571a]/50 transition-all duration-300 cursor-default"
            >
              <span className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-3xl md:text-4xl leading-tight group-hover:text-[#ff571a] transition-colors duration-300">
                {stat.value}
              </span>
              <span className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1]/60">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
