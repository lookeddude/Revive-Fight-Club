import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { WorkshopShare } from '@/components/workshops/WorkshopShare'
import { WorkshopStatusBadge } from '@/components/workshops/WorkshopStatusBadge'
import { getBusinessSettings } from '@/lib/data/content'

// Mock fetcher
async function getWorkshopBySlug(slug: string) {
  if (slug === 'advanced-striking') {
    return {
      id: '2',
      slug: 'advanced-striking',
      title: 'Advanced Striking Seminar',
      shortDescription: 'Master complex striking combinations and footwork with our head coach.',
      description: 'Join us for an intensive 3-hour seminar focused on advanced striking techniques. This workshop is designed for intermediate to advanced practitioners looking to elevate their striking game.\n\nTopics covered:\n- Advanced Dutch kickboxing combinations\n- Defensive footwork and angling\n- Counter-striking strategies\n- Clinch entry and exit',
      date: 'Sunday, October 22, 2026',
      time: '2:00 PM - 5:00 PM',
      location: 'Revive Fight Club, Fraser Town',
      imagePath: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834b?w=1600&q=85&fit=crop',
      status: 'full',
      ctaLabel: 'Waitlist',
      pricingType: 'paid',
      price: 1500,
      availableSeats: 0,
      instructors: [{ name: 'Coach Raj', role: 'Head Striking Coach' }],
      whatYouLearn: ['Advanced combos', 'Footwork', 'Counters'],
      requirements: ['16oz Gloves', 'Shin Guards', 'Mouthguard', 'Minimum 6 months experience']
    }
  }
  
  return {
    id: '1',
    slug: 'intro-to-mma',
    title: 'Intro to MMA Bootcamp',
    shortDescription: 'A 2-hour intensive workshop covering the fundamentals of MMA for complete beginners.',
    description: 'Perfect for complete beginners. Learn the absolute basics of Mixed Martial Arts in a safe, controlled environment. We will cover fundamental striking, basic takedowns, and introductory grappling positions.',
    date: 'Saturday, October 14, 2026',
    time: '10:00 AM - 12:00 PM',
    location: 'Revive Fight Club, Fraser Town',
    imagePath: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1600&q=85&fit=crop',
    status: 'open',
    ctaLabel: 'Register Now',
    pricingType: 'free',
    price: null,
    availableSeats: 20,
    instructors: [{ name: 'Coach Raj', role: 'Head Coach' }],
    whatYouLearn: ['Stance and movement', 'Basic punches and kicks', 'Takedown defense basics'],
    requirements: ['Comfortable athletic wear', 'Water bottle', 'No prior experience needed']
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const workshop = await getWorkshopBySlug(slug)
  if (!workshop) return { title: 'Workshop Not Found' }
  return {
    title: `${workshop.title} | Revive Fight Club Events`,
    description: workshop.shortDescription,
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

  const isFullOrClosed = workshop.status === 'full' || workshop.status === 'closed'

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
            description: workshop.shortDescription,
            image: workshop.imagePath,
            startDate: workshop.date, // Ideal format would be ISO8601
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
              priceCurrency: 'INR',
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
              src={workshop.imagePath ?? 'https://images.unsplash.com/photo-1549476464-37392f717541?w=1600&q=85&fit=crop'}
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
                    status={workshop.status}
                    ctaLabel={workshop.ctaLabel}
                    pricingType={workshop.pricingType}
                    price={workshop.price}
                  />
                </div>
                <h1 className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-[0.92] tracking-[-0.03em] text-[clamp(40px,5vw,56px)] mb-2">
                  {workshop.title}
                </h1>
                <p className="font-[family-name:var(--font-body)] text-lg text-[#A0A0A8]">
                  {workshop.shortDescription}
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
                  {isFullOrClosed ? workshop.ctaLabel : 'REGISTER NOW'}
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

                {workshop.whatYouLearn && workshop.whatYouLearn.length > 0 && (
                  <>
                    <h3 className="text-xl font-black mb-4">What You'll Learn</h3>
                    <ul className="list-disc pl-5 mb-10 text-[#A0A0A8] font-[family-name:var(--font-body)] text-lg space-y-2">
                      {workshop.whatYouLearn.map((item, idx) => (
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
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="p-6 md:p-8 bg-[#19181E] border border-white/10 sticky top-24">
                <h3 className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] text-xl uppercase mb-6 pb-4 border-b border-white/10">
                  Event Details
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <span className="block font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.1em] text-[#707078] uppercase mb-1">
                      Date & Time
                    </span>
                    <span className="block font-[family-name:var(--font-body)] text-[15px] text-[#FCFDFD]">
                      {workshop.date}<br/>{workshop.time}
                    </span>
                  </div>
                  
                  <div>
                    <span className="block font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.1em] text-[#707078] uppercase mb-1">
                      Location
                    </span>
                    <span className="block font-[family-name:var(--font-body)] text-[15px] text-[#FCFDFD]">
                      {workshop.location}
                    </span>
                  </div>

                  <div>
                    <span className="block font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.1em] text-[#707078] uppercase mb-1">
                      Instructors
                    </span>
                    {workshop.instructors.map((inst, idx) => (
                      <span key={idx} className="block font-[family-name:var(--font-body)] text-[15px] text-[#FCFDFD]">
                        {inst.name} <span className="text-[#A0A0A8] text-sm">({inst.role})</span>
                      </span>
                    ))}
                  </div>

                  {workshop.availableSeats !== null && workshop.availableSeats > 0 && (
                    <div>
                      <span className="block font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.1em] text-[#707078] uppercase mb-1">
                        Availability
                      </span>
                      <span className="block font-[family-name:var(--font-body)] text-[15px] text-[#FCFDFD]">
                        {workshop.availableSeats} spots left
                      </span>
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
                    {isFullOrClosed ? workshop.ctaLabel : 'REGISTER NOW'}
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
