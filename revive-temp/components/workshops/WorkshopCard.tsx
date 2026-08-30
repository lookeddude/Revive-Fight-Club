import Link from 'next/link'
import Image from 'next/image'
import { WorkshopStatusBadge } from './WorkshopStatusBadge'

interface WorkshopCardProps {
  id: string
  slug: string
  title: string
  shortDescription: string
  date: string
  location: string
  imagePath: string | null
  status: string
  ctaLabel: string
  pricingType: string
  price: number | null
  availableSeats: number | null
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549476464-37392f717541?w=800&q=85&fit=crop'

export function WorkshopCard({
  slug,
  title,
  shortDescription,
  date,
  location,
  imagePath,
  status,
  ctaLabel,
  pricingType,
  price,
  availableSeats
}: WorkshopCardProps) {
  const isFullOrClosed = status === 'full' || status === 'closed'

  return (
    <Link
      href={`/workshops/${slug}`}
      className="group relative overflow-hidden flex flex-col justify-end h-[300px] md:h-[440px]"
      style={{ background: '#19181E', border: '1px solid rgba(255,255,255,0.06)' }}
      aria-label={`View ${title} workshop`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imagePath ?? FALLBACK_IMAGE}
          alt={title}
          fill
          loading="lazy"
          quality={75}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ opacity: 0.65 }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Cinematic overlay */}
        <div className="absolute inset-0 img-cinematic" aria-hidden="true" style={{ background: 'linear-gradient(to top, rgba(14,12,16,1) 0%, rgba(14,12,16,0.3) 50%, transparent 100%)' }} />
        {/* Border glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)' }}
          aria-hidden="true"
        />
      </div>

      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
        <WorkshopStatusBadge 
          status={status} 
          ctaLabel={ctaLabel} 
          pricingType={pricingType} 
          price={price} 
        />
      </div>

      {/* Card Content */}
      <div className="relative z-10 p-5 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <span className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.1em] text-[#A0A0A8] uppercase">
            {date} • {location}
          </span>
          <h3
            className="font-[family-name:var(--font-outfit)] font-black text-[#FCFDFD] text-xl leading-tight tracking-[-0.02em] uppercase mb-1 group-hover:text-white transition-colors"
          >
            {title}
          </h3>
        </div>
        
        {shortDescription && (
          <p className="font-[family-name:var(--font-body)] text-[12px] text-[#707078] leading-relaxed mb-3 line-clamp-2">
            {shortDescription}
          </p>
        )}
        
        {/* Animated bottom line on hover */}
        <div
          className="w-0 h-px bg-white/40 group-hover:w-10 transition-all duration-500"
          aria-hidden="true"
        />
      </div>
    </Link>
  )
}
