interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
      style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.07)' }}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 flex items-center justify-center mb-5"
        style={{
          background: 'rgba(255,87,26,0.06)',
          border: '1px solid rgba(255,87,26,0.12)',
        }}
      >
        <svg
          className="w-6 h-6"
          style={{ color: 'rgba(255,87,26,0.4)' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </div>

      <h3
        className="font-[family-name:var(--font-body)] text-sm font-semibold mb-2"
        style={{ color: 'rgba(255,255,255,0.75)' }}
      >
        {title}
      </h3>

      {description && (
        <p
          className="font-[family-name:var(--font-body)] text-sm max-w-sm mb-6 leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          {description}
        </p>
      )}

      {action}
    </div>
  )
}
