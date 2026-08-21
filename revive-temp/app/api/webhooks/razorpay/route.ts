import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/razorpay'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendMembershipConfirmation, sendTrialConfirmation } from '@/lib/email'

/**
 * Razorpay Webhook Handler
 *
 * IMPORTANT: This endpoint MUST read the raw body for HMAC verification.
 * Next.js App Router provides raw body via req.text().
 *
 * Webhook URL (add in Razorpay Dashboard → Settings → Webhooks):
 *   TEST:       https://<your-vercel-deployment>/api/webhooks/razorpay
 *   PRODUCTION: https://revivefightclub.com/api/webhooks/razorpay
 *
 * Events to enable in Razorpay Dashboard:
 *   - payment.captured
 *   - payment.failed
 *   - refund.created
 */
export async function POST(req: NextRequest) {
  let rawBody: string

  try {
    rawBody = await req.text()
  } catch {
    return NextResponse.json({ error: 'Failed to read request body' }, { status: 400 })
  }

  // ── Verify webhook signature ──────────────────────────────
  const signature = req.headers.get('x-razorpay-signature') ?? ''
  const isValid = await verifyWebhookSignature({ rawBody, signature })

  if (!isValid) {
    console.warn('[webhook] Invalid signature — rejecting request')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: { event: string; payload: Record<string, unknown> }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.event) {

      // ── payment.captured ────────────────────────────────────
      case 'payment.captured': {
        const paymentEntity = (event.payload as { payment?: { entity?: Record<string, unknown> } })
          ?.payment?.entity
        if (!paymentEntity) break

        const orderId   = paymentEntity.order_id as string
        const paymentId = paymentEntity.id as string

        // Idempotency: check if already paid
        const { data: existing } = await supabase
          .from('payments')
          .select('id, status, payment_type, reference_id, customer_name, customer_email, amount')
          .eq('razorpay_order_id', orderId)
          .single()

        if (!existing || existing.status === 'paid') {
          // Already processed or unknown — idempotent skip
          break
        }

        // Atomic update via DB function
        await supabase.rpc('process_payment_success', {
          p_razorpay_order_id: orderId,
          p_razorpay_payment_id: paymentId,
          p_razorpay_signature: '', // webhook doesn't have checkout signature — use empty
        })

        // Send confirmation email (non-blocking)
        try {
          if (existing.payment_type === 'membership' && existing.reference_id) {
            const { data: purchase } = await supabase
              .from('member_purchases')
              .select('*, membership_plans(name, billing_period)')
              .eq('id', existing.reference_id)
              .single()
            if (purchase) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const plan = purchase.membership_plans as any
              await sendMembershipConfirmation({
                customerName: existing.customer_name,
                customerEmail: existing.customer_email,
                planName: plan?.name ?? 'Membership',
                amount: existing.amount / 100,
                startDate: purchase.start_date ?? '',
                endDate: purchase.end_date ?? '',
                referenceId: existing.id,
                billingPeriod: plan?.billing_period ?? '',
              })
            }
          }
          if (existing.payment_type === 'trial' && existing.reference_id) {
            const { data: trial } = await supabase
              .from('trial_requests')
              .select('*, programs(name)')
              .eq('id', existing.reference_id)
              .single()
            if (trial) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const program = trial.programs as any
              await sendTrialConfirmation({
                customerName: existing.customer_name,
                customerEmail: existing.customer_email,
                programName: program?.name ?? 'Trial Class',
                preferredDate: trial.preferred_date,
                preferredTime: trial.preferred_time,
                amount: existing.amount / 100,
                referenceId: existing.id,
              })
            }
          }
        } catch (emailErr) {
          console.error('[webhook] email send failed (non-fatal):', emailErr)
        }
        break
      }

      // ── payment.failed ──────────────────────────────────────
      case 'payment.failed': {
        const paymentEntity = (event.payload as { payment?: { entity?: Record<string, unknown> } })
          ?.payment?.entity
        if (!paymentEntity) break

        const orderId       = paymentEntity.order_id as string
        const failureReason = (paymentEntity.error_description as string) ?? 'Payment failed'

        await supabase
          .from('payments')
          .update({
            status: 'failed',
            failure_reason: failureReason,
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_order_id', orderId)
          .neq('status', 'paid') // never downgrade a paid status

        break
      }

      // ── refund.created ──────────────────────────────────────
      case 'refund.created': {
        const refundEntity = (event.payload as { refund?: { entity?: Record<string, unknown> } })
          ?.refund?.entity
        if (!refundEntity) break

        const paymentId = refundEntity.payment_id as string

        await supabase
          .from('payments')
          .update({
            status: 'refunded',
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_payment_id', paymentId)

        break
      }

      default:
        // Unhandled event — log and acknowledge
        console.log('[webhook] unhandled event:', event.event)
    }

    // Razorpay expects a 200 OK response
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[webhook] processing error:', err)
    // Still return 200 so Razorpay doesn't retry indefinitely
    return NextResponse.json({ received: true, error: 'Processing error' })
  }
}
