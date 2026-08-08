import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Trial Class',
  description: 'Book your trial class at Revive Fight Club and experience elite MMA training in Bengaluru.',
}

export default function BookTrialPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <section className="py-24">
          <div className="max-w-[1280px] mx-auto px-5 md:px-16">
            <div className="max-w-2xl">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase text-[#c8c6c5] hover:text-[#e2e3e1] transition-colors mb-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                RETURN TO SITE
              </Link>

              <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-4">
                First Step
              </p>
              <h1 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] uppercase leading-tight tracking-[-0.02em] text-[clamp(32px,4vw,48px)] mb-4">
                BOOK A TRIAL CLASS
              </h1>
              <p className="font-[family-name:var(--font-inter)] text-lg text-[#bab8b7] mb-12 leading-relaxed">
                Fill in your details and our team will get back to you within 24 hours to confirm
                your first session.
              </p>

              {/* Form */}
              <form className="flex flex-col gap-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-3"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      className="input-underline w-full py-3 text-[#e2e3e1] placeholder-white/20 font-[family-name:var(--font-inter)] text-base"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-3"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 00000 00000"
                      className="input-underline w-full py-3 text-[#e2e3e1] placeholder-white/20 font-[family-name:var(--font-inter)] text-base"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-3"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="input-underline w-full py-3 text-[#e2e3e1] placeholder-white/20 font-[family-name:var(--font-inter)] text-base"
                      required
                    />
                  </div>

                  {/* Discipline */}
                  <div>
                    <label
                      htmlFor="discipline"
                      className="block font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-3"
                    >
                      Interested In
                    </label>
                    <select
                      id="discipline"
                      className="input-underline w-full py-3 text-[#e2e3e1] font-[family-name:var(--font-inter)] text-base appearance-none"
                    >
                      <option value="" className="bg-[#1e201f]">Select a discipline</option>
                      <option value="mma" className="bg-[#1e201f]">MMA</option>
                      <option value="muay-thai" className="bg-[#1e201f]">Muay Thai</option>
                      <option value="bjj" className="bg-[#1e201f]">Brazilian Jiu-Jitsu</option>
                      <option value="strength" className="bg-[#1e201f]">Strength & Conditioning</option>
                      <option value="not-sure" className="bg-[#1e201f]">Not sure yet</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-3"
                  >
                    Anything else? (optional)
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    placeholder="Any experience level, injuries, goals..."
                    className="input-underline w-full py-3 text-[#e2e3e1] placeholder-white/20 font-[family-name:var(--font-inter)] text-base resize-none"
                  />
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300 active:scale-95"
                  >
                    BOOK MY TRIAL CLASS
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
