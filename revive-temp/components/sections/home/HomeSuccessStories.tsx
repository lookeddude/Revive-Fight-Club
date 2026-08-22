import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Customer Success Stories — redesigned layout.
 * 3-column grid: big portrait left, 2 smaller portraits right.
 * Full-width bottom story card with side-by-side photo + quote.
 * RFC-branded images, face-centred, proper portrait aspect ratios.
 */

const STORIES = [
  {
    id: 'featured',
    name: 'Sneha Rajan',
    tag: 'Beginner → Boxing Fighter',
    image: '/stories/rfc_member_sneha.jpg',
    quote:
      'Six months ago I couldn\'t throw a proper punch. Walking into Revive was the most intimidating thing I\'d done — but the coaches made me feel at home from day one. Now I spar regularly, I\'ve lost 8 kg, and I\'ve genuinely fallen in love with boxing. It changed not just my body but my entire mindset.',
    accent: '#ff571a',
  },
  {
    id: 'card2',
    name: 'Aditya Nair',
    tag: 'MMA Trainee, 8 months',
    image: '/stories/rfc_member_aditya.jpg',
    quote:
      'I used to think MMA was only for professionals. Revive showed me otherwise. Within weeks I was learning real techniques — the coaches are patient, disciplined and genuinely invested in your growth.',
    accent: '#f5a623',
  },
  {
    id: 'card3',
    name: 'Meera K. — for son Aarav',
    tag: 'Kids Batch, Age 9',
    image: '/stories/rfc_member_meera_kid.jpg',
    quote:
      'My son Aarav has transformed completely — more focused, more disciplined, more confident at school. The coaches at RFC are firm yet incredibly patient with kids. We\'re so glad we enrolled.',
    accent: '#f5a623',
  },
  {
    id: 'wide',
    name: 'Vikram Shetty',
    tag: 'Kickboxing & Conditioning, 1 year',
    image: '/stories/rfc_member_vikram.jpg',
    quote:
      'It\'s not just a gym — it\'s a community. Every session I walk out feeling like a better version of myself. The energy here is unlike anything I\'ve experienced. Coaches push you beyond what you think you\'re capable of, and the members around you push you even further. Revive Fight Club is the best thing that happened to me this year.',
    accent: '#ff571a',
  },
]

function QuoteIcon({ color }: { color: string }) {
  return (
    <svg className="w-6 h-6 mb-3 flex-shrink-0" viewBox="0 0 32 32" fill={color} aria-hidden style={{ opacity: 0.7 }}>
      <path d="M10 8C6.134 8 3 11.134 3 15v9h9V15H6c0-2.206 1.794-4 4-4V8zm16 0c-3.866 0-7 3.134-7 7v9h9V15h-6c0-2.206 1.794-4 4-4V8z" />
    </svg>
  )
}

function MemberTag({ name, tag, accent }: { name: string; tag: string; accent: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-[family-name:var(--font-outfit)] font-black text-xs"
        style={{ background: `${accent}22`, border: `1px solid ${accent}44`, color: accent }}
      >
        {name[0]}
      </div>
      <div>
        <p className="font-[family-name:var(--font-outfit)] font-bold text-[#f0ede8] text-sm uppercase tracking-wide leading-none">
          {name}
        </p>
        <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.14em] font-bold mt-0.5" style={{ color: accent }}>
          {tag}
        </p>
      </div>
    </div>
  )
}

