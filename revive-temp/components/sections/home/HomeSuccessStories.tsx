import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Customer Success Stories — bento-grid layout with real AI-generated member photos.
 * Featured story (2/3 width) + 2 small cards + full-width bottom quote.
 */

const STORIES = [
  {
    id: 'featured',
    name: 'Sneha Rajan',
    tag: 'Beginner → Boxing Fighter',
    image: '/stories/member-priya.jpg',
    quote:
      'Six months ago I couldn\'t throw a proper punch. Walking into Revive was the most intimidating thing I\'d done — but the coaches made me feel at home from day one. Now I spar regularly, I\'ve lost 8 kg, and I\'ve genuinely fallen in love with boxing. It changed not just my body but my entire mindset.',
  },
  {
    id: 'card2',
    name: 'Aditya Nair',
    tag: 'MMA Trainee, 8 months',
    image: '/stories/member-rahul.jpg',
    quote:
      'I used to think MMA was only for professional fighters. Revive showed me otherwise. Within weeks I was learning real techniques. The coaches are patient, disciplined, and genuinely invested in your progress. Best decision I\'ve made for my health and confidence.',
  },
  {
    id: 'card3',
    name: 'Meera Krishnan',
    tag: 'Kids Batch — Aarav, age 9',
    image: '/stories/member-kids.jpg',
    quote:
      'My son Aarav has transformed completely. He\'s more focused, less distracted, and so much more confident at school. The instructors are amazing with kids — firm but incredibly patient. We\'ve seen results we didn\'t expect this quickly.',
  },
  {
    id: 'wide',
    name: 'Vikram Shetty',
    tag: 'Kickboxing & Conditioning, 1 year',
    image: '/stories/member-karthik.jpg',
    quote:
      'It\'s not just a gym — it\'s a community. Every session I walk out feeling like a better version of myself. The energy here is unlike anything I\'ve experienced. Coaches push you beyond what you think you\'re capable of, and the members around you push you even further. Revive Fight Club is the best thing that happened to me this year.',
  },
]

function QuoteIcon({ color }: { color: string }) {
  return (
    <svg className="w-7 h-7 mb-3 opacity-50" viewBox="0 0 32 32" fill={color} aria-hidden>
      <path d="M10 8C6.134 8 3 11.134 3 15v9h9V15H6c0-2.206 1.794-4 4-4V8zm16 0c-3.866 0-7 3.134-7 7v9h9V15h-6c0-2.206 1.794-4 4-4V8z" />
    </svg>
  )
}

function MemberTag({ name, tag, accent }: { name: string; tag: string; accent: string }) {
  return (
    <div className="flex items-center gap-3 mt-6">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-[family-name:var(--font-outfit)] font-black text-xs"
        style={{ background: `${accent}20`, border: `1px solid ${accent}40`, color: accent }}
      >
        {name[0]}
      </div>
      <div>
        <p className="font-[family-name:var(--font-outfit)] font-bold text-[#f0ede8] text-sm uppercase tracking-wide leading-none">
          {name}
        </p>
        <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.15em] font-bold mt-0.5" style={{ color: accent }}>
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
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(255,87,26,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-[1280px] mx-auto px-5 md:px-16">
        {/* Header */}
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
              className="flex-shrink-0 inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-xs font-black tracking-[0.14em] uppercase px-6 py-3 transition-colors duration-200 hover:bg-[#ff571a] hover:text-black"
              style={{ border: '1px solid rgba(255,87,26,0.3)', color: '#ff571a' }}
            >
              All Stories
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Reveal>

        {/* Top bento grid: featured (2/3) + 2 stacked cards (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-5">

          {/* Featured large card */}
          <Reveal className="lg:col-span-2" delay={0}>
            <div
              className="h-full overflow-hidden"
              style={{ background: 'linear-gradient(145deg, #131211, #0f0d0c)', border: '1px solid rgba(255,87,26,0.2)' }}
            >
              {/* Photo */}
              <div className="relative w-full h-64 md:h-80">
                <Image
                  src={STORIES[0].image}
                  alt={STORIES[0].name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #131211 0%, transparent 50%)' }} />
              </div>
              {/* Content */}
              <div className="p-6 md:p-8">
                <QuoteIcon color="#ff571a" />
                <p
                  className="font-[family-name:var(--font-body)] text-[#d4d1cd] leading-relaxed"
                  style={{ fontSize: 'clamp(14px, 1.8vw, 17px)' }}
                >
                  "{STORIES[0].quote}"
                </p>
                <MemberTag name={STORIES[0].name} tag={STORIES[0].tag} accent="#ff571a" />
              </div>
            </div>
          </Reveal>

          {/* Right column: 2 small cards */}
          <div className="flex flex-col gap-4 md:gap-5">
            {[STORIES[1], STORIES[2]].map((story, i) => (
              <Reveal key={story.id} delay={(i + 1) * 100}>
                <div
                  className="overflow-hidden"
                  style={{ background: 'linear-gradient(145deg, #111010, #0d0c0b)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {/* Photo */}
                  <div className="relative w-full h-44">
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111010 0%, transparent 50%)' }} />
                  </div>
                  {/* Content */}
                  <div className="p-5">
                    <QuoteIcon color="#f5a623" />
                    <p className="font-[family-name:var(--font-body)] text-sm text-[#9ca3af] leading-relaxed line-clamp-4">
                      "{story.quote}"
                    </p>
                    <MemberTag name={story.name} tag={story.tag} accent="#f5a623" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Bottom wide card */}
        <Reveal delay={200}>
          <div
            className="overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #161210, #110f0e)', border: '1px solid rgba(255,87,26,0.12)' }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Photo — left on desktop */}
              <div className="relative w-full md:w-72 flex-shrink-0 h-56 md:h-auto">
                <Image
                  src={STORIES[3].image}
                  alt={STORIES[3].name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(to top, #161210 0%, transparent 50%)' }} />
              </div>
              {/* Content */}
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <QuoteIcon color="#ff571a" />
                <p
                  className="font-[family-name:var(--font-body)] text-[#c0bfbd] leading-relaxed italic"
                  style={{ fontSize: 'clamp(14px, 1.8vw, 18px)' }}
                >
                  "{STORIES[3].quote}"
                </p>
                <MemberTag name={STORIES[3].name} tag={STORIES[3].tag} accent="#ff571a" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bottom CTA */}
        <Reveal delay={280}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
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
