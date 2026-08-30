import { notFound } from 'next/navigation'
import Link from 'next/link'
import { WorkshopRegistrationForm } from '@/components/workshops/WorkshopRegistrationForm'
import { getWorkshopForRegistration } from '@/lib/data/workshops'
import { getWorkshopAvailability } from '@/lib/workshops'

export default async function WorkshopRegisterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workshop = await getWorkshopForRegistration(slug)

  if (!workshop) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const avail = getWorkshopAvailability({
    status: workshop.status as any,
    registrationDeadline: workshop.registration_deadline,
    capacity: workshop.capacity,
    confirmedCount: workshop.confirmedCount,
    waitlistEnabled: workshop.waitlist_enabled,
    startDatetime: workshop.start_datetime,
  })

  if (!avail.canRegister && !avail.isWaitlist) notFound()

  const startDate = new Date(workshop.start_datetime).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const startTime = new Date(workshop.start_datetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const endTime = new Date(workshop.end_datetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="pt-14 md:pt-20 min-h-screen" style={{ background: '#0E0C10' }}>
      <div className="max-w-[800px] mx-auto px-5 md:px-16 py-12 md:py-20">
        <Link href={`/workshops/${slug}`} className="inline-flex items-center gap-2 text-[#707078] hover:text-[#DC2626] transition-colors font-[family-name:var(--font-body)] text-sm mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Workshop
        </Link>
        <div className="mb-10 pb-10 border-b border-white/10">
          <h1 className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-[0.92] tracking-[-0.03em] text-[clamp(32px,4vw,48px)] mb-4">Register for {workshop.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-[family-name:var(--font-body)] text-sm text-[#A0A0A8]">
            <span>{startDate}</span>
            <span>{startTime} – {endTime}</span>
            {workshop.location && <span>{workshop.location}</span>}
          </div>
          {workshop.pricing_type === 'paid' && workshop.price ? (
            <p className="font-[family-name:var(--font-body)] text-[#DC2626] font-bold text-lg mt-3">₹{workshop.price.toLocaleString('en-IN')}</p>
          ) : (
            <p className="font-[family-name:var(--font-body)] text-green-400 font-bold text-lg mt-3">FREE</p>
          )}
        </div>
        <WorkshopRegistrationForm
          workshopId={workshop.id}
          slug={workshop.slug}
          title={workshop.title}
          pricingType={workshop.pricing_type}
          price={workshop.price}
        />
      </div>
    </div>
  )
}
