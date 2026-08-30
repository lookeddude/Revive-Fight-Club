import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { WorkshopShare } from '@/components/workshops/WorkshopShare'
import { WorkshopStatusBadge } from '@/components/workshops/WorkshopStatusBadge'
import { getBusinessSettings } from '@/lib/data/content'
import { getWorkshopBySlug } from '@/lib/data/workshops'
import { getWorkshopAvailability } from '@/lib/workshops'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const workshop = await getWorkshopBySlug(slug)
  if (!workshop) return { title: 'Workshop Not Found' }
  return {
    title: `${workshop.title} | Revive Fight Club Events`,
    description: workshop.short_description ?? '',
    alternates: { canonical: `https://revivefightclub.com/workshops/${slug}` },
    openGraph: { url: `https://revivefightclub.com/workshops/${slug}` },
  }
}

export default async function WorkshopDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [workshop, settings] = await Promise.all([
    getWorkshopBySlug(slug),
    getBusinessSettings()
  ])

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

  const isFullOrClosed = !avail.canRegister && !avail.isWaitlist

  const startDate = new Date(workshop.start_datetime).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const startTime = new Date(workshop.start_datetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const endTime = new Date(workshop.end_datetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <>
      {/* Event JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: workshop.title,
            description: workshop.short_description,
            image: workshop.cover_image_path,
            startDate: workshop.start_datetime,
            endDate: workshop.end_datetime,
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            location: {
              '@type': 'Place',
              name: 'Revive Fight Club',
              address: workshop.location,
            },
            offers: {
              '@type': 'Offer',
              price: workshop.price ?? 0,
              priceCurrency: workshop.currency ?? 'INR',
              availability: isFullOrClosed ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
            }
          }),
        }}
      />

      <div className="pt-14 md:pt-20" style={{ background: '#0E0C10' }}>
        {/* Breadcrumbs */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#707078] hover:text-[#DC2626] transition-colors font-[family-name:var(--font-body)]">Home</Link>
            <span className="text-[#3a3530]">/</span>
            <Link href="/workshops" className="text-[#707078] hover:text-[#DC2626] transition-colors font-[family-name:var(--font-body)]">Workshops</Link>
            <span className="text-[#3a3530]">/</span>
            <span className="text-[#FCFDFD] font-[family-name:var(--font-body)] font-semibold">{workshop.title}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="max-w-[1280px] mx-auto px-5 md:px-16 pb-12">
          <div className="relative h-[400px] md:h-[500px] mb-8 overflow-hidden">
            <Image
              src={workshop.cover_image_path ?? 'https://images.unsplash.com/photo-1549476464-37392f717541?w=1600&q=85&fit=crop'}
              alt={workshop.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C10] via-black/50 to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="mb-4">
                  <WorkshopStatusBadge
                    status={avail.isFull ? 'full' : avail.canRegister ? 'open' : 'closed'}
                    ctaLabel={avail.ctaLabel}
                    pricingType={workshop.pricing_type}
                    price={workshop.price}
                  />
                </div>
                <h1 className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-[0.92] tracking-[-0.03em] text-[clamp(40px,5vw,56px)] mb-2">
                  {workshop.title}
                </h1>
                <p className="font-[family-name:var(--font-body)] text-lg text-[#A0A0A8]">
                  {workshop.short_description}
                </p>
              </div>

              <div className="flex-shrink-0 flex flex-col gap-4">
                <Link
                  href={`/workshops/${slug}/register`}
                  className={`inline-flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-black tracking-[0.14em] uppercase px-8 py-4 transition-all duration-300 ${
                    isFullOrClosed
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-[#DC2626] text-white hover:bg-white hover:text-black'
                  }`}
                  aria-disabled={isFullOrClosed}
                >
                  {isFullOrClosed ? avail.ctaLabel : 'REGISTER NOW'}
                </Link>
                <WorkshopShare
                  title={workshop.title}
                  slug={slug}
                  whatsappNumber={settings?.whatsapp_number}
                />
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
            <div className="lg:col-span-2">
              <div className="prose prose-invert prose-p:text-[#A0A0A8] prose-p:font-[family-name:var(--font-body)] prose-p:leading-relaxed prose-headings:font-[family-name:var(--font-outfit)] prose-headings:text-[#FCFDFD] prose-headings:uppercase max-w-none">
                <h2 className="text-2xl font-black mb-4">About the Workshop</h2>
                <div className="whitespace-pre-line text-[#A0A0A8] font-[family-name:var(--font-body)] text-lg leading-[1.8] mb-10">
                  {workshop.description}
                </div>

                {workshop.what_you_learn && workshop.what_you_learn.length > 0 && (
                  <>
                    <h3 className="text-xl font-black mb-4">What You&apos;ll Learn</h3>
                    <ul className="list-disc pl-5 mb-10 text-[#A0A0A8] font-[family-name:var(--font-body)] text-lg space-y-2">
                      {workshop.what_you_learn.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}

                {workshop.requirements && workshop.requirements.length > 0 && (
                  <>
                    <h3 className="text-xl font-black mb-4">Requirements</h3>
                    <ul className="list-disc pl-5 text-[#A0A0A8] font-[family-name:var(--font-body)] text-lg space-y-2">
                      {workshop.requirements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}

                {workshop.faqs && workshop.faqs.length > 0 && (
                  <>
                    <h3 className="text-xl font-black mb-4 mt-10">FAQs</h3>
                    <div className="space-y-4 not-prose">
                      {workshop.faqs.map((faq) => (
                        <div key={faq.id} className="border border-white/10 p-4">
                          <p className="font-[family-name:var(--font-body)] text-[#FCFDFD] font-bold mb-2">{faq.question}</p>
                          <p className="font-[family-name:var(--font-body)] text-[#A0A0A8] text-sm leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="p-6 md:p-8 bg-[#19181E] border border-white/10 sticky top-24">
                <h3 className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] text-xl uppercase mb-6 pb-4 border-b border-white/10">
                  Event Details
                </h3>

                <div className="space-y-6">
                  <div>
                    <span className="block font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.1em] text-[#707078] uppercase mb-1">Date &amp; Time</span>
                    <span className="block font-[family-name:var(--font-body)] text-[15px] text-[#FCFDFD]">
                      {startDate}<br />{startTime} – {endTime}
                    </span>
                  </div>

                  {workshop.location && (
                    <div>
                      <span className="block font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.1em] text-[#707078] uppercase mb-1">Location</span>
                      <span className="block font-[family-name:var(--font-body)] text-[15px] text-[#FCFDFD]">{workshop.location}</span>
                    </div>
                  )}

                  {workshop.pricing_type === 'paid' && workshop.price ? (
                    <div>
                      <span className="block font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.1em] text-[#707078] uppercase mb-1">Price</span>
                      <span className="block font-[family-name:var(--font-body)] text-[18px] font-bold text-[#DC2626]">₹{workshop.price.toLocaleString('en-IN')}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="block font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.1em] text-[#707078] uppercase mb-1">Price</span>
                      <span className="block font-[family-name:var(--font-body)] text-[18px] font-bold text-green-400">FREE</span>
                    </div>
                  )}

                  {workshop.instructors && workshop.instructors.length > 0 && (
                    <div>
                      <span className="block font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.1em] text-[#707078] uppercase mb-1">Instructors</span>
                      {workshop.instructors.map((inst) => (
                        <span key={inst.id} className="block font-[family-name:var(--font-body)] text-[15px] text-[#FCFDFD]">
                          {inst.name}
                          {inst.bio && <span className="text-[#A0A0A8] text-sm block">{inst.bio}</span>}
                        </span>
                      ))}
                    </div>
                  )}

                  {avail.remainingSeats !== null && avail.remainingSeats > 0 && (
                    <div>
                      <span className="block font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.1em] text-[#707078] uppercase mb-1">Availability</span>
                      <span className="block font-[family-name:var(--font-body)] text-[15px] text-[#FCFDFD]">{avail.remainingSeats} spots left</span>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <Link
                    href={`/workshops/${slug}/register`}
                    className={`flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-black tracking-[0.14em] uppercase px-6 py-4 w-full transition-all duration-300 ${
                      isFullOrClosed
                        ? 'bg-white/10 text-white/50 cursor-not-allowed'
                        : 'bg-[#DC2626] text-white hover:bg-white hover:text-black'
                    }`}
                    aria-disabled={isFullOrClosed}
                  >
                    {isFullOrClosed ? avail.ctaLabel : 'REGISTER NOW'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
