import Image from 'next/image'
import Link from 'next/link'

interface SiteLogoProps {
  logoUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  href?: string | null
  className?: string
}

const SIZES = {
  sm: { w: 72, h: 29, px: 'px-1.5 py-0.5' },
  md: { w: 100, h: 40, px: 'px-2 py-1' },
  lg: { w: 130, h: 52, px: 'px-3 py-1.5' },
}

export function SiteLogo({ logoUrl, size = 'md', href = '/', className = '' }: SiteLogoProps) {
  const { w, h, px } = SIZES[size]
  const src = logoUrl ?? '/images/rfc-logo.png'

  const img = (
    <div className={`inline-flex flex-shrink-0 items-center justify-center bg-white rounded-sm ${px} ${className}`}>
      <Image
        src={src}
        alt="Revive Fight Club"
        width={w}
        height={h}
        className="object-contain"
        priority
        unoptimized={src.startsWith('http')}
      />
    </div>
  )

  if (!href) return img
  return <Link href={href} aria-label="Revive Fight Club - Home">{img}</Link>
}

