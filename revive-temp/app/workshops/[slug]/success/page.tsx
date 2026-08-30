import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRegistrationConfirmation } from '@/lib/data/workshops'
import { generateQrDataUrl } from '@/lib/qr'

export default async function WorkshopSuccessPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ reg?: string }>
}) {
  const { slug } = await params
  const { reg } = await searchParams

  if (!reg) notFound()

  // Load real registration from DB
  const registration = await getRegistrationConfirmation(reg)

  // Generate QR image server-side if we have the token
  let qrDataUrl: string | null = null
  if (registration?.qr_token) {
    try {
      qrDataUrl = await generateQrDataUrl(registration.qr_token)
    } catch { /* non-fatal */ }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const workshop = registration?.workshops as any

  return (
    <div className="pt-14 md:pt-20 min-h-screen flex items-center justify-center" style={{ background: '#0E0C10' }}>
      <div className="max-w-[600px] w-full mx-auto px-5 py-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#DC2626]/10 text-[#DC2626] mb-8">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-[0.92] tracking-[-0.03em] text-[clamp(32px,4vw,48px)] mb-4">
          REGISTRATION SUCCESSFUL
        </h1>

        <p className="font-[family-name:var(--font-body)] text-[#A0A0A8] text-lg mb-2">
          {registration?.full_name ? `Welcome, ${registration.full_name}!` : "You're all set!"}
        </p>
        <p className="font-[family-name:var(--font-body)] text-[#A0A0A8] mb-2">
          Registration ID: <span className="font-bold text-[#FCFDFD]">{reg}</span>
        </p>
        {workshop?.title && (
          <p className="font-[family-name:var(--font-body)] text-[#A0A0A8] mb-8">
            Workshop: <span className="font-bold text-[#FCFDFD]">{workshop.title}</span>
          </p>
        )}

        {/* QR Code */}
        <div className="bg-[#19181E] border border-white/10 p-8 mb-8 inline-block w-full max-w-sm">
          <div className="flex flex-col items-center justify-center gap-4">
            {qrDataUrl ? (
              <div className="bg-white p-3 inline-block">
                <Image src={qrDataUrl} alt="Entry QR Code" width={160} height={160} unoptimized />
              </div>
            ) : (
              <div className="w-40 h-40 bg-white/5 border border-white/20 flex items-center justify-center">
                <span className="font-[family-name:var(--font-body)] text-[#707078] text-xs uppercase tracking-widest text-center px-4">
                  {registration?.qr_token ? 'Loading QR…' : 'Check your email for QR code'}
                </span>
              </div>
            )}
            <p className="font-[family-name:var(--font-body)] text-xs text-[#707078] uppercase tracking-wider">
              Show this at entry
            </p>
          </div>
        </div>

        <p className="font-[family-name:var(--font-body)] text-sm text-[#707078] mb-8">
          A confirmation email with your QR code has been sent to {registration?.email ?? 'your email'}.
        </p>

        <div>
          <Link
            href="/workshops"
            className="inline-flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-black tracking-[0.14em] uppercase px-8 py-4 bg-[#DC2626] text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            BACK TO WORKSHOPS
          </Link>
        </div>
      </div>
    </div>
  )
}
