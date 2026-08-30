'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface WorkshopRegistrationFormProps {
  workshopId: string
  slug: string
  title: string
  pricingType: string
  price: number | null
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

export function WorkshopRegistrationForm({ workshopId, slug, title, pricingType, price }: WorkshopRegistrationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // ── FREE WORKSHOP ──────────────────────────────────────────
      if (pricingType === 'free') {
        const res = await fetch('/api/workshops/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workshopId, fullName, email, phone, customAnswers: {} }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Registration failed. Please try again.')
          return
        }
        // Redirect to success page with real registration ID
        router.push(`/workshops/${slug}/success?reg=${data.registrationId}`)
        return
      }

      // ── PAID WORKSHOP ──────────────────────────────────────────
      // 1. Create Razorpay order
      const orderRes = await fetch('/api/workshops/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workshopId, fullName, email, phone, customAnswers: {} }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) {
        setError(orderData.error || 'Payment setup failed. Please try again.')
        return
      }

      // 2. Load Razorpay script dynamically
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load payment gateway'))
          document.body.appendChild(script)
        })
      }

      // 3. Open Razorpay checkout
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Revive Fight Club',
          description: title,
          order_id: orderData.orderId,
          prefill: { name: fullName, email, contact: phone },
          theme: { color: '#DC2626' },
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            // 4. Verify payment
            const verifyRes = await fetch('/api/workshops/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                registrationUuid: orderData.registrationUuid,
                workshopId,
              }),
            })
            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) {
              reject(new Error(verifyData.error || 'Payment verification failed'))
              return
            }
            resolve()
            router.push(`/workshops/${slug}/success?reg=${orderData.registrationId}`)
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment was cancelled'))
            },
          },
        })
        rzp.open()
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 font-[family-name:var(--font-body)] text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="fullName" className="font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.1em] uppercase text-[#707078]">
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          required
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="bg-transparent border border-white/20 p-4 text-[#FCFDFD] font-[family-name:var(--font-body)] focus:border-[#DC2626] focus:outline-none transition-colors"
          placeholder="Enter your full name"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.1em] uppercase text-[#707078]">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="bg-transparent border border-white/20 p-4 text-[#FCFDFD] font-[family-name:var(--font-body)] focus:border-[#DC2626] focus:outline-none transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.1em] uppercase text-[#707078]">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="bg-transparent border border-white/20 p-4 text-[#FCFDFD] font-[family-name:var(--font-body)] focus:border-[#DC2626] focus:outline-none transition-colors"
          placeholder="+91 98765 43210"
        />
      </div>

      <div className="pt-4 border-t border-white/10">
        <div className="flex justify-between items-center mb-6">
          <span className="font-[family-name:var(--font-body)] text-sm text-[#A0A0A8]">Total Amount</span>
          <span className="font-[family-name:var(--font-outfit)] text-xl font-bold text-[#FCFDFD]">
            {pricingType === 'free' ? 'FREE' : `₹${price?.toLocaleString('en-IN')}`}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-black tracking-[0.14em] uppercase px-8 py-4 transition-all duration-300 ${
            loading ? 'bg-white/20 text-white/50 cursor-not-allowed' : 'bg-[#DC2626] text-white hover:bg-white hover:text-black'
          }`}
        >
          {loading ? 'PROCESSING…' : (pricingType === 'free' ? 'REGISTER NOW' : 'PROCEED TO PAYMENT')}
        </button>
      </div>
    </form>
  )
}
