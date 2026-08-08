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
        'inline-block font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase px-3 py-1',
        variant === 'orange' ? 'bg-[#ff571a] text-black' : 'bg-white text-black',
        className
      )}
    >
      {children}
    </span>
  )
}
