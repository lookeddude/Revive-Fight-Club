'use client'

import Script from 'next/script'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface RazorpayButtonProps {
  type: 'membership' | 'trial'
  planId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  trialData?: {
    programId?: string | null
    preferredDate?: string | null
    preferredTime?: string | null
    message?: string | null
  }
  label?: string
  className?: string
  disabled?: boolean
}

type PaymentState =
  | 'idle'
  | 'creating-order'
  | 'checkout-open'
  | 'verifying'
  | 'success'
  | 'failed'
  | 'cancelled'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

export function RazorpayButton({
  type,
  planId,
  customerName,
  customerEmail,
  customerPhone,
  trialData,
  label,
  className = '',
  disabled = false,
}: RazorpayButtonProps) {
  const router = useRouter()
  const [state, setState] = useState<PaymentState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const buttonLabel: Record<PaymentState, string> = {
    'idle': label ?? 'Pay Now',
    'creating-order': 'Creating order…',
    'checkout-open': 'Complete payment in popup…',
    'verifying': 'Verifying payment…',
    'success': 'Payment confirmed ✓',
    'failed': 'Payment failed — Retry',
    'cancelled': 'Cancelled — Try again',
  }

  const handlePayment = useCallback(async () => {
    if (!scriptLoaded) {
      setError('Payment service not loaded. Please refresh the page.')
      return
    }

    setError(null)
    setState('creating-order')

    try {
      // Step 1: Create Razorpay order (server-side — price from DB)
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          planId,
          customerName,
          customerEmail,
          customerPhone,
          trialData,
        }),
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        setError(orderData.error ?? 'Failed to create payment order. Please try again.')
        setState('failed')
        return
      }

      setState('checkout-open')

      // Step 2: Open Razorpay Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Revive Fight Club',
        description: orderData.planName,
        order_id: orderData.orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: { color: '#ff571a' },
        modal: {
          ondismiss: () => {
            setState('cancelled')
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          setState('verifying')

          try {
            // Step 3: Verify signature server-side
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentRecordId: orderData.paymentId,
              }),
            })

            const verifyData = await verifyRes.json()

            if (!verifyRes.ok || !verifyData.success) {
              setError('Payment verification failed. Contact support with your order ID: ' + orderData.orderId)
              setState('failed')
              return
            }

            setState('success')
            // Redirect to success page — DB is source of truth
            router.push(`/payment/success?type=${type}&ref=${verifyData.paymentId}`)
          } catch {
            setError('Verification error. Your payment may have been received. Contact support.')
            setState('failed')
          }
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response: { error: { description: string } }) => {
        setError(response.error?.description ?? 'Payment failed. Please try again.')
        setState('failed')
      })
      rzp.open()
    } catch {
      setError('Something went wrong. Please try again.')
      setState('failed')
    }
  }, [scriptLoaded, type, planId, customerName, customerEmail, customerPhone, trialData, router])

  const isLoading = ['creating-order', 'checkout-open', 'verifying'].includes(state)
  const isDisabled = disabled || isLoading || state === 'success'

  return (
    <>
      {/* Load Razorpay checkout script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={handlePayment}
          disabled={isDisabled}
          className={`
            inline-flex items-center justify-center gap-2
            font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase
            px-6 py-4 transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed
            ${state === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-[#ff571a] text-black hover:bg-[#e04d17] active:scale-[0.98]'
            }
            ${className}
          `}
        >
          {isLoading && (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {buttonLabel[state]}
        </button>

        {/* Error message */}
        {error && (
          <p className="font-[family-name:var(--font-body)] text-xs text-red-400 leading-relaxed">
            {error}
          </p>
        )}

        {/* Retry button after failure/cancel */}
        {(state === 'failed' || state === 'cancelled') && (
          <button
            onClick={() => { setState('idle'); setError(null) }}
            className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] hover:text-[#f0ede8] underline transition-colors"
          >
            Reset and try again
          </button>
        )}
      </div>
    </>
  )
}
