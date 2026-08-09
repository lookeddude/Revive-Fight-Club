import type { ReviewCard } from '@/lib/data/content'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`} role="img">
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
    <section
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0908 0%, #0d0c0b 100%)' }}
    >
      {/* Top separator */}
      <div className="sep-orange" aria-hidden="true" />

      {/* Warm atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,87,26,0.06) 0%, transparent 55%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <p className="section-label" style={{ color: '#f5a623' }}>
              <span style={{ background: '#f5a623', display: 'inline-block', width: '28px', height: '1px', marginRight: '12px', verticalAlign: 'middle' }} aria-hidden="true" />
              Athlete Testimonials
            </p>
            <h2
              className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(34px, 5vw, 56px)' }}
            >
              WHAT OUR{' '}<br className="hidden md:block" />
              <span className="text-[#ff571a]">ATHLETES SAY</span>
            </h2>
          </div>

          {/* Rating block */}
          <div
            className="flex items-center gap-5 self-start md:self-auto p-5"
            style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)' }}
          >
            <div>
              <div className="flex gap-0.5 mb-1">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-5 h-5 fill-[#f5a623]" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#7a6e68] tracking-[0.15em] uppercase">Google Reviews</p>
            </div>
            <div className="pl-5" style={{ borderLeft: '1px solid rgba(245,166,35,0.2)' }}>
              <p className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8]" style={{ fontSize: '40px', lineHeight: 1, letterSpacing: '-0.05em' }}>5.0</p>
              <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#7a6e68] tracking-[0.1em] uppercase">Rating</p>
            </div>
          </div>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <div
              key={review.id}
              className="review-card-premium p-8 pt-12 flex flex-col gap-5"
              style={{
                background: i === 1
                  ? 'linear-gradient(135deg, rgba(255,87,26,0.07) 0%, rgba(22,20,18,0.95) 100%)'
                  : 'rgba(20,18,16,0.8)',
                border: i === 1 ? '1px solid rgba(255,87,26,0.2)' : '1px solid rgba(255,240,230,0.07)',
              }}
            >
              <StarRating rating={review.rating} />

              <p className="font-[family-name:var(--font-inter)] text-[15px] leading-[1.9] text-[#9ca3a0] flex-1 italic">
                &ldquo;{review.review_text}&rdquo;
              </p>

              <div className="pt-5 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-black text-black"
                  style={{ background: i === 1 ? 'linear-gradient(135deg, #ff571a, #e03020)' : 'linear-gradient(135deg, #3a3530, #2a2622)' }}
                >
                  <span className={i === 1 ? 'text-black' : 'text-[#8a7e76]'}>
                    {review.reviewer_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-sm font-bold text-[#e8e4df]">
                    {review.reviewer_name}
                  </p>
                  {review.reviewer_role && (
                    <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#5a5249] tracking-[0.1em] uppercase">
                      {review.reviewer_role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom separator */}
      <div className="sep-subtle mt-16" aria-hidden="true" />
    </section>
  )
}
