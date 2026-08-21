import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Customer Success Stories — bento-grid layout like vigoure.in/customer-stories.
 * Featured story on left, supporting cards on right, full-width quote at bottom.
 * Scroll-reveal animations. Links to /stories for more.
 */

const STORIES = [
  {
    id: 'featured',
    name: 'Priya M.',
    tag: 'Beginner → Confident Fighter',
    quote:
      'I walked into Revive Fight Club with zero experience and a lot of hesitation. The coaches didn\'t just teach me — they welcomed me like family. With their patience and guidance, I gained confidence with every session. The transformation hasn\'t just been physical — it\'s completely changed the way I see myself.',
    size: 'large',
  },
  {
    id: 'card2',
    name: 'Rahul S.',
    tag: 'Weight Loss Journey',
    quote:
      'After long days at work, stepping into Revive has become my therapy. I arrive drained, but every session revives me. In 4 months I dropped 12 kg and gained something I never expected — a fighting spirit.',
    size: 'small',
  },
  {
    id: 'card3',
    name: 'Ananya K.',
    tag: 'Kids Batch Parent',
    quote:
      'My 9-year-old joined the Kids Batch and the change is incredible. She\'s more focused, disciplined, and confident at school. The coaches make every session safe and fun — I can\'t recommend it enough.',
    size: 'small',
  },
  {
    id: 'wide',
    name: 'Karthik R.',
    tag: 'MMA Fighter, 1 year',
    quote:
      'It\'s not just the workouts — it\'s the people. From my very first class, I felt the energy of the group, the encouragement from the coaches, and the genuine support of everyone training beside me. There\'s something special about sweating, struggling and succeeding together. Revive Fight Club isn\'t just a gym — it\'s a second home.',
    size: 'wide',
  },
]

function QuoteIcon({ color }: { color: string }) {
  return (
    <svg className="w-8 h-8 mb-4 opacity-60" viewBox="0 0 32 32" fill={color} aria-hidden>
      <path d="M10 8C6.134 8 3 11.134 3 15v9h9V15H6c0-2.206 1.794-4 4-4V8zm16 0c-3.866 0-7 3.134-7 7v9h9V15h-6c0-2.206 1.794-4 4-4V8z" />
    </svg>
  )
}

export function HomeSuccessStories() {
  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ background: '#080706', borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(255,87,26,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-[1280px] mx-auto px-5 md:px-16">
        {/* Section header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-[#ff571a]" />
                <p className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.22em] uppercase text-[#ff571a]">
                  Member Stories
                </p>
              </div>
              <h2
                className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(32px, 6vw, 60px)' }}
              >
                REAL PEOPLE.<br />
                <span style={{ color: '#ff571a' }}>REAL RESULTS.</span>
              </h2>
            </div>
            <Link
              href="/stories"
              className="flex-shrink-0 inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-xs font-black tracking-[0.14em] uppercase px-6 py-3 border transition-colors duration-200"
              style={{ border: '1px solid rgba(255,87,26,0.3)', color: '#ff571a' }}
            >
              All Stories
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Reveal>

        {/* Bento grid — top row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-5">

          {/* FEATURED — large left card (2 cols) */}
          <Reveal className="lg:col-span-2" delay={0}>
            <div
              className="h-full p-7 md:p-10 flex flex-col justify-between min-h-[280px]"
              style={{
                background: 'linear-gradient(145deg, #131211, #0f0d0c)',
                border: '1px solid rgba(255,87,26,0.2)',
              }}
            >
              <div>
                <QuoteIcon color="#ff571a" />
                <p
                  className="font-[family-name:var(--font-body)] text-[#d4d1cd] leading-relaxed"
                  style={{ fontSize: 'clamp(15px, 2vw, 19px)' }}
                >
                  "{STORIES[0].quote}"
                </p>
              </div>
              <div className="flex items-center gap-3 mt-7">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,87,26,0.15)', border: '1px solid rgba(255,87,26,0.3)' }}
                >
                  <span className="font-[family-name:var(--font-outfit)] font-black text-[#ff571a] text-xs">
                    {STORIES[0].name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-outfit)] font-bold text-[#f0ede8] text-sm uppercase tracking-wide">
                    {STORIES[0].name}
                  </p>
                  <p className="font-[family-name:var(--font-body)] text-[10px] text-[#ff571a] uppercase tracking-[0.15em] font-bold">
                    {STORIES[0].tag}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right col — 2 small cards stacked */}
          <div className="flex flex-col gap-4 md:gap-5">
            {[STORIES[1], STORIES[2]].map((story, i) => (
              <Reveal key={story.id} delay={(i + 1) * 100}>
                <div
                  className="p-6 flex flex-col justify-between h-full"
                  style={{
                    background: 'linear-gradient(145deg, #111010, #0d0c0b)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div>
                    <QuoteIcon color="#f5a623" />
                    <p className="font-[family-name:var(--font-body)] text-sm text-[#9ca3af] leading-relaxed">
                      "{story.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 mt-5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.25)' }}
                    >
                      <span className="font-[family-name:var(--font-outfit)] font-black text-[#f5a623] text-[10px]">
                        {story.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-outfit)] font-bold text-[#f0ede8] text-xs uppercase tracking-wide">
                        {story.name}
                      </p>
                      <p className="font-[family-name:var(--font-body)] text-[9px] text-[#f5a623] uppercase tracking-[0.15em] font-bold">
                        {story.tag}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Bottom wide quote card */}
        <Reveal delay={200}>
          <div
            className="p-7 md:p-10 flex flex-col md:flex-row md:items-center gap-6"
            style={{
              background: 'linear-gradient(135deg, #161210, #110f0e)',
              border: '1px solid rgba(255,87,26,0.12)',
            }}
          >
            <QuoteIcon color="#ff571a" />
            <div className="flex-1">
              <p
                className="font-[family-name:var(--font-body)] text-[#c0bfbd] leading-relaxed italic"
                style={{ fontSize: 'clamp(14px, 1.8vw, 17px)' }}
              >
                "{STORIES[3].quote}"
              </p>
            </div>
            <div className="flex items-center gap-3 md:flex-shrink-0 md:flex-col md:items-end md:text-right">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,87,26,0.12)', border: '1px solid rgba(255,87,26,0.25)' }}
              >
                <span className="font-[family-name:var(--font-outfit)] font-black text-[#ff571a] text-sm">
                  {STORIES[3].name[0]}
                </span>
              </div>
              <div>
                <p className="font-[family-name:var(--font-outfit)] font-bold text-[#f0ede8] text-sm uppercase tracking-wide">
                  {STORIES[3].name}
                </p>
                <p className="font-[family-name:var(--font-body)] text-[10px] text-[#ff571a] uppercase tracking-[0.15em] font-bold">
                  {STORIES[3].tag}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bottom CTA strip */}
        <Reveal delay={280}>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280]">
              Ready to write your own story?
            </p>
            <Link
              href="/book-trial"
              className="font-[family-name:var(--font-body)] text-sm font-black tracking-[0.12em] uppercase text-[#ff571a] hover:text-white transition-colors underline underline-offset-4 decoration-[#ff571a]/30"
            >
              Book a free trial →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
 
