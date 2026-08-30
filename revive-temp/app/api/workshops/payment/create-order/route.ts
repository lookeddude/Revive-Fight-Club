import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { getRazorpay, rupeesToPaise } from '@/lib/razorpay'
import { rateLimit, rateLimitResponse, getClientIp, RATE_LIMITS, cleanupExpiredEntries } from '@/lib/rate-limit'
import { generateQrToken } from '@/lib/qr'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { workshopId, fullName, email, phone, customAnswers } = body

    // Rate limiting: IP, 5/10min
    const ip = getClientIp(req)
    const rl = await rateLimit(`ws-pay:${ip}`, RATE_LIMITS.WORKSHOP_PAYMENT ?? { limit: 5, windowMs: 10*60*1000, endpoint: 'workshop:payment' })
    if (!rl.allowed) return rateLimitResponse(rl.retryAfterSeconds)
    cleanupExpiredEntries().catch(() => {})

    // Get optional user session
    const supabaseClient = await createClient()
    const { data: { user } } = await supabaseClient.auth.getUser()

    // Validate inputs
    if (!workshopId || !fullName?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Load workshop — NEVER trust client price
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: workshop } = await (adminClient as any)
      .from('workshops')
      .select('id,slug,title,status,pricing_type,price,currency,capacity,waitlist_enabled,registration_deadline,start_datetime,end_datetime,location,workshop_mode')
      .eq('id', workshopId)
      .single()

    if (!workshop) return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    if (workshop.status !== 'published') return NextResponse.json({ error: 'Workshop is not available' }, { status: 400 })

    // CRITICAL: server verifies pricing type
    if (workshop.pricing_type !== 'paid') {
      return NextResponse.json({ error: 'This workshop is free. No payment required.' }, { status: 400 })
    }
    if (!workshop.price || workshop.price <= 0) {
      return NextResponse.json({ error: 'Workshop price not configured' }, { status: 400 })
    }

    // Deadline check
    if (workshop.registration_deadline) {
      if (new Date(workshop.registration_deadline) < new Date()) {
        return NextResponse.json({ error: 'Registration deadline has passed' }, { status: 400 })
      }
    }

    // Check for existing active registration (only for logged-in users; email uniqueness handled by DB)
    if (user?.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existingReg } = await (adminClient as any)
        .from('workshop_registrations')
        .select('id,registration_status')
        .eq('workshop_id', workshopId)
        .eq('user_id', user.id)
        .in('registration_status', ['confirmed','pending','waitlisted'])
        .maybeSingle()

      if (existingReg) {
        return NextResponse.json({ error: 'You are already registered for this workshop.' }, { status: 409 })
      }
    }

    // Server-side price (never from body)
    const amountPaise = rupeesToPaise(Number(workshop.price))
    const receipt = `rfc_ws_${Date.now()}`

    // Create temp QR token
    const tempToken = generateQrToken(`temp-${Date.now()}`, workshopId)

    // Atomic seat reservation (pending, expires in 15 min)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: regResult } = await (adminClient as any).rpc('register_for_workshop', {
      p_workshop_id: workshopId,
      p_user_id: user?.id ?? null,
      p_full_name: fullName.trim(),
      p_email: email.trim().toLowerCase(),
      p_phone: phone.trim(),
      p_custom_answers: customAnswers ?? {},
      p_ip_fingerprint: ip,
      p_qr_token: tempToken,
      p_is_paid: true,
    })

    if (!regResult?.success) {
      const errMap: Record<string, { msg: string; status: number }> = {
        DUPLICATE_REGISTRATION: { msg: 'You are already registered for this workshop.', status: 409 },
        WORKSHOP_FULL: { msg: 'This workshop is fully booked.', status: 409 },
        REGISTRATION_CLOSED: { msg: 'Registration is closed for this workshop.', status: 400 },
      }
      const mapped = errMap[regResult?.error]
      return NextResponse.json({ error: mapped?.msg ?? 'Failed to reserve seat' }, { status: mapped?.status ?? 500 })
    }

    // Create Razorpay order
    const razorpay = getRazorpay()
    let razorpayOrder
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: amountPaise,
        currency: workshop.currency ?? 'INR',
        receipt,
        notes: {
          type: 'workshop',
          workshop_id: workshopId,
          workshop_title: workshop.title,
          customer_name: fullName.trim(),
          customer_email: email.trim(),
        },
      })
    } catch (rzpErr) {
      console.error('[ws-payment] Razorpay order failed:', rzpErr)
      // Cancel the pending reservation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (adminClient as any)
        .from('workshop_registrations')
        .update({ registration_status: 'cancelled' })
        .eq('id', regResult.registrationUuid)
      return NextResponse.json({ error: 'Payment service unavailable. Please try again.' }, { status: 503 })
    }

    // Save payment record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: payment, error: paymentError } = await (adminClient as any)
      .from('payments')
      .insert({
        razorpay_order_id: razorpayOrder.id,
        customer_name: fullName.trim(),
        customer_email: email.trim().toLowerCase(),
        customer_phone: phone.trim(),
        payment_type: 'workshop',
        reference_id: regResult.registrationUuid,
        amount: amountPaise,
        currency: workshop.currency ?? 'INR',
        status: 'created',
        metadata: { receipt, workshop_title: workshop.title, workshop_id: workshopId },
      })
      .select('id')
      .single()

    if (paymentError || !payment) {
      console.error('[ws-payment] payment insert failed:', paymentError)
      return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 })
    }

    // Link payment to registration
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any)
      .from('workshop_registrations')
      .update({ payment_id: payment.id })
      .eq('id', regResult.registrationUuid)

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: amountPaise,
      currency: workshop.currency ?? 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      paymentId: payment.id,
      workshopTitle: workshop.title,
      registrationUuid: regResult.registrationUuid,
      registrationId: regResult.registrationId,
    })
  } catch (err) {
    console.error('[ws-payment] unexpected error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
