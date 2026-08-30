import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateQrToken, generateQrDataUrl } from '@/lib/qr'
import { sendWorkshopConfirmation, sendWorkshopAdminNotification } from '@/lib/email-workshops'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationUuid, workshopId } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment parameters' }, { status: 400 })
    }

    // Verify HMAC signature
    const crypto = await import('crypto')
    const keySecret = process.env.RAZORPAY_KEY_SECRET ?? ''
    const body_str = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto.createHmac('sha256', keySecret).update(body_str).digest('hex')
    
    try {
      if (!crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(razorpay_signature, 'hex'))) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
      }
    } catch {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Confirm payment via idempotent DB function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: result } = await (adminClient as any).rpc('confirm_workshop_payment', {
      p_razorpay_order_id: razorpay_order_id,
      p_razorpay_payment_id: razorpay_payment_id,
      p_razorpay_signature: razorpay_signature,
    })

    if (!result?.success) {
      console.error('[ws-verify] confirm failed:', result)
      return NextResponse.json({ error: 'Payment confirmation failed' }, { status: 500 })
    }

    const registrationId: string = result.registrationId
    const registrationUuidConfirmed: string = result.registrationUuid ?? registrationUuid

    // Update QR token with real registration ID
    const finalQrToken = generateQrToken(registrationId, workshopId ?? '')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any)
      .from('workshop_registrations')
      .update({ qr_token: finalQrToken, amount_paid: null })
      .eq('id', registrationUuidConfirmed)

    // Load registration + workshop for email
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: reg } = await (adminClient as any)
        .from('workshop_registrations')
        .select('full_name,email,amount_paid,payment_id,workshops(title,start_datetime,end_datetime,location,workshop_mode)')
        .eq('id', registrationUuidConfirmed)
        .single()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: paymentRec } = await (adminClient as any)
        .from('payments')
        .select('amount')
        .eq('razorpay_order_id', razorpay_order_id)
        .single()

      if (reg) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const workshop = reg.workshops as any
        // Update amount_paid
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (adminClient as any)
          .from('workshop_registrations')
          .update({ amount_paid: paymentRec?.amount ? paymentRec.amount / 100 : null })
          .eq('id', registrationUuidConfirmed)

        // Generate QR
        let qrDataUrl: string | undefined
        try { qrDataUrl = await generateQrDataUrl(finalQrToken) } catch { /* non-fatal */ }

        // Send email (non-blocking)
        sendWorkshopConfirmation({
          customerName: reg.full_name,
          customerEmail: reg.email,
          workshopTitle: workshop?.title ?? 'Workshop',
          startDatetime: workshop?.start_datetime ?? '',
          endDatetime: workshop?.end_datetime ?? '',
          location: workshop?.location ?? null,
          workshopMode: workshop?.workshop_mode ?? 'in_person',
          registrationId,
          pricingType: 'paid',
          amountPaid: paymentRec?.amount ? paymentRec.amount / 100 : undefined,
          qrDataUrl,
        }).catch(() => {})

        // Admin notification
        const adminEmail = process.env.RESEND_FROM_EMAIL
        if (adminEmail) {
          sendWorkshopAdminNotification({
            adminEmail,
            workshopTitle: workshop?.title ?? 'Workshop',
            participantName: reg.full_name,
            participantEmail: reg.email,
            registrationId,
            pricingType: 'paid',
            amountPaid: paymentRec?.amount ? paymentRec.amount / 100 : undefined,
          }).catch(() => {})
        }
      }
    } catch (emailErr) {
      console.error('[ws-verify] post-confirm non-fatal error:', emailErr)
    }

    return NextResponse.json({ success: true, registrationId })
  } catch (err) {
    console.error('[ws-verify] unexpected error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
