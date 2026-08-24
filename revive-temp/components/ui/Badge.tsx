import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'orange' | 'white' | 'dark'
  className?: string
}

export function Badge({ children, variant = 'dark', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.14em] uppercase px-2.5 py-1',
        variant === 'orange'
          ? 'bg-[rgba(14,12,16,0.75)] text-[#A0A0A8] border border-white/10'
          : variant === 'white'
          ? 'bg-[#FCFDFD] text-[#0E0C10]'
          : 'bg-[rgba(14,12,16,0.75)] text-[#A0A0A8] border border-white/10',
        className
      )}
    >
      {children}
    </span>
  )
}
