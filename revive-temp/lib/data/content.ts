import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type ProgramRow = Database['public']['Tables']['programs']['Row']
type TrainerRow = Database['public']['Tables']['trainers']['Row']
type ReviewRow = Database['public']['Tables']['reviews']['Row']
type FAQRow = Database['public']['Tables']['faqs']['Row']
type BusinessSettingsRow = Database['public']['Tables']['business_settings']['Row'] & { logo_url?: string | null }

// ── Programs ──────────────────────────────────────────────────────

export type ProgramCard = Pick<
  ProgramRow,
  'id' | 'slug' | 'name' | 'short_description' | 'image_path' | 'level' | 'category' | 'is_featured' | 'sort_order'
>

export async function getActivePrograms(): Promise<ProgramCard[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('programs')
    .select('id, slug, name, short_description, image_path, level, category, is_featured, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[getActivePrograms]', error.message)
    return []
  }
  return (data ?? []) as ProgramCard[]
}

export async function getFeaturedPrograms(): Promise<ProgramCard[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('programs')
    .select('id, slug, name, short_description, image_path, level, category, is_featured, sort_order')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .limit(4)

  if (error) {
    console.error('[getFeaturedPrograms]', error.message)
    return []
  }
  return (data ?? []) as ProgramCard[]
}

export async function getProgramBySlug(slug: string): Promise<ProgramRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') console.error('[getProgramBySlug]', error.message)
    return null
  }
  return data
}

// ── Trainers ──────────────────────────────────────────────────────

export type TrainerCard = Pick<
  TrainerRow,
  'id' | 'slug' | 'name' | 'role' | 'short_bio' | 'profile_image_path' | 'specialties' | 'is_featured' | 'sort_order'
>

export async function getActiveTrainers(): Promise<TrainerCard[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('trainers')
    .select('id, slug, name, role, short_bio, profile_image_path, specialties, is_featured, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[getActiveTrainers]', error.message)
    return []
  }
  return (data ?? []) as TrainerCard[]
}

export async function getFeaturedTrainers(): Promise<TrainerCard[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('trainers')
    .select('id, slug, name, role, short_bio, profile_image_path, specialties, is_featured, sort_order')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(4)

  if (error) {
    console.error('[getFeaturedTrainers]', error.message)
    return []
  }
  return (data ?? []) as TrainerCard[]
}

export async function getTrainerBySlug(slug: string): Promise<TrainerRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('trainers')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') console.error('[getTrainerBySlug]', error.message)
    return null
  }
  return data
}

// ── Reviews ───────────────────────────────────────────────────────

export type ReviewCard = Pick<
  ReviewRow,
  'id' | 'reviewer_name' | 'rating' | 'review_text' | 'reviewer_role' | 'source' | 'review_date' | 'sort_order'
>

export async function getPublishedReviews(limit = 9): Promise<ReviewCard[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('id, reviewer_name, rating, review_text, reviewer_role, source, review_date, sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('[getPublishedReviews]', error.message)
    return []
  }
  return (data ?? []) as ReviewCard[]
}

export async function getFeaturedReviews(limit = 10): Promise<ReviewCard[]> {
  const supabase = await createClient()

  // First try featured reviews
  const { data: featured, error: err1 } = await supabase
    .from('reviews')
    .select('id, reviewer_name, rating, review_text, reviewer_role, source, review_date, sort_order')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit)

  if (!err1 && featured && featured.length > 0) {
    return featured as ReviewCard[]
  }

  // Fallback: return any published reviews
  const { data: all, error: err2 } = await supabase
    .from('reviews')
    .select('id, reviewer_name, rating, review_text, reviewer_role, source, review_date, sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .limit(limit)

  if (err2) {
    console.error('[getFeaturedReviews]', err2.message)
    return []
  }
  return (all ?? []) as ReviewCard[]
}

// ── FAQs ──────────────────────────────────────────────────────────

export type FAQCard = Pick<FAQRow, 'id' | 'question' | 'answer' | 'category' | 'sort_order'>

export async function getPublishedFAQs(): Promise<FAQCard[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('faqs')
    .select('id, question, answer, category, sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[getPublishedFAQs]', error.message)
    return []
  }
  return (data ?? []) as FAQCard[]
}

// ── Business Settings ─────────────────────────────────────────────

export async function getBusinessSettings(): Promise<BusinessSettingsRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('business_settings')
    .select('*, logo_url')
    .eq('id', 1)
    .single()

  if (error) {
    console.error('[getBusinessSettings]', error.message)
    return null
  }
  return data
}
