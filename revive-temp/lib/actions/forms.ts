'use server'

import { createClient } from '@/lib/supabase/server'
import { rateLimit, getClientIpFromHeaders, RATE_LIMITS } from '@/lib/rate-limit'

// ── Trial Request Submission ───────────────────────────────────────────────
// Uses the SECURITY DEFINER RPC function — prevents status/admin_notes manipulation.

export type TrialRequestInput = {
  name: string
  phone: string
  email?: string | null
  program_id?: string | null
  preferred_date?: string | null
  preferred_time?: string | null
  message?: string | null
}

export type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function submitTrialRequest(
  input: TrialRequestInput
): Promise<ActionResult> {
  try {
    // ── Rate limiting ────────────────────────────────────────────
    const ip = await getClientIpFromHeaders()
    const rateLimitKey = `${ip}:${(input.phone || '').trim()}`
    const rl = await rateLimit(rateLimitKey, RATE_LIMITS.TRIAL_BOOKING)
    if (!rl.allowed) {
      return { success: false, error: 'Too many booking requests. Please try again later.' }
    }

    const supabase = await createClient()

    const { data, error } = await supabase.rpc('submit_trial_request', {
      p_name: input.name,
      p_phone: input.phone,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      p_email: (input.email && input.email.trim() !== '' ? input.email.trim() : null) as any,
      p_program_id: input.program_id ?? undefined,
      p_preferred_date: input.preferred_date ?? undefined,
      p_preferred_time: input.preferred_time ?? undefined,
      p_message: input.message ?? undefined,
    })

    if (error) {
      // Do NOT expose raw DB errors to the client
      console.error('[submitTrialRequest]', error.message)
      return { success: false, error: 'Unable to submit your request. Please try again.' }
    }

    return { success: true, id: data as string }
  } catch (err) {
    console.error('[submitTrialRequest] unexpected', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

// ── Contact Enquiry Submission ────────────────────────────────────────────

export type ContactEnquiryInput = {
  name: string
  phone?: string | null
  email: string
  subject: string
  message: string
}

export async function submitContactEnquiry(
  input: ContactEnquiryInput
): Promise<ActionResult> {
  try {
    // ── Rate limiting ────────────────────────────────────────────
    const ip = await getClientIpFromHeaders()
    const rl = await rateLimit(ip, RATE_LIMITS.CONTACT_FORM)
    if (!rl.allowed) {
      return { success: false, error: 'Too many messages sent. Please try again later.' }
    }

    const supabase = await createClient()

    const { data, error } = await supabase.rpc('submit_contact_enquiry', {
      p_name: input.name,
      p_phone: input.phone ?? undefined,
      p_email: input.email,
      p_subject: input.subject,
      p_message: input.message,
    })

    if (error) {
      console.error('[submitContactEnquiry]', error.message)
      return { success: false, error: 'Unable to send your message. Please try again.' }
    }

    return { success: true, id: data as string }
  } catch (err) {
    console.error('[submitContactEnquiry] unexpected', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

