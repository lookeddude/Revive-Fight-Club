import { NextRequest, NextResponse } from 'next/server'
import { getRazorpay, rupeesToPaise } from '@/lib/razorpay'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimit, rateLimitResponse, getClientIp, RATE_LIMITS, cleanupExpiredEntries } from '@/lib/rate-limit'

// ── TRIAL FEE (server-side constant — never trust browser) ────
const TRIAL_FEE_RUPEES = 1000
const TRIAL_FEE_PAISE = rupeesToPaise(TRIAL_FEE_RUPEES)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, planId, customerName, customerEmail, customerPhone, trialData } = body

    // ── Rate limiting ────────────────────────────────────────────
    const ip = getClientIp(req)
    const rateLimitKey = `${ip}:${(customerEmail || '').trim().toLowerCase()}`
    const rl = await rateLimit(rateLimitKey, RATE_LIMITS.PAYMENT_CREATE)
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfterSeconds)
    }
    // Opportunistic cleanup (non-blocking)
    cleanupExpiredEntries().catch(() => {})

    // ── Input validation ──────────────────────────────────────
    if (!type || !['membership', 'trial'].includes(type)) {
      return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 })
    }
    if (!customerName?.trim() || customerName.trim().length < 2) {
      return NextResponse.json({ error: 'Valid customer name is required' }, { status: 400 })
    }
    if (!customerEmail?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    if (!customerPhone?.trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    let amountPaise: number
    let planName: string
    let purchaseId: string | null = null

    // ── Membership flow ───────────────────────────────────────
    if (type === 'membership') {
      if (!planId) {
        return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
      }

      // Fetch authoritative price from DB — NEVER trust req.body.amount
      const { data: plan, error: planError } = await supabase
        .from('membership_plans')
        .select('id, name, price, billing_period, is_active')
        .eq('id', planId)
        .single()

      if (planError || !plan) {
        return NextResponse.json({ error: 'Membership plan not found' }, { status: 404 })
      }
      if (!plan.is_active) {
        return NextResponse.json({ error: 'This membership plan is no longer available' }, { status: 400 })
      }
      if (!plan.price || plan.price <= 0) {
        return NextResponse.json({ error: 'This plan does not have a valid price set' }, { status: 400 })
      }

      amountPaise = rupeesToPaise(plan.price)
      planName = plan.name

      // Create pending member_purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from('member_purchases')
        .insert({
          membership_plan_id: plan.id,
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim().toLowerCase(),
          customer_phone: customerPhone.trim(),
          status: 'pending',
        })
        .select('id')
        .single()

      if (purchaseError || !purchase) {
        console.error('[create-order] member_purchase insert failed:', purchaseError)
        return NextResponse.json({ error: 'Failed to create purchase record' }, { status: 500 })
      }

      purchaseId = purchase.id
    }

    // ── Trial flow ────────────────────────────────────────────
    else {
      // Server-side: always ₹1,000 — browser can't change this
      amountPaise = TRIAL_FEE_PAISE
      planName = 'Trial Class'

      // Validate trial data
      if (trialData?.programId) {
        const { data: program } = await supabase
          .from('programs')
          .select('id, name, is_active')
          .eq('id', trialData.programId)
          .single()

        if (!program?.is_active) {
          return NextResponse.json({ error: 'Selected program is not available' }, { status: 400 })
        }
        planName = `Trial — ${program.name}`
      }

      // Validate date is not in the past
      if (trialData?.preferredDate) {
        const selectedDate = new Date(trialData.preferredDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate < today) {
          return NextResponse.json({ error: 'Preferred date cannot be in the past' }, { status: 400 })
        }
      }
    }

    // ── Create Razorpay order ────────────────────────────────
    const razorpay = getRazorpay()
    const receipt = `rfc_${type}_${Date.now()}`

    let razorpayOrder
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: amountPaise,
        currency: 'INR',
        receipt,
        notes: {
          type,
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          plan: planName,
        },
      })
    } catch (rzpErr) {
      console.error('[create-order] Razorpay order creation failed:', rzpErr)
      return NextResponse.json({ error: 'Payment service unavailable. Please try again.' }, { status: 503 })
    }

    // ── Save payment record ──────────────────────────────────
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        razorpay_order_id: razorpayOrder.id,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim().toLowerCase(),
        customer_phone: customerPhone.trim(),
        payment_type: type,
        reference_id: purchaseId ?? undefined,
        amount: amountPaise,
        currency: 'INR',
        status: 'created',
        metadata: {
          receipt,
          plan_name: planName,
          trial_data: trialData ?? null,
        },
      })
      .select('id')
      .single()

    if (paymentError || !payment) {
      console.error('[create-order] payment insert failed:', paymentError)
      return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
    }

    // For trial: create trial_request with pending_payment status
    if (type === 'trial' && trialData) {
      const { data: trial } = await supabase
        .from('trial_requests')
        .insert({
          name: customerName.trim(),
          email: customerEmail.trim().toLowerCase(),
          phone: customerPhone.trim(),
          program_id: trialData.programId ?? null,
          preferred_date: trialData.preferredDate ?? null,
          preferred_time: trialData.preferredTime ?? null,
          message: trialData.message ?? null,
          status: 'pending_payment',
          payment_required: true,
          trial_fee: TRIAL_FEE_PAISE,
          payment_id: payment.id,
        })
        .select('id')
        .single()

      // Update payment reference_id to trial_request
      if (trial?.id) {
        await supabase
          .from('payments')
          .update({ reference_id: trial.id })
          .eq('id', payment.id)
      }
    }

    // ── Return safe data to client ───────────────────────────
    // NEVER return RAZORPAY_KEY_SECRET here
    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: amountPaise,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      paymentId: payment.id,
      planName,
    })
  } catch (err) {
    console.error('[create-order] unexpected error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 })
  }
}
