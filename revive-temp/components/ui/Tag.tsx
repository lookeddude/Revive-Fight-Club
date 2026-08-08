import { cn } from '@/lib/utils'

interface TagProps {
  children: React.ReactNode
  className?: string
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        'ghost-border px-3 py-1 font-[family-name:var(--font-inter)] text-xs font-medium text-[#e2e3e1]',
        className
      )}
    >
      {children}
    </span>
  )
}
