'use client'

import { useState } from 'react'
import { RazorpayButton } from './RazorpayButton'
import { validateName, validateEmail, validatePhone } from '@/lib/validation'

interface Plan {
  id: string
  name: string
  price: number
  billingPeriod: string
}

interface MembershipCheckoutProps {
  plans: Plan[]
  batchCategory?: string
  batchTitle?: string
}

const PERIOD_LABEL: Record<string, string> = {
  monthly:   '1 Month',
  quarterly: '3 Months',
  semiannual: '6 Months',
  annually:  '1 Year',
}

const PERIOD_ORDER = ['monthly', 'quarterly', 'semiannual', 'annually']

export function MembershipCheckout({ plans, batchCategory, batchTitle }: MembershipCheckoutProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Sort plans by billing period order
  const sortedPlans = [...plans]
    .filter(p => p.price > 0)
    .sort((a, b) => PERIOD_ORDER.indexOf(a.billingPeriod) - PERIOD_ORDER.indexOf(b.billingPeriod))

  // Default selection: annually if exists, else last plan
  const defaultPlan = sortedPlans.find(p => p.billingPeriod === 'annually') ?? sortedPlans[sortedPlans.length - 1]
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlan?.id ?? '')

  // Step: 'pick' → 'details' → payment via RazorpayButton
  const [step, setStep] = useState<'pick' | 'details'>('pick')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({})

  const selectedPlan = sortedPlans.find(p => p.id === selectedPlanId) ?? sortedPlans[0]

  const validate = () => {
    const e = {
      name:  validateName(name) ?? undefined,
      email: validateEmail(email) ?? undefined,
      phone: validatePhone(phone) ?? undefined,
    }
    setErrors(e)
    return !e.name && !e.email && !e.phone
  }

  function handleClose() {
    setIsOpen(false)
    // Reset step but keep plan selection
    setStep('pick')
    setErrors({})
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.12em] uppercase px-5 py-2.5 transition-all duration-200 bg-[#ff571a] text-black hover:bg-[#e04d17] active:scale-[0.98]"
      >
        BUY NOW
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.88)' }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <div
            className="w-full max-w-md relative my-auto"
            style={{ background: '#111210', border: '1px solid rgba(255,87,26,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <h3 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase tracking-tight text-base">
                  {batchTitle ? `Buy — ${batchTitle}` : 'Choose Your Plan'}
                </h3>
                {step === 'details' && (
                  <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] mt-0.5">
                    Fill your details to proceed
                  </p>
                )}
              </div>
              <button onClick={handleClose} className="text-[#6b7280] hover:text-[#f0ede8] transition-colors ml-4" aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── STEP 1: Plan Picker ── */}
            {step === 'pick' && (
              <div className="p-6 space-y-4">
                <p className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.15em] uppercase text-[#6b7280]">
                  Choose Duration
                </p>

                <div className="space-y-2">
                  {sortedPlans.map((plan) => {
                    const isYearly = plan.billingPeriod === 'annually'
                    const isSelected = plan.id === selectedPlanId

                    return (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className="w-full text-left flex items-center justify-between px-4 py-3.5 transition-all duration-150 relative"
                        style={{
                          background: isSelected
                            ? 'rgba(255,87,26,0.08)'
                            : 'rgba(255,255,255,0.02)',
                          border: isSelected
                            ? '1px solid rgba(255,87,26,0.4)'
                            : '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        {/* Radio + Label */}
                        <div className="flex items-center gap-3">
                          {/* Custom radio */}
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all"
                            style={{
                              border: isSelected ? '2px solid #ff571a' : '2px solid rgba(255,255,255,0.2)',
                            }}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-[#ff571a]" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className="font-[family-name:var(--font-body)] font-semibold text-sm"
                                style={{ color: isSelected ? '#f0ede8' : '#9ca3af' }}
                              >
                                {PERIOD_LABEL[plan.billingPeriod] ?? plan.name}
                              </span>

                              {/* Recommended badge — only on yearly */}
                              {isYearly && (
                                <span
                                  className="font-[family-name:var(--font-body)] text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5"
                                  style={{ background: '#ff571a', color: '#000' }}
                                >
                                  RECOMMENDED
                                </span>
                              )}
                            </div>

                            {/* Monthly equiv for yearly */}
                            {isYearly && (
                              <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] mt-0.5">
                                ₹{Math.round(plan.price / 12).toLocaleString('en-IN')}/month · Best value
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right shrink-0 ml-4">
                          <span
                            className="font-[family-name:var(--font-outfit)] font-black"
                            style={{
                              fontSize: '18px',
                              color: isSelected ? '#ff571a' : '#c4c0bb',
                            }}
                          >
                            ₹{plan.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Selected summary + Next CTA */}
                {selectedPlan && (
                  <div className="pt-2 space-y-3">
                    <div
                      className="flex items-center justify-between px-4 py-3 text-sm"
                      style={{ background: 'rgba(255,87,26,0.06)', border: '1px solid rgba(255,87,26,0.15)' }}
                    >
                      <span className="font-[family-name:var(--font-body)] text-[#9ca3af]">
                        Selected: {PERIOD_LABEL[selectedPlan.billingPeriod] ?? selectedPlan.name}
                      </span>
                      <span className="font-[family-name:var(--font-outfit)] font-black text-[#ff571a]">
                        ₹{selectedPlan.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => setStep('details')}
                      className="w-full inline-flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-6 py-4 bg-[#ff571a] text-black hover:bg-[#e04d17] transition-colors active:scale-[0.99]"
                    >
                      Continue to Payment →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2: Customer Details + Pay ── */}
            {step === 'details' && selectedPlan && (
              <div className="p-6 space-y-4">
                {/* Back + selected plan summary */}
                <button
                  onClick={() => setStep('pick')}
                  className="flex items-center gap-1.5 font-[family-name:var(--font-body)] text-xs text-[#6b7280] hover:text-[#9ca3af] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Change plan
                </button>

                {/* Selected plan pill */}
                <div
                  className="flex items-center justify-between px-4 py-2.5"
                  style={{ background: 'rgba(255,87,26,0.06)', border: '1px solid rgba(255,87,26,0.15)' }}
                >
                  <div>
                    <span className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af]">Plan · </span>
                    <span className="font-[family-name:var(--font-body)] text-sm font-bold text-[#f0ede8]">
                      {PERIOD_LABEL[selectedPlan.billingPeriod] ?? selectedPlan.name}
                    </span>
                  </div>
                  <span className="font-[family-name:var(--font-outfit)] font-black text-[#ff571a]">
                    ₹{selectedPlan.price.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Fields */}
                <div className="space-y-3">
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
                </div>

                {/* Payment button */}
                <div className="pt-1">
                  {name.trim() && email.trim() && phone.trim() ? (
                    <RazorpayButton
                      type="membership"
                      planId={selectedPlan.id}
                      customerName={name}
                      customerEmail={email}
                      customerPhone={phone}
                      label={`Pay ₹${selectedPlan.price.toLocaleString('en-IN')}`}
                      className="w-full"
                    />
                  ) : (
                    <button
                      onClick={validate}
                      className="w-full inline-flex items-center justify-center font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-6 py-4 bg-[#ff571a]/40 text-black/50 cursor-not-allowed"
                      disabled
                    >
                      Fill details to pay ₹{selectedPlan.price.toLocaleString('en-IN')}
                    </button>
                  )}
                </div>

                <p className="font-[family-name:var(--font-body)] text-xs text-[#4b5563] text-center leading-relaxed">
                  🔒 Secured by Razorpay · UPI, Cards, Net Banking accepted
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
