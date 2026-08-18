'use client'

import { useEffect } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  onClose: () => void
  duration?: number
}

export function Toast({ message, type = 'success', onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const config = {
    success: {
      bar: '#22c55e',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bar: '#ef4444',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    info: {
      bar: '#3b82f6',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01" />
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
        </svg>
      ),
    },
  }[type]

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex items-start gap-3 max-w-[340px] shadow-2xl"
      style={{
        background: '#161a18',
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: `3px solid ${config.bar}`,
        animation: 'toastSlideIn 0.25s ease',
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center mt-3 ml-3"
        style={{ color: config.bar }}
      >
        {config.icon}
      </div>

      {/* Message */}
      <div className="flex-1 py-3 pr-2">
        <p className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1] leading-snug">{message}</p>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center mt-1 mr-1 transition-colors"
        style={{ color: 'rgba(255,255,255,0.25)' }}
        aria-label="Dismiss notification"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
