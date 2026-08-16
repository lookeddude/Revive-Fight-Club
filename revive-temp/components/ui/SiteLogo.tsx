import Image from 'next/image'
import Link from 'next/link'

interface SiteLogoProps {
  logoUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  href?: string | null
  className?: string
}

const SIZES = {
  sm:  { w: 150, h: 50 },
  md:  { w: 240, h: 80 },
  lg:  { w: 300, h: 100 },
}

export function SiteLogo({ logoUrl, size = 'md', href = '/', className = '' }: SiteLogoProps) {
  const { w, h } = SIZES[size]
  const src = logoUrl ?? '/images/rfc-logo-dark.png'

  const img = (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{
        width: w,
        height: h,
        filter: 'drop-shadow(0 0 10px rgba(255,60,0,0.45)) drop-shadow(0 0 3px rgba(255,60,0,0.25))',
      }}
    >
      <Image
        src={src}
        alt="Revive Fight Club"
        fill
        sizes="(max-width: 768px) 160px, 240px"
        className="object-contain"
        priority
        unoptimized={src.startsWith('http')}
      />
    </div>
  )

  if (!href) return img
  return <Link href={href} aria-label="Revive Fight Club - Home">{img}</Link>
}

