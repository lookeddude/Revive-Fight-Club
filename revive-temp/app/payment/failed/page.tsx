import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Payment Failed | Revive Fight Club',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ type?: string }>
}

export default async function PaymentFailedPage({ searchParams }: PageProps) {
  const params = await searchParams
  const type = params.type ?? 'payment'

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen pt-14 md:pt-20" style={{ backgroundColor: '#0d0c0b' }}>
        <section className="py-20 md:py-32">
          <div className="max-w-[480px] mx-auto px-5 md:px-8 text-center">

            {/* Failure icon */}
            <div className="flex justify-center mb-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            <p className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.2em] uppercase text-red-400 mb-3">
              Payment Not Completed
            </p>
            <h1
              className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-tight mb-4"
              style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
            >
              Something Went Wrong
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[#9ca3af] text-sm leading-relaxed mb-10">
              Your payment was not completed. No amount has been charged.
              Please try again or contact us if you continue to face issues.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href={type === 'trial' ? '/book-trial' : '/membership'}
                className="inline-flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.1em] px-6 py-4 bg-[#ff571a] text-black hover:bg-[#e04d17] transition-colors"
              >
                Try Again
              </Link>
              <a
                href="https://wa.me/919606972238?text=Hi%20Revive%20Fight%20Club%2C%20I%20had%20an%20issue%20with%20my%20payment."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.1em] px-6 py-3 border border-[#25d366]/30 text-[#25d366] hover:bg-[#25d366]/10 transition-colors"
              >
                WhatsApp Support
              </a>
              <Link
                href="/"
                className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] hover:text-[#9ca3af] transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
