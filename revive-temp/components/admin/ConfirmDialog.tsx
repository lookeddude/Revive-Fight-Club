'use client'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative max-w-sm w-full p-6 shadow-2xl"
        style={{
          background: '#161a18',
          border: '1px solid rgba(255,255,255,0.09)',
          animation: 'dialogIn 0.2s ease',
        }}
      >
        {/* Accent bar top */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: destructive
              ? 'linear-gradient(to right, transparent, #ef4444 30%, #ef4444 70%, transparent)'
              : 'linear-gradient(to right, transparent, #ff571a 30%, #ff571a 70%, transparent)',
          }}
          aria-hidden="true"
        />

        {/* Icon */}
        <div
          className="w-10 h-10 flex items-center justify-center mb-4"
          style={{
            background: destructive ? 'rgba(239,68,68,0.1)' : 'rgba(255,87,26,0.1)',
            border: `1px solid ${destructive ? 'rgba(239,68,68,0.2)' : 'rgba(255,87,26,0.2)'}`,
          }}
        >
          {destructive ? (
            <svg className="w-4 h-4" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" style={{ color: '#ff571a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        <h2
          id="confirm-title"
          className="font-[family-name:var(--font-inter)] font-bold text-base mb-2"
          style={{ color: 'rgba(255,255,255,0.9)' }}
        >
          {title}
        </h2>
        <p
          className="font-[family-name:var(--font-inter)] text-sm mb-6 leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          {description}
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium transition-colors"
            style={{
              color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-bold transition-colors"
            style={{
              background: destructive
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : 'linear-gradient(135deg, #ff571a, #d94418)',
              color: destructive ? '#fff' : '#000',
              boxShadow: destructive
                ? '0 4px 16px rgba(239,68,68,0.3)'
                : '0 4px 16px rgba(255,87,26,0.3)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.95) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
