'use client'

import { useState } from 'react'
import { RazorpayButton } from './RazorpayButton'
import { validateName, validateEmail, validatePhone } from '@/lib/validation'

interface MembershipCheckoutProps {
  planId: string
  planName: string
  price: number
  billingPeriod: string
  batchCategory?: string | null
}

export function MembershipCheckout({
  planId,
  planName,
  price,
  billingPeriod,
  batchCategory,
}: MembershipCheckoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({})

  const validate = () => {
    const e = {
      name:  validateName(name) ?? undefined,
      email: validateEmail(email) ?? undefined,
      phone: validatePhone(phone) ?? undefined,
    }
    setErrors(e)
    return !e.name && !e.email && !e.phone
  }

  const periodLabel: Record<string, string> = {
    monthly:   '1 Month',
    quarterly: '3 Months',
    annually:  '1 Year',
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.12em] uppercase px-5 py-2.5 transition-colors duration-200 bg-[#ff571a] text-black hover:bg-[#e04d17] active:scale-[0.98]"
      >
        Pay ₹{price.toLocaleString('en-IN')}
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}
        >
          <div
            className="w-full max-w-md relative"
            style={{
              background: '#111210',
              border: '1px solid rgba(255,87,26,0.25)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h3 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase tracking-tight text-base">
                Complete Payment
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#6b7280] hover:text-[#f0ede8] transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Order summary */}
            <div
              className="mx-6 mt-5 p-4 text-sm"
              style={{ background: 'rgba(255,87,26,0.06)', border: '1px solid rgba(255,87,26,0.15)' }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-[family-name:var(--font-body)] text-[#9ca3af]">Plan</span>
                <span className="font-[family-name:var(--font-body)] font-bold text-[#f0ede8] text-right ml-4">{planName}</span>
              </div>
              {batchCategory && (
                <div className="flex justify-between items-start mb-2">
                  <span className="font-[family-name:var(--font-body)] text-[#9ca3af]">Batch</span>
                  <span className="font-[family-name:var(--font-body)] text-[#c4c0bb] capitalize">{batchCategory.replace('_', ' ')}</span>
                </div>
              )}
              <div className="flex justify-between items-start mb-2">
                <span className="font-[family-name:var(--font-body)] text-[#9ca3af]">Duration</span>
                <span className="font-[family-name:var(--font-body)] text-[#c4c0bb]">{periodLabel[billingPeriod] ?? billingPeriod}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/[0.06]">
                <span className="font-[family-name:var(--font-body)] font-bold text-[#f0ede8]">Total</span>
                <span className="font-[family-name:var(--font-outfit)] font-black text-[#ff571a] text-lg">
                  ₹{price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Customer details */}
            <div className="px-6 py-5 space-y-4">
              <p className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.1em] uppercase text-[#9ca3af]">
                Your Details
              </p>

              <div>
                <label className="block font-[family-name:var(--font-body)] text-xs text-[#6b7280] mb-1.5">
                  Full Name <span className="text-[#ff571a]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setErrors(prev => ({ ...prev, name: validateName(name) ?? undefined }))}
                  placeholder="Your full name"
                  className="w-full px-3 py-2.5 font-[family-name:var(--font-body)] text-sm text-[#f0ede8] bg-[#0d0c0b] border border-white/10 focus:border-[#ff571a]/50 focus:outline-none transition-colors"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label className="block font-[family-name:var(--font-body)] text-xs text-[#6b7280] mb-1.5">
                  Email <span className="text-[#ff571a]">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setErrors(prev => ({ ...prev, email: validateEmail(email) ?? undefined }))}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2.5 font-[family-name:var(--font-body)] text-sm text-[#f0ede8] bg-[#0d0c0b] border border-white/10 focus:border-[#ff571a]/50 focus:outline-none transition-colors"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label className="block font-[family-name:var(--font-body)] text-xs text-[#6b7280] mb-1.5">
                  Phone <span className="text-[#ff571a]">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => setErrors(prev => ({ ...prev, phone: validatePhone(phone) ?? undefined }))}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2.5 font-[family-name:var(--font-body)] text-sm text-[#f0ede8] bg-[#0d0c0b] border border-white/10 focus:border-[#ff571a]/50 focus:outline-none transition-colors"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
              </div>

              {/* Payment button */}
              <div className="pt-2">
                {name && email && phone ? (
                  <RazorpayButton
                    type="membership"
                    planId={planId}
                    customerName={name}
                    customerEmail={email}
                    customerPhone={phone}
                    label={`Pay ₹${price.toLocaleString('en-IN')}`}
                    className="w-full"
                    disabled={!validate && (!!errors.name || !!errors.email || !!errors.phone)}
                  />
                ) : (
                  <button
                    onClick={() => validate()}
                    className="w-full inline-flex items-center justify-center font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-6 py-4 bg-[#ff571a]/50 text-black/60 cursor-not-allowed"
                    disabled
                  >
                    Fill details to pay ₹{price.toLocaleString('en-IN')}
                  </button>
                )}
              </div>

              <p className="font-[family-name:var(--font-body)] text-xs text-[#4b5563] text-center leading-relaxed">
                🔒 Secured by Razorpay · UPI, Cards, Net Banking accepted
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
