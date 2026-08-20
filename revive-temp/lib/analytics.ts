/**
 * lib/analytics.ts
 * ─────────────────────────────────────────────────────────────────
 * Google Analytics 4 event tracking for Revive Fight Club.
 *
 * Usage:
 *   import { trackWhatsAppClick } from '@/lib/analytics'
 *   trackWhatsAppClick('contact_page')
 *
 * PRIVACY RULES:
 *   - NEVER pass names, phone numbers, emails, or any PII as event params.
 *   - Only pass location labels and program names (non-personal, from DB).
 *
 * If NEXT_PUBLIC_GA_MEASUREMENT_ID is not set, all tracking is silently skipped.
 */

type EventParams = Record<string, string | number | boolean | undefined>

/**
 * Core event dispatcher — wraps window.gtag safely.
 * No-ops during SSR, when GA ID is missing, or gtag is not loaded.
 */
export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return
  if (typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}

/** User clicked a phone number link */
export function trackPhoneClick(location: string): void {
  trackEvent('phone_click', { location })
}

/** User clicked a WhatsApp CTA button */
export function trackWhatsAppClick(location: string): void {
  trackEvent('whatsapp_click', { location })
}

/** User clicked a Directions / Google Maps link */
export function trackDirectionsClick(location: string): void {
  trackEvent('directions_click', { location })
}

/** User clicked a Book Trial CTA */
export function trackBookTrialClick(location: string): void {
  trackEvent('book_trial_click', { location })
}

/** User submitted the contact enquiry form */
export function trackContactFormSubmit(): void {
  trackEvent('contact_form_submit', { form_type: 'contact' })
}

/** User navigated to a specific program detail page */
export function trackProgramView(programName: string): void {
  trackEvent('program_view', { program_name: programName })
}

// ─── Type declaration for window.gtag ───────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void
    dataLayer?: unknown[]
  }
}