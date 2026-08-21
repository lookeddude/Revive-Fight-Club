import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata: Metadata = {
  title: 'Payment Confirmed | Revive Fight Club',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ type?: string; ref?: string }>
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { type, ref } = params

  // ── Fetch real status from DB — never trust URL params alone ─
  let paymentData: {
    customerName: string
    customerEmail: string
    amount: number
    paymentType: string
    referenceId: string
    planName?: string
    startDate?: string
    endDate?: string
    programName?: string
    preferredDate?: string | null
    preferredTime?: string | null
    status: string
  } | null = null

  if (ref) {
    try {
      const supabase = createAdminClient()
      const { data: payment } = await supabase
        .from('payments')
        .select('*')
        .eq('id', ref)
        .single()

      if (payment && payment.status === 'paid') {
        let planName = ''
        let startDate = ''
        let endDate = ''
        let programName = ''
        let preferredDate = null
        let preferredTime = null

        if (payment.payment_type === 'membership' && payment.reference_id) {
          const { data: purchase } = await supabase
            .from('member_purchases')
            .select('*, membership_plans(name, billing_period)')
            .eq('id', payment.reference_id)
            .single()
          if (purchase) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const plan = purchase.membership_plans as any
            planName = plan?.name ?? ''
            startDate = purchase.start_date ?? ''
            endDate = purchase.end_date ?? ''
          }
        }

        if (payment.payment_type === 'trial' && payment.reference_id) {
          const { data: trial } = await supabase
            .from('trial_requests')
            .select('*, programs(name)')
            .eq('id', payment.reference_id)
            .single()
          if (trial) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const program = trial.programs as any
            programName = program?.name ?? 'Trial Class'
            preferredDate = trial.preferred_date
            preferredTime = trial.preferred_time
          }
        }

        paymentData = {
          customerName: payment.customer_name,
          customerEmail: payment.customer_email,
          amount: payment.amount / 100,
          paymentType: payment.payment_type,
          referenceId: payment.id,
          planName,
          startDate,
          endDate,
          programName,
          preferredDate,
          preferredTime,
          status: payment.status,
        }
      }
    } catch (err) {
      console.error('[success-page]', err)
    }
  }

  const isMembership = type === 'membership' || paymentData?.paymentType === 'membership'

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen pt-14 md:pt-20" style={{ backgroundColor: '#0d0c0b' }}>
        <section className="py-20 md:py-32">
          <div className="max-w-[560px] mx-auto px-5 md:px-8">

            {paymentData ? (
              <>
                {/* Success icon */}
                <div className="flex justify-center mb-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}
                  >
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <div className="text-center mb-10">
                  <p className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.2em] uppercase text-green-500 mb-3">
                    Payment Confirmed
                  </p>
                  <h1
                    className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-tight"
                    style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
                  >
                    {isMembership ? 'Membership Activated!' : 'Trial Booking Confirmed!'}
                  </h1>
                  <p className="font-[family-name:var(--font-body)] text-[#9ca3af] mt-3 text-sm">
                    A confirmation email has been sent to {paymentData.customerEmail}
                  </p>
                </div>

                {/* Details card */}
                <div style={{ background: '#111210', border: '1px solid rgba(255,87,26,0.2)' }} className="p-6 mb-6">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-3 font-[family-name:var(--font-body)] text-[#9ca3af]">Name</td>
                        <td className="py-3 font-[family-name:var(--font-body)] text-[#f0ede8] text-right">{paymentData.customerName}</td>
                      </tr>

                      {isMembership ? (
                        <>
                          <tr className="border-b border-white/[0.04]">
                            <td className="py-3 font-[family-name:var(--font-body)] text-[#9ca3af]">Plan</td>
                            <td className="py-3 font-[family-name:var(--font-body)] text-[#f0ede8] text-right font-bold">{paymentData.planName}</td>
                          </tr>
                          {paymentData.startDate && (
                            <tr className="border-b border-white/[0.04]">
                              <td className="py-3 font-[family-name:var(--font-body)] text-[#9ca3af]">Valid From</td>
                              <td className="py-3 font-[family-name:var(--font-body)] text-[#f0ede8] text-right">{paymentData.startDate}</td>
                            </tr>
                          )}
                          {paymentData.endDate && (
                            <tr className="border-b border-white/[0.04]">
                              <td className="py-3 font-[family-name:var(--font-body)] text-[#9ca3af]">Valid Until</td>
                              <td className="py-3 font-[family-name:var(--font-body)] text-[#f0ede8] text-right">{paymentData.endDate}</td>
                            </tr>
                          )}
                        </>
                      ) : (
                        <>
                          <tr className="border-b border-white/[0.04]">
                            <td className="py-3 font-[family-name:var(--font-body)] text-[#9ca3af]">Program</td>
                            <td className="py-3 font-[family-name:var(--font-body)] text-[#f0ede8] text-right font-bold">{paymentData.programName}</td>
                          </tr>
                          {paymentData.preferredDate && (
                            <tr className="border-b border-white/[0.04]">
                              <td className="py-3 font-[family-name:var(--font-body)] text-[#9ca3af]">Preferred Date</td>
                              <td className="py-3 font-[family-name:var(--font-body)] text-[#f0ede8] text-right">{paymentData.preferredDate}</td>
                            </tr>
                          )}
                          {paymentData.preferredTime && (
                            <tr className="border-b border-white/[0.04]">
                              <td className="py-3 font-[family-name:var(--font-body)] text-[#9ca3af]">Preferred Time</td>
                              <td className="py-3 font-[family-name:var(--font-body)] text-[#f0ede8] text-right">{paymentData.preferredTime}</td>
                            </tr>
                          )}
                        </>
                      )}

                      <tr className="border-b border-white/[0.04]">
                        <td className="py-3 font-[family-name:var(--font-body)] text-[#9ca3af]">Amount</td>
                        <td className="py-3 font-[family-name:var(--font-outfit)] font-black text-[#ff571a] text-right">
                          ₹{paymentData.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-[family-name:var(--font-body)] text-[#6b7280] text-xs">Reference</td>
                        <td className="py-3 font-[family-name:var(--font-body)] text-[#6b7280] text-xs text-right break-all">{paymentData.referenceId}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Next steps */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }} className="p-5 mb-8">
                  <p className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.15em] uppercase text-[#9ca3af] mb-3">
                    Next Steps
                  </p>
                  <ul className="space-y-2">
                    {isMembership ? (
                      <>
                        <li className="flex gap-2 text-sm text-[#c4c0bb] font-[family-name:var(--font-body)]">
                          <span className="text-[#ff571a] shrink-0">→</span> Visit us at Fraser Town with a photo ID
                        </li>
                        <li className="flex gap-2 text-sm text-[#c4c0bb] font-[family-name:var(--font-body)]">
                          <span className="text-[#ff571a] shrink-0">→</span> Bring this confirmation email
                        </li>
                        <li className="flex gap-2 text-sm text-[#c4c0bb] font-[family-name:var(--font-body)]">
                          <span className="text-[#ff571a] shrink-0">→</span> Our team will set up your access card
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex gap-2 text-sm text-[#c4c0bb] font-[family-name:var(--font-body)]">
                          <span className="text-[#ff571a] shrink-0">→</span> We&apos;ll call/WhatsApp within 24 hours to confirm time
                        </li>
                        <li className="flex gap-2 text-sm text-[#c4c0bb] font-[family-name:var(--font-body)]">
                          <span className="text-[#ff571a] shrink-0">→</span> Bring comfortable workout clothes and water
                        </li>
                        <li className="flex gap-2 text-sm text-[#c4c0bb] font-[family-name:var(--font-body)]">
                          <span className="text-[#ff571a] shrink-0">→</span> 3rd Floor, 157 MM Road, Fraser Town
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </>
            ) : (
              /* Payment not verified or ref not found */
              <div className="text-center">
                <div className="flex justify-center mb-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,87,26,0.1)', border: '1px solid rgba(255,87,26,0.3)' }}
                  >
                    <svg className="w-8 h-8 text-[#ff571a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <h1 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase text-2xl mb-3">
                  Payment Status Unknown
                </h1>
                <p className="font-[family-name:var(--font-body)] text-[#9ca3af] text-sm mb-8">
                  We couldn&apos;t verify your payment status. If you completed payment, our team will contact you shortly.
                  Contact us on WhatsApp for immediate assistance.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.1em] px-6 py-3 border border-white/10 text-[#f0ede8] hover:bg-white/5 transition-colors"
              >
                Back to Home
              </Link>
              <a
                href="https://wa.me/919606972238"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.1em] px-6 py-3 border border-[#25d366]/30 text-[#25d366] hover:bg-[#25d366]/10 transition-colors"
              >
                WhatsApp Support
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
