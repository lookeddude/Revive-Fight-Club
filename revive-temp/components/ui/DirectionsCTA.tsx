interface DirectionsCTAProps {
  googleMapsUrl: string | null
  variant?: 'primary' | 'secondary' | 'text'
  label?: string
  className?: string
}

/**
 * Reusable Get Directions CTA.
 * URL sourced from business_settings.google_maps_url — never hard-coded.
 * Renders nothing if URL is not configured.
 */
export function DirectionsCTA({
  googleMapsUrl,
  variant = 'secondary',
  label = 'GET DIRECTIONS',
  className = '',
}: DirectionsCTAProps) {
  if (!googleMapsUrl) return null

  const baseStyles =
    'inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase transition-all duration-300 active:scale-95'

  const variantStyles = {
    primary: 'bg-[#ff571a] text-black px-8 py-4 hover:bg-white',
    secondary: 'border border-white/10 text-[#e2e3e1] px-8 py-4 hover:bg-[#383a38]',
    text: 'text-[#e2e3e1] hover:text-[#ff571a]',
  }

  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      aria-label="Get directions to Revive Fight Club on Google Maps"
    >
      <svg
        className="w-4 h-4 fill-current flex-shrink-0"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
      <span>{label}</span>
    </a>
  )
}
