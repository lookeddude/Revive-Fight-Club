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

  const bg = type === 'success' ? 'bg-[#111312] border-green-500/40' :
             type === 'error'   ? 'bg-[#111312] border-red-500/40' :
                                  'bg-[#111312] border-white/10'
  const dot = type === 'success' ? 'bg-green-500' :
              type === 'error'   ? 'bg-red-500' : 'bg-blue-500'

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 border shadow-lg max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-200 ${bg}`}
      role="alert"
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} aria-hidden="true" />
      <span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">{message}</span>
      <button onClick={onClose} className="ml-2 text-[#6b7280] hover:text-[#e2e3e1] transition-colors text-lg leading-none" aria-label="Close">&times;</button>
    </div>
  )
}
