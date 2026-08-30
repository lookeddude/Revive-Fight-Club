import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getWorkshopAvailability } from '@/lib/workshops'

// ── Public workshop types ─────────────────────────────────────

export interface WorkshopListItem {
  id: string
  slug: string
  title: string
  short_description: string | null
  cover_image_path: string | null
  workshop_mode: string
  start_datetime: string
  end_datetime: string
  registration_deadline: string | null
  pricing_type: string
  price: number | null
  currency: string
  capacity: number | null
  waitlist_enabled: boolean
  status: string
  is_featured: boolean
  featured_order: number
  confirmedCount: number
}

export interface WorkshopDetail extends WorkshopListItem {
  description: string | null
  gallery_images: string[]
  location: string | null
  workshop_mode: string
  what_you_learn: string[]
  requirements: string[]
  published_at: string | null
  instructors: WorkshopInstructor[]
  faqs: WorkshopFaq[]
  registrationFields: WorkshopRegistrationField[]
}

export interface WorkshopInstructor {
  id: string
  name: string
  bio: string | null
  photo_path: string | null
  display_order: number
}

export interface WorkshopFaq {
  id: string
  question: string
  answer: string
  display_order: number
}

export interface WorkshopRegistrationField {
  id: string
  field_key: string
  label: string
  field_type: string
  required: boolean
  placeholder: string | null
  options: string[] | null
  display_order: number
}

/**
 * Get all published upcoming workshops for public listing.
 */
export const getPublishedWorkshops = cache(async (): Promise<WorkshopListItem[]> => {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('workshops')
    .select('id,slug,title,short_description,cover_image_path,workshop_mode,start_datetime,end_datetime,registration_deadline,pricing_type,price,currency,capacity,waitlist_enabled,status,is_featured,featured_order')
    .eq('status', 'published')
    .order('start_datetime', { ascending: true })

  if (!data) return []

  // Get registration counts
  const workshopIds = data.map((w: WorkshopListItem) => w.id)

  if (workshopIds.length === 0) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: counts } = await (supabase as any)
    .from('workshop_registrations')
    .select('workshop_id')
    .in('workshop_id', workshopIds)
    .in('registration_status', ['confirmed', 'pending'])

  const countMap: Record<string, number> = {}
  if (counts) {
    for (const row of counts) {
      countMap[row.workshop_id] = (countMap[row.workshop_id] ?? 0) + 1
    }
  }

  return data.map((w: WorkshopListItem) => ({
    ...w,
    confirmedCount: countMap[w.id] ?? 0,
  }))
})

/**
 * Get featured workshops for homepage (max 3).
 */
export const getFeaturedWorkshops = cache(async (): Promise<WorkshopListItem[]> => {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('workshops')
    .select('id,slug,title,short_description,cover_image_path,workshop_mode,start_datetime,end_datetime,registration_deadline,pricing_type,price,currency,capacity,waitlist_enabled,status,is_featured,featured_order')
    .eq('is_featured', true)
    .in('status', ['published'])
    .order('featured_order', { ascending: true })
    .limit(3)

  if (!data) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: counts } = await (supabase as any)
    .from('workshop_registrations')
    .select('workshop_id')
    .in('workshop_id', data.map((w: WorkshopListItem) => w.id))
    .in('registration_status', ['confirmed', 'pending'])

  const countMap: Record<string, number> = {}
  if (counts) {
    for (const row of counts) {
      countMap[row.workshop_id] = (countMap[row.workshop_id] ?? 0) + 1
    }
  }

  return data.map((w: WorkshopListItem) => ({
    ...w,
    confirmedCount: countMap[w.id] ?? 0,
  }))
})

/**
 * Get a single workshop by slug (public).
 */
export const getWorkshopBySlug = cache(async (slug: string): Promise<WorkshopDetail | null> => {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: workshop } = await (supabase as any)
    .from('workshops')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!workshop) return null

  const adminClient = createAdminClient()

  // Get count
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (adminClient as any)
    .from('workshop_registrations')
    .select('id', { count: 'exact', head: true })
    .eq('workshop_id', workshop.id)
    .in('registration_status', ['confirmed', 'pending'])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [{ data: instructors }, { data: faqs }, { data: fields }] = await Promise.all([
    (adminClient as any).from('workshop_instructors').select('*').eq('workshop_id', workshop.id).order('display_order'),
    (adminClient as any).from('workshop_faqs').select('*').eq('workshop_id', workshop.id).order('display_order'),
    (adminClient as any).from('workshop_registration_fields').select('*').eq('workshop_id', workshop.id).order('display_order'),
  ])

  return {
    ...workshop,
    confirmedCount: count ?? 0,
    instructors: instructors ?? [],
    faqs: faqs ?? [],
    registrationFields: fields ?? [],
  }
})

/**
 * Get workshop by ID for registration (used in API routes).
 */
export async function getWorkshopForRegistration(workshopId: string) {
  const adminClient = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: workshop } = await (adminClient as any)
    .from('workshops')
    .select('id,slug,title,status,pricing_type,price,currency,capacity,waitlist_enabled,registration_deadline,start_datetime,end_datetime')
    .eq('id', workshopId)
    .single()

  return workshop ?? null
}

/**
 * Get registration for a user (authenticated).
 */
export async function getUserRegistration(workshopId: string, userId: string) {
  const adminClient = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (adminClient as any)
    .from('workshop_registrations')
    .select('id,registration_id,registration_status,payment_status,created_at')
    .eq('workshop_id', workshopId)
    .eq('user_id', userId)
    .in('registration_status', ['confirmed','pending','waitlisted'])
    .maybeSingle()

  return data ?? null
}

/**
 * Get all published workshop slugs (for sitemap).
 */
export async function getAllPublishedWorkshopSlugs(): Promise<string[]> {
  const adminClient = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (adminClient as any)
    .from('workshops')
    .select('slug')
    .eq('status', 'published')

  return (data ?? []).map((w: { slug: string }) => w.slug)
}

/**
 * Get confirmation data for success page.
 */
export async function getRegistrationConfirmation(registrationId: string) {
  const adminClient = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (adminClient as any)
    .from('workshop_registrations')
    .select('id,registration_id,full_name,email,registration_status,payment_status,qr_token,created_at,workshops(id,title,slug,start_datetime,end_datetime,location,workshop_mode,pricing_type)')
    .eq('registration_id', registrationId)
    .maybeSingle()

  return data ?? null
}

export { getWorkshopAvailability }
