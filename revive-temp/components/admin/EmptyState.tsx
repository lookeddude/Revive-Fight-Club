interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-12 h-12 border border-white/10 flex items-center justify-center mb-4">
        <svg className="w-5 h-5 text-[#4b5563]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
      <h3 className="font-[family-name:var(--font-inter)] text-sm font-semibold text-[#e2e3e1] mb-2">
        {title}
      </h3>
      {description && (
        <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] max-w-sm mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
