import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'orange' | 'white'
  className?: string
}

export function Badge({ children, variant = 'orange', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.1em] uppercase px-3 py-1',
        variant === 'orange' ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'bg-[var(--color-on-background)] text-[var(--color-background)]',
        className
      )}
    >
      {children}
    </span>
  )
}
