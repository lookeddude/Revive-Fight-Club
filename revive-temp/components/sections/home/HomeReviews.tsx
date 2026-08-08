import type { ReviewCard } from '@/lib/data/content'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 fill-current ${i <= rating ? 'text-[#f5a623]' : 'text-white/10'}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

interface HomeReviewsProps {
  reviews: ReviewCard[]
}

export function HomeReviews({ reviews }: HomeReviewsProps) {
  if (reviews.length === 0) return null

  return (
    <section className="py-24 section-divider relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0d0c0b 0%, #100d0b 100%)' }}>
      {/* Warm atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,87,26,0.05) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#f5a623]" />
              <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.18em] uppercase text-[#f5a623]">
                Athlete Testimonials
              </p>
            </div>
            <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.95] tracking-[-0.03em] text-[clamp(32px,4vw,52px)]">
              WHAT OUR<br />
              <span className="text-[#ff571a]">ATHLETES SAY</span>
            </h2>
          </div>

          {/* Rating badge */}
          <div className="flex items-center gap-4 self-start md:self-auto">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-5 h-5 fill-[#f5a623]" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="font-[family-name:var(--font-outfit)] font-black text-3xl text-[#f0ede8]">5.0</span>
              </div>
              <span className="font-[family-name:var(--font-inter)] text-xs text-[#7a6e68] tracking-[0.1em] uppercase">Google Reviews</span>
            </div>
          </div>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <div
              key={review.id}
              className="review-card relative border border-white/8 p-8 pt-10 flex flex-col gap-5 hover:border-[#ff571a]/25 transition-all duration-400"
              style={{
                background: i === 1
                  ? 'linear-gradient(135deg, rgba(255,87,26,0.06) 0%, rgba(255,87,26,0.02) 100%)'
                  : 'rgba(20,18,16,0.6)',
              }}
            >
              <StarRating rating={review.rating} />

              <p className="font-[family-name:var(--font-inter)] text-base leading-[1.85] text-[#a09890] flex-1 italic">
                &ldquo;{review.review_text}&rdquo;
              </p>

              <div className="border-t border-white/6 pt-5 flex items-center gap-3">
                {/* Avatar circle */}
                <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-black" style={{ background: 'linear-gradient(135deg, #ff571a, #e03020)' }}>
                  {review.reviewer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-sm font-bold text-[#f0ede8]">
                    {review.reviewer_name}
                  </p>
                  {review.reviewer_role && (
                    <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b6059] tracking-[0.08em] uppercase">
                      {review.reviewer_role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
