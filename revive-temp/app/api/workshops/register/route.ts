import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitResponse, getClientIp, RATE_LIMITS, cleanupExpiredEntries } from '@/lib/rate-limit'
import { generateQrToken, generateQrDataUrl } from '@/lib/qr'
import { sendWorkshopConfirmation, sendWorkshopAdminNotification } from '@/lib/email-workshops'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { workshopId, fullName, email, phone, customAnswers } = body

    // Validate inputs
    if (!workshopId || !fullName?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Rate limiting: IP + email, 5/hour
    const ip = getClientIp(req)
    const rl = await rateLimit(`${ip}:${email.trim().toLowerCase()}`, RATE_LIMITS.WORKSHOP_REGISTER ?? { limit: 5, windowMs: 60*60*1000, endpoint: 'workshop:register' })
    if (!rl.allowed) return rateLimitResponse(rl.retryAfterSeconds)
    cleanupExpiredEntries().catch(() => {})

    // Get optional user session
    const supabaseClient = await createClient()
    const { data: { user } } = await supabaseClient.auth.getUser()

    const adminClient = createAdminClient()

    // Load workshop from DB — NEVER trust client pricing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: workshop } = await (adminClient as any)
      .from('workshops')
      .select('id,slug,title,status,pricing_type,capacity,waitlist_enabled,registration_deadline,start_datetime,end_datetime,location,workshop_mode')
      .eq('id', workshopId)
      .single()

    if (!workshop) return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    if (workshop.status !== 'published') return NextResponse.json({ error: 'Workshop is not available' }, { status: 400 })

    // CRITICAL: server-side pricing check
    if (workshop.pricing_type !== 'free') {
      return NextResponse.json({ error: 'This workshop requires payment. Please use the authenticated payment flow.' }, { status: 400 })
    }

    // Deadline check (server-side, Asia/Kolkata)
    if (workshop.registration_deadline) {
      if (new Date(workshop.registration_deadline) < new Date()) {
        return NextResponse.json({ error: 'Registration deadline has passed' }, { status: 400 })
      }
    }

    // Sanitize custom answers: allow only string/number/boolean
    const safeAnswers: Record<string, unknown> = {}
    if (customAnswers && typeof customAnswers === 'object') {
      for (const [k, v] of Object.entries(customAnswers)) {
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
          safeAnswers[k.substring(0, 100)] = typeof v === 'string' ? v.substring(0, 2000) : v
        }
      }
    }

    // Temporary QR token (updated after we get real registration ID)
    const tempToken = generateQrToken(`temp-${Date.now()}`, workshopId)

    // Atomic registration via DB function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: result } = await (adminClient as any).rpc('register_for_workshop', {
      p_workshop_id: workshopId,
      p_user_id: user?.id ?? null,
      p_full_name: fullName.trim(),
      p_email: email.trim().toLowerCase(),
      p_phone: phone.trim(),
      p_custom_answers: safeAnswers,
      p_ip_fingerprint: ip,
      p_qr_token: tempToken,
      p_is_paid: false,
    })

    if (!result?.success) {
      const errMap: Record<string, { msg: string; status: number }> = {
        DUPLICATE_REGISTRATION: { msg: 'You are already registered for this workshop.', status: 409 },
        WORKSHOP_FULL: { msg: 'This workshop is fully booked.', status: 409 },
        REGISTRATION_CLOSED: { msg: 'Registration is closed for this workshop.', status: 400 },
        WORKSHOP_NOT_AVAILABLE: { msg: 'This workshop is not currently available.', status: 400 },
      }
      const mapped = errMap[result?.error]
      return NextResponse.json({ error: mapped?.msg ?? 'Registration failed. Please try again.' }, { status: mapped?.status ?? 500 })
    }

    const registrationId: string = result.registrationId
    const registrationUuid: string = result.registrationUuid

    // Update with real QR token
    const finalQrToken = generateQrToken(registrationId, workshopId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any)
      .from('workshop_registrations')
      .update({ qr_token: finalQrToken })
      .eq('id', registrationUuid)

    // Generate QR image (non-blocking, for email)
    let qrDataUrl: string | undefined
    try { qrDataUrl = await generateQrDataUrl(finalQrToken) } catch { /* non-fatal */ }

    // Email confirmation (non-blocking)
    sendWorkshopConfirmation({
      customerName: fullName.trim(),
      customerEmail: email.trim(),
      workshopTitle: workshop.title,
      startDatetime: workshop.start_datetime,
      endDatetime: workshop.end_datetime,
      location: workshop.location,
      workshopMode: workshop.workshop_mode,
      registrationId,
      pricingType: 'free',
      qrDataUrl,
    }).catch(() => {})

    // Admin notification (non-blocking)
    const adminEmail = process.env.RESEND_FROM_EMAIL
    if (adminEmail) {
      sendWorkshopAdminNotification({
        adminEmail,
        workshopTitle: workshop.title,
        participantName: fullName.trim(),
        participantEmail: email.trim(),
        registrationId,
        pricingType: 'free',
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, registrationId })
  } catch (err) {
    console.error('[workshop-register] unexpected error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
