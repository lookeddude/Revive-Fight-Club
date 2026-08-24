'use client'

import { useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'

const FAQS = [
  {
    q: 'Is Revive Fight Club suitable for complete beginners?',
    a: 'Absolutely. We welcome complete beginners with zero experience. Our Beginners Batch is designed to teach fundamentals at a pace that works for you — our coaches will guide you every step of the way.',
  },
  {
    q: 'What combat sports can I train here?',
    a: 'We offer MMA, Boxing, Kickboxing, Muay Thai, Brazilian Jiu-Jitsu (BJJ), Wrestling, Judo, and more. We also have Strength & Conditioning, Weight Loss, Personal Training and Nutrition Guidance programs.',
  },
  {
    q: 'Where is Revive Fight Club located?',
    a: '3rd Floor, 157, MM Road, above Indian Overseas Bank, Fraser Town, Bengaluru, Karnataka 560005. Easily accessible by auto, cab or personal vehicle from anywhere in Bengaluru.',
  },
  {
    q: 'Do you have training programs for kids?',
    a: 'Yes! Our Kids Batch is designed for ages 6–15. We offer both weekday and weekend batches. Training builds discipline, confidence, fitness and basic self-defence skills in a safe, structured environment.',
  },
  {
    q: 'How do I get started?',
    a: "Book a trial class online or contact us on WhatsApp / phone (+91 96069 72238). No commitment required — just come in, try a class and see if it's right for you.",
  },
  {
    q: 'Can I join just for fitness without doing combat sports?',
    a: 'Yes. We offer dedicated Strength & Conditioning, Weight Loss and Personal Training programs for members focused purely on fitness goals rather than combat sports.',
  },
  {
    q: 'What are the membership plans and pricing?',
    a: 'We offer flexible Monthly, Quarterly, Semiannual and Yearly plans for Beginners, Fighters and Kids batches. Beginners start at ₹6,500/month. Visit our Membership page for detailed pricing.',
  },
  {
    q: 'What should I bring for my first class?',
    a: 'Wear comfortable workout clothes, bring a water bottle and a small towel. No special equipment is needed for your first session — we provide everything you need to get started.',
  },
]

/**
 * Homepage FAQ section with interactive accordion.
 * Includes FAQPage JSON-LD for Google rich results.
 */
export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      className="py-16 md:py-24 relative"
      style={{ background: '#0E0C10', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      aria-labelledby="home-faq-heading"
    >
      {/* FAQPage JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map(({ q, a }) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          }),
        }}
      />

      <div className="max-w-[1320px] mx-auto px-5 md:px-12">
        {/* Header */}
        <Reveal>
          <div className="mb-12 md:mb-16">
            <p className="section-label">Got Questions?</p>
            <h2
              id="home-faq-heading"
              className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-[0.92] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(32px, 5.5vw, 64px)' }}
            >
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>
        </Reveal>

        {/* Accordion */}
        <div className="max-w-3xl">
          {FAQS.map(({ q, a }, i) => {
            const isOpen = openIndex === i

            return (
              <Reveal key={i} delay={i * 40}>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-start justify-between gap-4 py-5 md:py-6 text-left group"
                    aria-expanded={isOpen}
                  >
                    <h3
                      className="font-[family-name:var(--font-outfit)] font-bold uppercase tracking-tight leading-snug transition-colors duration-200"
                      style={{
                        color: isOpen ? '#FCFDFD' : '#A0A0A8',
                        fontSize: 'clamp(14px, 1.8vw, 17px)',
                      }}
                    >
                      {q}
                    </h3>

                    {/* Toggle icon */}
                    <div
                      className="flex-shrink-0 w-7 h-7 flex items-center justify-center mt-0.5 transition-all duration-200"
                      style={{
                        border: isOpen ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.08)',
                        background: isOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
                      }}
                    >
                      <svg
                        className="w-3.5 h-3.5 transition-transform duration-300"
                        style={{
                          color: isOpen ? '#FCFDFD' : '#707078',
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>

                  {/* Answer */}
                  <div
                    className="overflow-hidden transition-all duration-300 ease-out"
                    style={{
                      maxHeight: isOpen ? '200px' : '0px',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <p className="font-[family-name:var(--font-body)] text-[14px] text-[#707078] leading-relaxed pb-5 md:pb-6 pr-12">
                      {a}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
