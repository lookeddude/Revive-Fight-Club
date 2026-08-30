import Link from 'next/link'
import { notFound } from 'next/navigation'

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
        
        <p className="font-[family-name:var(--font-body)] text-[#A0A0A8] text-lg mb-8">
          You're all set! Your registration ID is <span className="font-bold text-[#FCFDFD]">{reg}</span>.
        </p>

        <div className="bg-[#19181E] border border-white/10 p-8 mb-8 inline-block text-left w-full max-w-sm">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-32 h-32 bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="font-[family-name:var(--font-body)] text-[#707078] text-xs uppercase tracking-widest text-center px-4">
                QR CODE
              </span>
            </div>
            <p className="font-[family-name:var(--font-body)] text-xs text-[#707078] mt-3 uppercase tracking-wider">
              Show this at entry
            </p>
          </div>
        </div>

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
