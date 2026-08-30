'use server'

import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitResponse, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'
import { generateQrToken, generateQrDataUrl } from '@/lib/qr'
import { sendWorkshopConfirmation, sendWorkshopAdminNotification } from '@/lib/email-workshops'
import { NextRequest, NextResponse } from 'next/server'

export interface FreeRegistrationData {
  workshopId: string
  fullName: string
  email: string
  phone: string
  customAnswers: Record<string, unknown>
}

export interface FreeRegistrationResult {
  success: boolean
  registrationId?: string
  error?: string
}

/**
 * Server action: register for a FREE workshop (guest or authenticated).
 * Authentication is NOT required for free workshops.
 */
export async function submitFreeWorkshopRegistration(
  data: FreeRegistrationData
): Promise<FreeRegistrationResult> {
  // Get user if logged in (optional)
  const supabaseClient = await createClient()
  const { data: { user } } = await supabaseClient.auth.getUser()

  const adminClient = createAdminClient()

  // Load workshop server-side — never trust client pricing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: workshop } = await (adminClient as any)
    .from('workshops')
    .select('id,slug,title,status,pricing_type,capacity,waitlist_enabled,registration_deadline,start_datetime,end_datetime,location,workshop_mode')
    .eq('id', data.workshopId)
    .single()

  if (!workshop) return { success: false, error: 'Workshop not found' }
  if (workshop.status !== 'published') return { success: false, error: 'This workshop is not available for registration' }

  // CRITICAL: server verifies pricing type
  if (workshop.pricing_type !== 'free') {
    return { success: false, error: 'This workshop requires payment. Please log in to continue.' }
  }

  // Validate deadline
  if (workshop.registration_deadline) {
    const deadline = new Date(workshop.registration_deadline)
    if (deadline < new Date()) {
      return { success: false, error: 'Registration deadline has passed' }
    }
  }

  // Validate inputs
  if (!data.fullName?.trim() || data.fullName.trim().length < 2) {
    return { success: false, error: 'Please provide your full name' }
  }
  if (!data.email?.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(data.email.trim())) {
    return { success: false, error: 'Please provide a valid email address' }
  }
  if (!data.phone?.trim() || data.phone.trim().length < 7) {
    return { success: false, error: 'Please provide a valid phone number' }
  }

  // Generate QR token (no PII)
  const qrToken = generateQrToken(
    `PENDING-${Date.now()}`, // temp, will be replaced after DB insert gives real ID
    data.workshopId
  )

  // Atomic registration via DB function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: result } = await (adminClient as any).rpc('register_for_workshop', {
    p_workshop_id: data.workshopId,
    p_user_id: user?.id ?? null,
    p_full_name: data.fullName.trim(),
    p_email: data.email.trim().toLowerCase(),
    p_phone: data.phone.trim(),
    p_custom_answers: data.customAnswers ?? {},
    p_ip_fingerprint: null,
    p_qr_token: qrToken,
    p_is_paid: false,
  })

  if (!result?.success) {
    const errMap: Record<string, string> = {
      DUPLICATE_REGISTRATION: 'You are already registered for this workshop.',
      WORKSHOP_FULL: 'This workshop is fully booked.',
      REGISTRATION_CLOSED: 'Registration is closed for this workshop.',
      WORKSHOP_NOT_AVAILABLE: 'This workshop is not currently available.',
    }
    return { success: false, error: errMap[result?.error] ?? 'Registration failed. Please try again.' }
  }

  const registrationId: string = result.registrationId
  const registrationUuid: string = result.registrationUuid

  // Update QR token with real registration ID
  const finalQrToken = generateQrToken(registrationId, data.workshopId)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (adminClient as any)
    .from('workshop_registrations')
    .update({ qr_token: finalQrToken })
    .eq('id', registrationUuid)

  // Generate QR image for email
  let qrDataUrl: string | undefined
  try {
    qrDataUrl = await generateQrDataUrl(finalQrToken)
  } catch {
    // Non-fatal
  }

  // Send confirmation email (non-blocking)
  sendWorkshopConfirmation({
    customerName: data.fullName.trim(),
    customerEmail: data.email.trim(),
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
  const adminEmail = process.env.RESEND_FROM_EMAIL ?? process.env.ADMIN_EMAIL
  if (adminEmail) {
    sendWorkshopAdminNotification({
      adminEmail,
      workshopTitle: workshop.title,
      participantName: data.fullName.trim(),
      participantEmail: data.email.trim(),
      registrationId,
      pricingType: 'free',
    }).catch(() => {})
  }

  return { success: true, registrationId }
}
