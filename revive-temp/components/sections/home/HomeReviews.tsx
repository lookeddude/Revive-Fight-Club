import type { ReviewCard } from '@/lib/data/content'
import { Reveal } from '@/components/ui/Reveal'

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


      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16">

        {/* Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10 mb-10">
            <div>
              <p className="section-label" style={{ color: '#f5a623' }}>
                <span style={{ background: '#f5a623', display: 'inline-block', width: '28px', height: '1px', marginRight: '12px', verticalAlign: 'middle' }} aria-hidden="true" />
                Athlete Testimonials
              </p>
              <h2
                className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-[0.92] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(34px, 5vw, 56px)' }}
              >
                WHAT OUR{' '}<br className="hidden md:block" />
                <span className="text-[#ff571a]">ATHLETES SAY</span>
            </h2>
          </div>
          <div
            className="flex items-center gap-5 self-start p-4"
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
              <p className="font-[family-name:var(--font-body)] text-xs text-[#A0A0A8]  uppercase">Google Reviews</p>
            </div>
            <div className="pl-4" style={{ borderLeft: '1px solid rgba(245,166,35,0.2)' }}>
              <p className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD]" style={{ fontSize: '36px', lineHeight: 1, letterSpacing: '-0.05em' }}>5.0</p>
              <p className="font-[family-name:var(--font-body)] text-xs text-[#A0A0A8] tracking-[0.1em] uppercase">Rating</p>
            </div>
          </div>
        </div>
        </Reveal>

        {/* Cards */}
        <Reveal delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reviews.map((review) => {
              return (
              <div
                key={review.id}
                className="flex flex-col gap-3 p-4 relative group transition-all duration-300"
                style={{
                  background: 'var(--color-surface-container)',
                  border: '1px solid var(--color-surface-container-high)',
                }}
              >
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
                <p className="font-[family-name:var(--font-body)] text-[12px] leading-[1.7] text-[var(--color-on-background)] flex-1">
                  &ldquo;{review.review_text}&rdquo;
                </p>

                {/* Author row */}
                <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid var(--color-outline-variant)' }}>
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xs"
                    style={{
                      background: 'var(--color-surface-container-highest)',
                      color: 'var(--color-on-surface)',
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
        </Reveal>
      </div>

      <div className="sep-subtle mt-14" aria-hidden="true" />
    </section>
  )
}
