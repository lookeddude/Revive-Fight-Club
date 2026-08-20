import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getPublishedReviews } from '@/lib/data/content'
import { GsapHeroReveal } from '@/components/gsap/GsapHeroReveal'
import { GsapStagger } from '@/components/gsap/GsapStagger'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Member Reviews | Revive Fight Club',
  description: "Read what our members say about training at Revive Fight Club in Fraser Town, Bengaluru — Bengaluru's elite combat gym. Real reviews from real athletes.",
  alternates: {
    canonical: 'https://revivefightclub.com/reviews',
  },
  openGraph: {
    url: 'https://revivefightclub.com/reviews',
  },
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
        <GsapHeroReveal>
        <section className="max-w-[1280px] mx-auto px-5 md:px-16 pb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-10">
            <div>
              <p className="gsap-label font-[family-name:var(--font-body)] text-xs font-black tracking-[0.18em] uppercase mb-3" style={{ color: '#f5a623' }}>
                <span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#f5a623', marginRight: '10px', verticalAlign: 'middle' }} />
                Member Reviews
              </p>
              <h1
                className="gsap-heading font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}
              >
                WHAT OUR{' '}
                <span style={{ color: '#ff571a' }}>ATHLETES</span>
                <br />SAY ABOUT US
              </h1>
            </div>

            {/* Stats */}
            <div className="flex gap-4 flex-wrap gsap-extra">
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
        </section>
        </GsapHeroReveal>

        {/* Reviews Grid */}
        <section className="max-w-[1280px] mx-auto px-5 md:px-16 pb-16">
          {reviews.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-[family-name:var(--font-body)] text-[#3a3530] text-sm uppercase ">No reviews yet</p>
            </div>
          ) : (
            <GsapStagger stagger={0.05} selector=".review-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {reviews.map((review, i) => {
                const isAccent = i % 3 === 1
                return (
                  <div
                    key={review.id}
                    className="review-card flex flex-col gap-3 p-5 relative overflow-hidden"
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
            </GsapStagger>
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

        {/* Google Review CTA */}
        <section
          className="py-14 md:py-16"
          style={{ background: '#080706', borderTop: '1px solid rgba(245,166,35,0.08)' }}
        >
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div
              className="flex flex-col md:flex-row md:items-center gap-8 p-8 md:p-10"
              style={{ background: 'rgba(245,166,35,0.03)', border: '1px solid rgba(245,166,35,0.1)' }}
            >
              {/* Stars */}
              <div className="flex-shrink-0 text-center px-6">
                <div className="flex justify-center gap-1 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-6 h-6 fill-[#f5a623]" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="font-[family-name:var(--font-outfit)] font-black text-[#f5a623] text-4xl leading-none">5.0</p>
                <p className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] uppercase mt-1">Google Rating</p>
              </div>

              {/* Text + CTA */}
              <div className="flex-1">
                <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.22em] uppercase text-[#f5a623] mb-3">Share Your Experience</p>
                <h3 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-tight tracking-tight mb-3" style={{ fontSize: 'clamp(18px, 2.5vw, 28px)' }}>
                  TRAINED WITH US?<br /><span className="text-[#f5a623]">LEAVE AN HONEST REVIEW</span>
                </h3>
                <p className="font-[family-name:var(--font-body)] text-sm text-[#9ca3af] leading-relaxed mb-5 max-w-lg">
                  If you have trained at Revive Fight Club and would like to share your honest experience, we would really appreciate a Google review. It helps us grow and helps others find us.
                </p>
                <a
                  href="https://maps.app.goo.gl/HDkr8hrYK1Tuop7G6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-xs font-black tracking-[0.14em] uppercase px-6 py-3 text-black transition-all duration-300 hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #f5a623, #e09010)' }}
                  aria-label="Leave an honest Google review for Revive Fight Club"
                >
                  {/* Google icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Write a Google Review
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
