import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'whatsapp'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  href?: string
  children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  // White background, dark text — premium CTA
  primary:
    'bg-[#FCFDFD] text-[#0E0C10] font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white hover:-translate-y-[2px] transition-all duration-200 active:scale-95 active:translate-y-0',
  // Transparent, white border — secondary action
  secondary:
    'border border-[rgba(255,255,255,0.18)] text-[#FCFDFD] font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:border-[rgba(255,255,255,0.35)] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-200 active:scale-95',
  // Minimal — no background
  ghost:
    'bg-transparent text-[#A0A0A8] font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:text-[#FCFDFD] transition-colors duration-200 active:scale-95',
  // WhatsApp — green-tinted
  whatsapp:
    'bg-[var(--color-surface-container)] border border-[rgba(255,255,255,0.1)] text-[#FCFDFD] font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:border-[#25d366]/40 hover:text-[#25d366] transition-all duration-200 active:scale-95 flex items-center gap-2',
}

export function Button({
  variant = 'primary',
  href,
  children,
  className,
  ...props
}: ButtonProps) {
  const styles = cn(variantStyles[variant], className)

  if (href) {
    const isExternal = href.startsWith('http')
    const isInternal = href.startsWith('/')

    if (isInternal) {
      return (
        <Link href={href} className={styles}>
          {children}
        </Link>
      )
    }

    return (
      <a
        href={href}
        className={styles}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    )
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  )
}
