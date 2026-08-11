import Image from 'next/image'
import Link from 'next/link'

interface SiteLogoProps {
  logoUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  href?: string | null
  className?: string
}

const SIZES = {
  sm: { w: 80,  h: 32 },
  md: { w: 120, h: 48 },
  lg: { w: 160, h: 64 },
}

export function SiteLogo({ logoUrl, size = 'md', href = '/', className = '' }: SiteLogoProps) {
  const { w, h } = SIZES[size]
  const src = logoUrl ?? '/images/rfc-logo.png'

  const img = (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: w, height: h }}>
      <Image
        src={src}
        alt="Revive Fight Club"
        fill
        className="object-contain"
        priority
        unoptimized={src.startsWith('http')}
      />
    </div>
  )

  if (!href) return img
  return <Link href={href} aria-label="Revive Fight Club - Home">{img}</Link>
}