export function HomeSuccessStories() {
  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ background: '#080706', borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,87,26,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-[1280px] mx-auto px-5 md:px-16">

        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
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
              href="/reviews"
              className="flex-shrink-0 inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-xs font-black tracking-[0.14em] uppercase px-6 py-3 transition-all duration-200 hover:bg-[#ff571a] hover:text-black"
              style={{ border: '1px solid rgba(255,87,26,0.35)', color: '#ff571a' }}
            >
              All Stories
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Reveal>

        {/* ── TOP GRID: big left + 2 stacked right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">

          {/* FEATURED — 3/5 width, tall portrait */}
          <Reveal className="lg:col-span-3" delay={0}>
            <div
              className="relative overflow-hidden group"
              style={{
                background: '#131211',
                border: '1px solid rgba(255,87,26,0.2)',
              }}
            >
              {/* Portrait image — full height, centred on face */}
              <div className="relative" style={{ aspectRatio: '4/5' }}>
                <Image
                  src={STORIES[0].image}
                  alt={STORIES[0].name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                {/* Gradient from bottom — only lower 40% */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(13,12,11,0.98) 0%, rgba(13,12,11,0.5) 35%, transparent 55%)' }}
                />
              </div>
              {/* Quote overlay at bottom */}
              <div className="p-6 md:p-8 -mt-2">
                <QuoteIcon color="#ff571a" />
                <p className="font-[family-name:var(--font-body)] text-[#d4d0cc] leading-relaxed mb-5" style={{ fontSize: 'clamp(13px, 1.5vw, 16px)' }}>
                  "{STORIES[0].quote}"
                </p>
                <MemberTag name={STORIES[0].name} tag={STORIES[0].tag} accent="#ff571a" />
              </div>
            </div>
          </Reveal>

          {/* Right column — 2/5 width, 2 cards stacked */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {[STORIES[1], STORIES[2]].map((story, i) => (
              <Reveal key={story.id} delay={(i + 1) * 120}>
                <div
                  className="relative overflow-hidden"
                  style={{ background: '#0f0e0d', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  {/* Portrait image */}
                  <div className="relative" style={{ aspectRatio: '4/3' }}>
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(15,14,13,0.98) 0%, rgba(15,14,13,0.4) 40%, transparent 60%)' }}
                    />
                  </div>
                  <div className="p-5">
                    <QuoteIcon color={story.accent} />
                    <p className="font-[family-name:var(--font-body)] text-sm text-[#9ca3af] leading-relaxed mb-4 line-clamp-3">
                      "{story.quote}"
                    </p>
                    <MemberTag name={story.name} tag={story.tag} accent={story.accent} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── BOTTOM WIDE CARD: photo left + big quote right ── */}
        <Reveal delay={200}>
          <div
            className="overflow-hidden"
            style={{ background: '#0d0c0b', border: '1px solid rgba(255,87,26,0.14)' }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Photo — fixed width on desktop, square on mobile */}
              <div className="relative flex-shrink-0 md:w-80" style={{ aspectRatio: '1/1' }}>
                <Image
                  src={STORIES[3].image}
                  alt={STORIES[3].name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
                {/* Right-fade on desktop, bottom-fade on mobile */}
                <div
                  className="absolute inset-0 hidden md:block"
                  style={{ background: 'linear-gradient(to right, transparent 60%, #0d0c0b 100%)' }}
                />
                <div
                  className="absolute inset-0 block md:hidden"
                  style={{ background: 'linear-gradient(to top, #0d0c0b 0%, transparent 60%)' }}
                />
              </div>

              {/* Quote content */}
              <div className="flex-1 flex flex-col justify-center p-7 md:p-10">
                <QuoteIcon color="#ff571a" />
                <p
                  className="font-[family-name:var(--font-body)] text-[#c4c1be] leading-relaxed mb-6"
                  style={{ fontSize: 'clamp(14px, 1.6vw, 18px)' }}
                >
                  "{STORIES[3].quote}"
                </p>
                <MemberTag name={STORIES[3].name} tag={STORIES[3].tag} accent="#ff571a" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={280}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280]">
              Ready to write your own story?
            </p>
            <Link
              href="/book-trial"
              className="font-[family-name:var(--font-body)] text-sm font-black tracking-[0.12em] uppercase text-[#ff571a] hover:text-white transition-colors underline underline-offset-4 decoration-[#ff571a]/30"
            >
              Book a Trial →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
