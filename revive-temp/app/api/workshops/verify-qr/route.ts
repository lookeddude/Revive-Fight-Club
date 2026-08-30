import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/getAdminSession'
import { verifyQrToken } from '@/lib/qr'
import { rateLimit, rateLimitResponse, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    // Admin required
    const session = await requireAdmin()

    // Rate limit: 20/min per admin user
    const ip = getClientIp(req)
    const rl = await rateLimit(`qr-verify:${session.id}:${ip}`, RATE_LIMITS.WORKSHOP_QR_VERIFY ?? { limit: 20, windowMs: 60*1000, endpoint: 'workshop:qr-verify' })
    if (!rl.allowed) return rateLimitResponse(rl.retryAfterSeconds)

    const body = await req.json()
    const { token, registrationId } = body

    const adminClient = createAdminClient()

    let registration = null

    if (token) {
      // Verify QR token
      const verified = verifyQrToken(token)
      if (!verified.valid) {
        return NextResponse.json({ error: 'Invalid or tampered QR code' }, { status: 400 })
      }

      // Look up registration by token
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (adminClient as any)
        .from('workshop_registrations')
        .select('id,registration_id,full_name,email,phone,registration_status,payment_status,attendance_marked_at,workshop_id,workshops(id,title,start_datetime,end_datetime)')
        .eq('qr_token', token)
        .maybeSingle()
      registration = data
    } else if (registrationId) {
      // Manual lookup by registration ID
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (adminClient as any)
        .from('workshop_registrations')
        .select('id,registration_id,full_name,email,phone,registration_status,payment_status,attendance_marked_at,workshop_id,workshops(id,title,start_datetime,end_datetime)')
        .eq('registration_id', registrationId.trim().toUpperCase())
        .maybeSingle()
      registration = data
    } else {
      return NextResponse.json({ error: 'Provide token or registrationId' }, { status: 400 })
    }

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      registration: {
        id: registration.id,
        registrationId: registration.registration_id,
        fullName: registration.full_name,
        email: registration.email,
        phone: registration.phone,
        status: registration.registration_status,
        paymentStatus: registration.payment_status,
        attendanceMarkedAt: registration.attendance_marked_at,
        workshop: registration.workshops,
      }
    })
  } catch (err) {
    console.error('[verify-qr] error:', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
