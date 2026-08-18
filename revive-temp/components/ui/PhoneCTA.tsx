import { buildPhoneUrl } from '@/lib/business'

interface PhoneCTAProps {
  phone: string | null
  variant?: 'primary' | 'secondary' | 'text'
  label?: string
  className?: string
}

/**
 * Reusable Phone Call CTA.
 * Number sourced dynamically from business_settings — never hard-coded.
 */
export function PhoneCTA({
  phone,
  variant = 'secondary',
  label,
  className = '',
}: PhoneCTAProps) {
  const url = buildPhoneUrl(phone)
  if (!url) return null

  const displayLabel = label ?? phone ?? 'CALL US'

  const baseStyles =
    'inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase transition-all duration-300 active:scale-95'

  const variantStyles = {
    primary: 'bg-[#ff571a] text-black px-8 py-4 hover:bg-white',
    secondary: 'border border-white/10 text-[#e2e3e1] px-8 py-4 hover:bg-[#383a38]',
    text: 'text-[#e2e3e1] hover:text-[#ff571a]',
  }

  return (
    <a
      href={url}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      aria-label={`Call Revive Fight Club at ${phone}`}
    >
      <svg
        className="w-4 h-4 fill-current flex-shrink-0"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>
      <span>{displayLabel}</span>
    </a>
  )
}
