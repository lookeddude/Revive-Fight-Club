import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'whatsapp'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  href?: string
  children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-primary)] text-black font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-[var(--color-primary-hover)] transition-colors duration-200 active:scale-95',
  secondary:
    'border border-[var(--color-outline)] text-[var(--color-on-background)] font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-[var(--color-surface-container-high)] hover:border-[var(--color-outline-variant)] transition-colors duration-200 active:scale-95',
  ghost:
    'bg-transparent text-[var(--color-on-background)] font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-[var(--color-surface-container)] transition-colors duration-200 active:scale-95',
  whatsapp:
    'bg-[var(--color-surface-container)] border border-[var(--color-outline)] text-[var(--color-on-background)] font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-[var(--color-surface-container-high)] transition-colors duration-200 active:scale-95 flex items-center gap-2',
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
    return (
      <a href={href} className={styles}>
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
