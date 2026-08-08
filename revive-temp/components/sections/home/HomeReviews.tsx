import Link from 'next/link'

const reviews = [
  {
    name: 'Rahul Sharma',
    rating: 5,
    text: 'The trainers here are world-class. My Muay Thai improved dramatically in just 3 months. The facility is immaculate and the culture is elite but welcoming.',
    role: 'Member since 2022',
  },
  {
    name: 'Priya Nair',
    rating: 5,
    text: 'Best BJJ coaching in Bengaluru, hands down. Elena is incredibly technical and patient. The curriculum is structured and progressive — not just sparring every session.',
    role: 'BJJ Purple Belt',
  },
  {
    name: 'Aditya Kumar',
    rating: 5,
    text: 'I came in completely new to combat sports. Within 6 months I was competing locally. The environment here is serious about development, not just attendance.',
    role: 'Competitive Athlete',
  },
]

export function HomeReviews() {
  return (
    <section className="py-24 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-3">
              Athlete Testimonials
            </p>
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase leading-tight tracking-[-0.02em] text-[clamp(28px,4vw,48px)]">
              WHAT OUR ATHLETES SAY
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-5 h-5 text-[#ff571a] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="font-[family-name:var(--font-inter)] text-sm font-bold text-[#e2e3e1]">
              5.0
            </span>
            <span className="text-[#c8c6c5] text-sm">Based on 126+ verified reviews</span>
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="border border-white/10 p-8 flex flex-col gap-4 hover:border-white/20 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 text-[#ff571a] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="font-[family-name:var(--font-inter)] text-base leading-relaxed text-[#bab8b7] flex-1">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Reviewer */}
              <div className="border-t border-white/5 pt-4">
                <p className="font-[family-name:var(--font-inter)] text-sm font-bold text-[#e2e3e1]">
                  {review.name}
                </p>
                <p className="font-[family-name:var(--font-inter)] text-xs text-[#c8c6c5]">
                  {review.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
