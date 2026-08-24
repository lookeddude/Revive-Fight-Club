import { NextRequest, NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendMembershipConfirmation, sendTrialConfirmation } from '@/lib/email'
import { rateLimit, rateLimitResponse, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting ────────────────────────────────────────────
    const ip = getClientIp(req)
    const rl = await rateLimit(ip, RATE_LIMITS.PAYMENT_VERIFY)
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfterSeconds)
    }

    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentRecordId } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing verification parameters' }, { status: 400 })
    }

    // ── Verify HMAC signature ─────────────────────────────────
    const isValid = await verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    })

    if (!isValid) {
      console.warn('[verify] Invalid signature for order:', razorpay_order_id)
      return NextResponse.json({ error: 'Payment verification failed. Contact support.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // ── Find payment record ────────────────────────────────────
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, metadata')
      .eq('razorpay_order_id', razorpay_order_id)
      .single()

    if (paymentError || !payment) {
      console.error('[verify] Payment record not found:', razorpay_order_id)
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 })
    }

    // ── Idempotency: already processed? ──────────────────────
    if (payment.status === 'paid') {
      return NextResponse.json({ success: true, already: true, paymentId: payment.id })
    }

    // ── Call DB function for atomic update ────────────────────
    const { data: result, error: fnError } = await supabase.rpc('process_payment_success', {
      p_razorpay_order_id: razorpay_order_id,
      p_razorpay_payment_id: razorpay_payment_id,
      p_razorpay_signature: razorpay_signature,
    })

    if (fnError) {
      console.error('[verify] process_payment_success failed:', fnError)
      return NextResponse.json({ error: 'Failed to activate payment' }, { status: 500 })
    }

    // ── Send confirmation email (non-blocking — failure safe) ─
    try {
      if (payment.payment_type === 'membership' && payment.reference_id) {
        const { data: purchase } = await supabase
          .from('member_purchases')
          .select('*, membership_plans(name, billing_period)')
          .eq('id', payment.reference_id)
          .single()

        if (purchase) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const plan = purchase.membership_plans as any
          await sendMembershipConfirmation({
            customerName: payment.customer_name,
            customerEmail: payment.customer_email,
            planName: plan?.name ?? 'Membership',
            amount: payment.amount / 100,
            startDate: purchase.start_date ?? '',
            endDate: purchase.end_date ?? '',
            referenceId: payment.id,
            billingPeriod: plan?.billing_period ?? '',
          })
        }
      }

      if (payment.payment_type === 'trial' && payment.reference_id) {
        const { data: trial } = await supabase
          .from('trial_requests')
          .select('*, programs(name)')
          .eq('id', payment.reference_id)
          .single()

        if (trial) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const program = trial.programs as any
          await sendTrialConfirmation({
            customerName: payment.customer_name,
            customerEmail: payment.customer_email,
            programName: program?.name ?? 'Trial Class',
            preferredDate: trial.preferred_date,
            preferredTime: trial.preferred_time,
            amount: payment.amount / 100,
            referenceId: payment.id,
          })
        }
      }
    } catch (emailErr) {
      // Email failure NEVER reverses a successful payment
      console.error('[verify] email send failed (non-fatal):', emailErr)
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      type: payment.payment_type,
    })
  } catch (err) {
    console.error('[verify] unexpected error:', err)
    return NextResponse.json({ error: 'Verification failed. Contact support.' }, { status: 500 })
  }
}
