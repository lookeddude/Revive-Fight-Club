import type { ReviewCard } from '@/lib/data/content'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3 h-3 fill-current ${i <= rating ? 'text-[#f5a623]' : 'text-white/10'}`}
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
  if (!reviews || reviews.length === 0) return null

  return (
    <section
      className="py-14 md:py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0908 0%, #0d0c0b 100%)' }}
    >
      <div className="sep-orange" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,87,26,0.06) 0%, transparent 55%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-10">
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
          <div
            className="flex items-center gap-5 self-start md:self-auto p-4"
            style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)' }}
          >
            <div>
              <div className="flex gap-0.5 mb-1">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-4 h-4 fill-[#f5a623]" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="font-[family-name:var(--font-body)] text-xs text-[#c8c4bf]  uppercase">Google Reviews</p>
            </div>
            <div className="pl-4" style={{ borderLeft: '1px solid rgba(245,166,35,0.2)' }}>
              <p className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8]" style={{ fontSize: '36px', lineHeight: 1, letterSpacing: '-0.05em' }}>5.0</p>
              <p className="font-[family-name:var(--font-body)] text-xs text-[#c8c4bf] tracking-[0.1em] uppercase">Rating</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reviews.map((review, i) => {
            const isAccent = i % 3 === 1
            return (
              <div
                key={review.id}
                className="flex flex-col gap-3 p-4 relative overflow-hidden group transition-all duration-300"
                style={{
                  background: isAccent
                    ? 'linear-gradient(135deg, rgba(255,87,26,0.08) 0%, rgba(16,14,12,0.98) 100%)'
                    : 'rgba(15,13,11,0.9)',
                  border: isAccent ? '1px solid rgba(255,87,26,0.2)' : '1px solid rgba(255,255,255,0.05)',
                  borderTop: isAccent ? '2px solid #ff571a' : '2px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Big decorative quote */}
                <span
                  className="absolute -top-1 right-3 font-[family-name:var(--font-outfit)] font-black select-none pointer-events-none"
                  style={{ fontSize: '44px', lineHeight: 1, color: isAccent ? 'rgba(255,87,26,0.15)' : 'rgba(255,255,255,0.04)' }}
                  aria-hidden="true"
                >&ldquo;</span>

                {/* Stars + badge */}
                <div className="flex items-center justify-between">
                  <StarRating rating={review.rating} />
                  <span
                    className="font-[family-name:var(--font-body)] text-[8px] font-black uppercase tracking-[0.18em] px-1.5 py-0.5"
                    style={{
                      background: review.source === 'google' ? 'rgba(66,133,244,0.1)' : 'rgba(255,87,26,0.12)',
                      color: review.source === 'google' ? '#5a9ff5' : '#ff571a',
                      border: review.source === 'google' ? '1px solid rgba(66,133,244,0.2)' : '1px solid rgba(255,87,26,0.25)',
                    }}
                  >
                    {review.source === 'google' ? 'Google' : 'Member'}
                  </span>
                </div>

                {/* Review text */}
                <p className="font-[family-name:var(--font-body)] text-[12px] leading-[1.7] text-[#c8c4bf] flex-1">
                  &ldquo;{review.review_text}&rdquo;
                </p>

                {/* Author row */}
                <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xs"
                    style={{
                      background: isAccent ? 'linear-gradient(135deg, #ff571a, #c02010)' : 'linear-gradient(135deg, #2a2825, #1a1816)',
                      color: isAccent ? '#fff' : '#5a5652',
                    }}
                  >
                    {(review.reviewer_name ?? 'M').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-body)] text-sm font-bold text-[#c8c4bf] leading-tight">
                      {review.reviewer_name}
                    </p>
                    {review.reviewer_role && (
                      <p className="font-[family-name:var(--font-body)] text-[8px] text-[#3a3835] tracking-[0.12em] uppercase mt-0.5">
                        {review.reviewer_role}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="sep-subtle mt-14" aria-hidden="true" />
    </section>
  )
}
