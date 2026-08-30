import { notFound } from 'next/navigation'
import Link from 'next/link'
import { WorkshopRegistrationForm } from '@/components/workshops/WorkshopRegistrationForm'

// Mock fetcher
async function getWorkshopBySlug(slug: string) {
  if (slug === 'advanced-striking') return null // Let's pretend it's full and closed for registration here, or we allow waitlist
  
  return {
    id: '1',
    slug: 'intro-to-mma',
    title: 'Intro to MMA Bootcamp',
    date: 'Saturday, October 14, 2026',
    time: '10:00 AM - 12:00 PM',
    location: 'Revive Fight Club, Fraser Town',
    status: 'open',
    pricingType: 'free',
    price: null,
  }
}

export default async function WorkshopRegisterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workshop = await getWorkshopBySlug(slug)

  if (!workshop) notFound()

  // In a real app, you would check auth here if pricingType === 'paid'

  return (
    <div className="pt-14 md:pt-20 min-h-screen" style={{ background: '#0E0C10' }}>
      <div className="max-w-[800px] mx-auto px-5 md:px-16 py-12 md:py-20">
        <Link href={`/workshops/${slug}`} className="inline-flex items-center gap-2 text-[#707078] hover:text-[#DC2626] transition-colors font-[family-name:var(--font-body)] text-sm mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Workshop
        </Link>

        <div className="mb-10 pb-10 border-b border-white/10">
          <h1 className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-[0.92] tracking-[-0.03em] text-[clamp(32px,4vw,48px)] mb-4">
            Register for {workshop.title}
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[#A0A0A8] text-lg">
            {workshop.date} • {workshop.time}
          </p>
          <p className="font-[family-name:var(--font-body)] text-[#A0A0A8] text-lg">
            {workshop.location}
          </p>
        </div>

        <div className="bg-[#19181E] border border-white/10 p-6 md:p-10">
          <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase text-xl mb-6">
            Your Details
          </h2>
          <WorkshopRegistrationForm 
            workshopId={workshop.id}
            slug={workshop.slug}
            title={workshop.title}
            pricingType={workshop.pricingType}
            price={workshop.price}
          />
        </div>
      </div>
    </div>
  )
}
