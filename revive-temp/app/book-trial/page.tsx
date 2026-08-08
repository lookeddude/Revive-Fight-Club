import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BookTrialForm } from '@/components/forms/BookTrialForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Trial Class | Revive Fight Club',
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

              <BookTrialForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
