/**
 * Business Settings Utilities
 * All contact info is sourced from Supabase business_settings.
 * Never hard-code phone/WhatsApp numbers in components.
 */

export type BusinessContact = {
  phone: string | null
  whatsapp_number: string | null
  email: string | null
  address: string | null
  city: string | null
  state: string | null
  google_maps_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  youtube_url: string | null
  opening_hours: Record<string, string> | null
}

/**
 * Build a WhatsApp click-to-chat URL.
 * @param number - The WhatsApp number (with country code, digits only)
 * @param message - Optional prefilled message
 */
export function buildWhatsAppUrl(number: string | null, message?: string): string | null {
  if (!number) return null
  // Sanitise: keep digits only
  const digits = number.replace(/\D/g, '')
  if (digits.length < 7) return null
  const encoded = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${encoded}`
}

/**
 * Build a tel: href for phone calls.
 */
export function buildPhoneUrl(phone: string | null): string | null {
  if (!phone) return null
  return `tel:${phone.replace(/\s/g, '')}`
}

/**
 * Standard WhatsApp messages for different contexts.
 */
export const WHATSAPP_MESSAGES = {
  general: "Hi Revive Fight Club, I'd like to know more about your training programs.",
  trial: "Hi Revive Fight Club, I'd like to enquire about a trial session.",
  contact: "Hi Revive Fight Club, I have an enquiry.",
  membership: "Hi Revive Fight Club, I'd like to know more about your membership plans.",
  program: (name: string) => `Hi Revive Fight Club, I'm interested in ${name}.`,
  directions: "Hi Revive Fight Club, could you help me with directions?",
} as const
