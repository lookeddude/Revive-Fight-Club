import Link from 'next/link'
import Image from 'next/image'
import { Reveal } from '@/components/ui/Reveal'
import type { WorkshopListItem } from '@/lib/data/workshops'
import { formatWorkshopDateShort, formatPrice } from '@/lib/workshops'

const WORKSHOP_FALLBACK = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=85&fit=crop'

interface HomeFeaturedWorkshopProps {
  workshops: WorkshopListItem[]
}

function WorkshopCard({ workshop }: { workshop: WorkshopListItem }) {
  const isPaid = workshop.pricing_type === 'paid'
  const price = formatPrice(workshop.price, workshop.pricing_type as 'free' | 'paid')
  const dateLabel = formatWorkshopDateShort(workshop.start_datetime)
  const locationLabel = workshop.workshop_mode === 'online'
    ? 'Online'
    : workshop.workshop_mode === 'hybrid'
    ? 'Online + In-Person'
    : null

  return (
    <article className="group relative flex flex-col bg-[#111312] border border-[#1f1f1f] hover:border-[#2a2a2a] transition-all duration-300 overflow-hidden">
      {/* Cover image */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={workshop.cover_image_path ?? WORKSHOP_FALLBACK}
          alt={workshop.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized={!!(workshop.cover_image_path?.startsWith('https://'))}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C10] via-[#0E0C10]/20 to-transparent" />
        <div className="absolute top-3 right-3">
          <span
            className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${
              isPaid
                ? 'bg-[#0E0C10]/90 text-[#FCFDFD] border border-[#2a2a2a]'
                : 'bg-[#FCFDFD] text-[#0E0C10]'
            }`}
          >
            {price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        <div className="flex items-center gap-3 mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
          <span>{dateLabel}</span>
          {locationLabel && (
            <>
              <span className="w-0.5 h-3 bg-[#2a2a2a]" />
              <span>{locationLabel}</span>
            </>
          )}
        </div>

        <h3
          className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-tight tracking-tight mb-2 line-clamp-2"
          style={{ fontSize: 'clamp(18px, 2.5vw, 22px)' }}
        >
          {workshop.title}
        </h3>

        {workshop.short_description && (
          <p className="text-[#9ca3af] text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
            {workshop.short_description}
          </p>
        )}

        {workshop.capacity !== null && (() => {
          const remaining = workshop.capacity! - workshop.confirmedCount
          return remaining <= 10 && remaining > 0 ? (
            <p className="text-xs text-[#DC2626] font-semibold uppercase tracking-wide mb-4">
              {remaining} seat{remaining !== 1 ? 's' : ''} left
            </p>
          ) : remaining <= 0 ? (
            <p className="text-xs text-[#6b7280] font-semibold uppercase tracking-wide mb-4">Fully booked</p>
          ) : null
        })()}

        <Link
          href={`/workshops/${workshop.slug}`}
          className="mt-auto inline-block text-center bg-[#FCFDFD] text-[#0E0C10] font-[family-name:var(--font-body)] font-bold text-[11px] uppercase tracking-[0.15em] px-5 py-3 hover:bg-[#DC2626] hover:text-[#FCFDFD] transition-colors duration-200"
        >
          View Workshop
        </Link>
      </div>
    </article>
  )
}

export function HomeFeaturedWorkshop({ workshops }: HomeFeaturedWorkshopProps) {
  if (!workshops || workshops.length === 0) return null

  return (
    <section
      className="py-16 md:py-28 relative overflow-hidden"
      style={{ background: '#0E0C10' }}
    >
      <div className="relative z-10 max-w-[1320px] mx-auto px-5 md:px-12">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10 mb-14">
            <div>
              <p className="section-label">Events &amp; Learning</p>
              <h2
                className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] uppercase leading-[0.92] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(38px, 6vw, 72px)' }}
              >
                UPCOMING<br />WORKSHOPS
              </h2>
            </div>
            <Link
              href="/workshops"
              className="md:ml-auto font-[family-name:var(--font-body)] font-bold text-[11px] uppercase tracking-[0.15em] text-[#6b7280] hover:text-[#FCFDFD] transition-colors pb-1 border-b border-[#2a2a2a] hover:border-[#FCFDFD] whitespace-nowrap"
            >
              All Workshops
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop, i) => (
            <Reveal key={workshop.id} delay={i * 0.08}>
              <WorkshopCard workshop={workshop} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 text-center">
            <Link
              href="/workshops"
              className="inline-block font-[family-name:var(--font-body)] font-bold text-[11px] uppercase tracking-[0.2em] px-8 py-4 border border-[#FCFDFD]/20 text-[#FCFDFD] hover:bg-[#FCFDFD] hover:text-[#0E0C10] transition-colors duration-200"
            >
              Browse All Workshops
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
