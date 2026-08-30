import 'server-only'

/**
 * Workshop business logic helpers.
 * Availability, status display, timezone, slug utilities.
 */

export type WorkshopStatus = 'draft' | 'published' | 'closed' | 'completed' | 'cancelled' | 'archived'
export type PricingType = 'free' | 'paid'
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'waitlisted' | 'attended' | 'no_show'
export type WsPaymentStatus = 'not_required' | 'pending' | 'paid' | 'failed' | 'refunded'

export interface WorkshopAvailability {
  canRegister: boolean
  isWaitlist: boolean
  isFull: boolean
  isDeadlinePassed: boolean
  remainingSeats: number | null // null = unlimited
  ctaLabel: 'REGISTER NOW' | 'JOIN WAITLIST' | 'REGISTRATION CLOSED' | 'FULLY BOOKED' | 'WORKSHOP COMPLETED' | 'WORKSHOP CANCELLED' | 'COMING SOON'
}

export function getWorkshopAvailability(workshop: {
  status: WorkshopStatus
  capacity: number | null
  confirmedCount: number
  waitlistEnabled: boolean
  registrationDeadline: string | null
  startDatetime: string
}): WorkshopAvailability {
  const now = new Date()

  if (workshop.status === 'cancelled') {
    return { canRegister: false, isWaitlist: false, isFull: false, isDeadlinePassed: false, remainingSeats: 0, ctaLabel: 'WORKSHOP CANCELLED' }
  }
  if (workshop.status === 'completed') {
    return { canRegister: false, isWaitlist: false, isFull: false, isDeadlinePassed: false, remainingSeats: 0, ctaLabel: 'WORKSHOP COMPLETED' }
  }
  if (workshop.status === 'closed') {
    return { canRegister: false, isWaitlist: false, isFull: false, isDeadlinePassed: false, remainingSeats: 0, ctaLabel: 'REGISTRATION CLOSED' }
  }
  if (workshop.status !== 'published') {
    return { canRegister: false, isWaitlist: false, isFull: false, isDeadlinePassed: false, remainingSeats: 0, ctaLabel: 'COMING SOON' }
  }

  const isDeadlinePassed = workshop.registrationDeadline
    ? new Date(workshop.registrationDeadline) < now
    : false

  if (isDeadlinePassed) {
    return { canRegister: false, isWaitlist: false, isFull: false, isDeadlinePassed: true, remainingSeats: null, ctaLabel: 'REGISTRATION CLOSED' }
  }

  const remainingSeats = workshop.capacity !== null
    ? Math.max(0, workshop.capacity - workshop.confirmedCount)
    : null

  const isFull = workshop.capacity !== null && workshop.confirmedCount >= workshop.capacity

  if (isFull && !workshop.waitlistEnabled) {
    return { canRegister: false, isWaitlist: false, isFull: true, isDeadlinePassed: false, remainingSeats: 0, ctaLabel: 'FULLY BOOKED' }
  }

  if (isFull && workshop.waitlistEnabled) {
    return { canRegister: true, isWaitlist: true, isFull: true, isDeadlinePassed: false, remainingSeats: 0, ctaLabel: 'JOIN WAITLIST' }
  }

  return { canRegister: true, isWaitlist: false, isFull: false, isDeadlinePassed: false, remainingSeats, ctaLabel: 'REGISTER NOW' }
}

/**
 * Format a workshop datetime for display in Asia/Kolkata timezone.
 * e.g. "24 September 2026 6:00 PM – 8:00 PM IST"
 */
export function formatWorkshopDate(startIso: string, endIso: string): string {
  const tz = 'Asia/Kolkata'
  const start = new Date(startIso)
  const end = new Date(endIso)

  const dateStr = start.toLocaleDateString('en-IN', {
    timeZone: tz,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const startTime = start.toLocaleTimeString('en-IN', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(':00', '').toUpperCase()

  const endTime = end.toLocaleTimeString('en-IN', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(':00', '').toUpperCase()

  return `${dateStr} · ${startTime} – ${endTime} IST`
}

/**
 * Format just the date part.
 * e.g. "24 Sep 2026"
 */
export function formatWorkshopDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Generate a safe slug from a title.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
}

/**
 * Format price for display.
 */
export function formatPrice(price: number | null, pricingType: PricingType, currency = 'INR'): string {
  if (pricingType === 'free' || !price || price === 0) return 'FREE'
  if (currency === 'INR') return `₹${price.toLocaleString('en-IN')}`
  return `${currency} ${price.toLocaleString()}`
}
