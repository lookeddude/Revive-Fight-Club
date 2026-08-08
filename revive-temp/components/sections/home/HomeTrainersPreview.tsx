import Link from 'next/link'

const trainers = [
  {
    slug: 'marcus-vance',
    name: 'MARCUS VANCE',
    role: 'Head Striking Coach',
    bio: 'Former professional kickboxer with over 15 years of competitive experience. Marcus emphasizes technical fluidity and devastating power.',
    disciplines: ['Muay Thai', 'Kickboxing'],
    image:
      'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&q=80&fit=crop',
    alt: 'Cinematic portrait of a male MMA coach in a dark urban gym with dramatic lighting',
    imageRight: false,
  },
  {
    slug: 'elena-rostova',
    name: 'ELENA ROSTOVA',
    role: 'Grappling Specialist',
    bio: 'A BJJ black belt known for her analytical approach to ground control. Elena\'s methodology focuses on leverage, timing, and positional dominance.',
    disciplines: ['BJJ', 'Wrestling'],
    image:
      'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=800&q=80&fit=crop',
    alt: 'Cinematic portrait of a female BJJ coach in a premium dark training facility',
    imageRight: true,
  },
]

export function HomeTrainersPreview() {
  return (
    <section className="py-24 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <div>
            <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-3">
              Coaching Staff
            </p>
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase leading-tight tracking-[-0.02em] text-[clamp(32px,4vw,48px)]">
              MEET THE COACHES
            </h2>
          </div>
          <Link
            href="/trainers"
            className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase text-[#ff571a] hover:text-white transition-colors flex items-center gap-2 self-start md:self-auto"
          >
            VIEW ALL TRAINERS
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="square" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Trainer Cards — Editorial Layout */}
        <div className="flex flex-col gap-6">
          {trainers.map((trainer) => (
            <Link
              key={trainer.slug}
              href={`/trainers/${trainer.slug}`}
              className="group grid grid-cols-1 md:grid-cols-12 gap-6 border border-white/10 p-2 hover:border-white/20 transition-colors relative"
              aria-label={`View ${trainer.name} profile`}
            >
              {/* Image — left or right depending on trainer */}
              <div
                className={`md:col-span-7 h-[400px] md:h-[500px] overflow-hidden relative ${
                  trainer.imageRight ? 'md:order-2' : 'md:order-1'
                }`}
              >
                <div
                  className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  style={{ backgroundImage: `url('${trainer.image}')` }}
                  role="img"
                  aria-label={trainer.alt}
                />
                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121413] to-transparent opacity-80" />
              </div>

              {/* Content */}
              <div
                className={`md:col-span-5 flex flex-col justify-end p-4 md:p-6 ${
                  trainer.imageRight ? 'md:order-1' : 'md:order-2'
                }`}
              >
                <span className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ff571a] mb-2 block">
                  {trainer.role}
                </span>
                <h3 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-3xl md:text-4xl leading-tight mb-4">
                  {trainer.name}
                </h3>
                <p className="font-[family-name:var(--font-inter)] text-base leading-relaxed text-[#bab8b7] mb-6">
                  {trainer.bio}
                </p>
                <div className="flex gap-3 flex-wrap">
                  {trainer.disciplines.map((d) => (
                    <span
                      key={d}
                      className="border border-white/10 px-3 py-1 font-[family-name:var(--font-inter)] text-xs font-medium text-[#e2e3e1]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
