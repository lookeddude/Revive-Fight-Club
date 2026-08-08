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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} aria-hidden="true" />
      <div className="relative bg-[#111312] border border-white/10 p-6 max-w-sm w-full shadow-2xl">
        <h2 id="confirm-title" className="font-[family-name:var(--font-inter)] font-semibold text-[#e2e3e1] text-base mb-2">
          {title}
        </h2>
        <p className="font-[family-name:var(--font-inter)] text-sm text-[#9ca3af] mb-6">
          {description}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-[#9ca3af] border border-white/[0.08] hover:text-[#e2e3e1] hover:border-white/20 transition-colors font-[family-name:var(--font-inter)]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-bold transition-colors font-[family-name:var(--font-inter)] ${destructive ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-[#ff571a] hover:bg-white text-black'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
