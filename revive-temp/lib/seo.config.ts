/**
 * SEO Configuration — Single Source of Truth
 * ─────────────────────────────────────────────
 * All SEO-related constants for Revive Fight Club live here.
 * When the domain, phone, or address changes, update ONLY this file.
 *
 * Production:  https://revivefightclub.com  (Hostinger — final)
 * Testing:     https://revive-fight-club.vercel.app  (Vercel — DO NOT use for SEO)
 *
 * NEVER use the Vercel URL in canonical tags, sitemap, OG metadata,
 * structured data, or any SEO-facing configuration.
 */

// ── Production URL ────────────────────────────────────────────────────────────
export const SITE_URL = 'https://revivefightclub.com' as const

// ── Business Identity (NAP) ───────────────────────────────────────────────────
// NAP = Name · Address · Phone  (must be consistent across the entire site)
export const BUSINESS = {
  /** Full legal/listing business name */
  name: 'Revive Fight Club MMA / GYM',
  /** Short brand name used in UI */
  brandName: 'Revive Fight Club',
  /** E.164 format for schema */
  phone: '+919606972238',
  /** Human-readable display format */
  phoneDisplay: '+91 96069 72238',
  address: {
    /** Street line — matches Google Business listing */
    street: '3rd Floor, 157, MM Road, above Indian Overseas Bank',
    /** Primary locality — always "Fraser Town", NOT "Frazer Town" */
    locality: 'Fraser Town',
    /** Always "Bengaluru", NOT "Bangalore" */
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560005',
    /** ISO 3166-1 alpha-2 */
    country: 'IN',
    /** Single-line full address for display/schema */
    full: '3rd Floor, 157, MM Road, above Indian Overseas Bank, Fraser Town, Bengaluru, Karnataka 560005, India',
  },
} as const

// ── Default Metadata ──────────────────────────────────────────────────────────
export const DEFAULT_OG_IMAGE = `${SITE_URL}/icon-512.png` as const

export const DEFAULT_TITLE = {
  default: 'Revive Fight Club | MMA & Fitness Gym in Bengaluru',
  template: '%s | Revive Fight Club',
} as const

export const DEFAULT_DESCRIPTION =
  'Revive Fight Club — MMA, Boxing, Kickboxing, Jiu-Jitsu and fitness training in Fraser Town, Bengaluru. World-class coaches. Premium facilities. Book a trial class today.'
