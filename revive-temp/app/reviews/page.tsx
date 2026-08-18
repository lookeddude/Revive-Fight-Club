import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getPublishedReviews } from '@/lib/data/content'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Member Reviews | Revive Fight Club',
  description: 'Read what our members say about training at Revive Fight Club — Bengaluru\'s elite combat gym. Real reviews from real athletes.',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-4 h-4 fill-current ${i <= rating ? 'text-[#f5a623]' : 'text-white/10'}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default async function ReviewsPage() {
  const reviews = await getPublishedReviews(100)

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0'

  const googleCount = reviews.filter(r => r.source === 'google').length

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen pt-14 md:pt-20" style={{ background: '#0d0c0b' }}>

        {/* Breadcrumb */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-6">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-[#9ca3af] hover:text-[#ff571a] transition-colors font-[family-name:var(--font-body)]">Home</Link>
            <span className="text-[#3a3530]">/</span>
            <span className="text-[#f0ede8] font-[family-name:var(--font-body)] font-semibold">Reviews</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="max-w-[1280px] mx-auto px-5 md:px-16 pb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-10">
            <div>
              <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.18em] uppercase mb-3" style={{ color: '#f5a623' }}>
                <span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#f5a623', marginRight: '10px', verticalAlign: 'middle' }} />
                Member Reviews
              </p>
              <h1
                className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}
              >
                WHAT OUR{' '}
                <span style={{ color: '#ff571a' }}>ATHLETES</span>
                <br />SAY ABOUT US
              </h1>
            </div>

            {/* Stats */}
            <div className="flex gap-4 flex-wrap">
              <div className="px-6 py-4 text-center" style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)' }}>
                <p className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8]" style={{ fontSize: '40px', lineHeight: 1, letterSpacing: '-0.05em' }}>{avgRating}</p>
                <div className="flex justify-center gap-0.5 my-1">
                  {[1,2,3,4,5].map(i => <svg key={i} className="w-3.5 h-3.5 fill-[#f5a623]" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>)}
                </div>
                <p className="font-[family-name:var(--font-body)] text-xs text-[#c8c4bf]  uppercase">Average Rating</p>
              </div>
              <div className="px-6 py-4 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8]" style={{ fontSize: '40px', lineHeight: 1, letterSpacing: '-0.05em' }}>{reviews.length}</p>
                <p className="font-[family-name:var(--font-body)] text-xs text-[#c8c4bf]  uppercase mt-2">Total Reviews</p>
              </div>
              <div className="px-6 py-4 text-center" style={{ background: 'rgba(66,133,244,0.05)', border: '1px solid rgba(66,133,244,0.15)' }}>
                <p className="font-[family-name:var(--font-outfit)] font-black text-[#4285f4]" style={{ fontSize: '40px', lineHeight: 1, letterSpacing: '-0.05em' }}>{googleCount}</p>
                <p className="font-[family-name:var(--font-body)] text-xs text-[#c8c4bf]  uppercase mt-2">Google Reviews</p>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          {reviews.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-[family-name:var(--font-body)] text-[#3a3530] text-sm uppercase ">No reviews yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {reviews.map((review, i) => {
                const isAccent = i % 3 === 1
                return (
                  <div
                    key={review.id}
                    className="flex flex-col gap-3 p-5 relative overflow-hidden"
                    style={{
                      background: isAccent
                        ? 'linear-gradient(135deg, rgba(255,87,26,0.07) 0%, rgba(16,14,12,0.98) 100%)'
                        : 'rgba(15,13,11,0.9)',
                      border: isAccent ? '1px solid rgba(255,87,26,0.2)' : '1px solid rgba(255,255,255,0.05)',
                      borderTop: isAccent ? '2px solid #ff571a' : '2px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {/* Decorative quote */}
                    <span
                      className="absolute -top-1 right-3 font-[family-name:var(--font-outfit)] font-black select-none pointer-events-none"
                      style={{ fontSize: '52px', lineHeight: 1, color: isAccent ? 'rgba(255,87,26,0.12)' : 'rgba(255,255,255,0.04)' }}
                      aria-hidden="true"
                    >&ldquo;</span>

                    {/* Stars + source */}
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
                    <p className="font-[family-name:var(--font-body)] text-[13px] leading-[1.75] text-[#8a8480] flex-1">
                      &ldquo;{review.review_text}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-2.5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div
                        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-black text-sm"
                        style={{
                          background: isAccent ? 'linear-gradient(135deg, #ff571a, #c02010)' : 'linear-gradient(135deg, #2e2b28, #1e1c1a)',
                          color: isAccent ? '#fff' : '#9ca3af',
                        }}
                      >
                        {(review.reviewer_name ?? 'M').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-body)] text-[12px] font-bold text-[#d8d4cf] leading-tight">
                          {review.reviewer_name}
                        </p>
                        {review.reviewer_role && (
                          <p className="font-[family-name:var(--font-body)] text-xs text-[#4a4541] tracking-[0.12em] uppercase mt-0.5">
                            {review.reviewer_role}
                          </p>
                        )}
                        {review.review_date && (() => {
                          const d = new Date(review.review_date!)
                          return isNaN(d.getTime()) ? null : (
                            <p className="font-[family-name:var(--font-body)] text-xs text-[#3a3835] mt-0.5">
                              {d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                            </p>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="max-w-[1280px] mx-auto px-5 md:px-16 text-center">
            <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.18em] uppercase text-[#ff571a] mb-3">Join the Community</p>
            <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase text-3xl md:text-5xl leading-tight tracking-tight mb-6">
              BECOME OUR NEXT<br /><span className="text-[#ff571a]">SUCCESS STORY</span>
            </h2>
            <Link
              href="/book-trial"
              className="inline-flex items-center gap-2 text-black font-[family-name:var(--font-body)] text-sm font-black tracking-[0.14em] uppercase px-8 py-4 transition-all duration-300 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #ff571a, #e03020)', boxShadow: '0 4px 20px rgba(255,87,26,0.35)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              BOOK TRIAL
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
