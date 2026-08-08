'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ActionResult =
  | { success: true; message: string; id?: string }
  | { success: false; error: string }

// ── Programs ──────────────────────────────────────────
type ProgramInput = {
  name: string
  slug: string
  short_description?: string | null
  description?: string | null
  category?: string | null
  level?: 'all_levels' | 'beginner' | 'intermediate' | 'advanced'
  duration_minutes?: number | null
  image_path?: string | null
  is_active?: boolean
  is_featured?: boolean
  sort_order?: number
}

export async function createProgram(input: ProgramInput): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('programs').insert(input).select('id').single()
    if (error) return { success: false, error: error.code === '23505' ? 'Slug already exists.' : 'Failed to create program.' }
    revalidatePath('/admin/programs')
    revalidatePath('/programs')
    return { success: true, message: 'Program created.', id: data.id }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function updateProgram(id: string, input: Partial<ProgramInput>): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('programs').update(input).eq('id', id)
    if (error) return { success: false, error: error.code === '23505' ? 'Slug already exists.' : 'Failed to update program.' }
    revalidatePath('/admin/programs')
    revalidatePath(`/admin/programs/${id}`)
    revalidatePath('/programs')
    revalidatePath('/')
    return { success: true, message: 'Program updated.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function deleteProgram(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    // Soft-delete: set is_active = false to preserve FK relationships
    const { error } = await supabase.from('programs').update({ is_active: false }).eq('id', id)
    if (error) return { success: false, error: 'Failed to archive program.' }
    revalidatePath('/admin/programs')
    revalidatePath('/programs')
    revalidatePath('/')
    return { success: true, message: 'Program archived.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

// ── Trainers ─────────────────────────────────────────
type TrainerInput = {
  name: string
  slug: string
  role: string
  short_bio?: string | null
  bio?: string | null
  specialties?: string[] | null
  years_experience?: number | null
  profile_image_path?: string | null
  is_active?: boolean
  is_featured?: boolean
  sort_order?: number
}

export async function createTrainer(input: TrainerInput): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('trainers').insert(input).select('id').single()
    if (error) return { success: false, error: error.code === '23505' ? 'Slug already exists.' : 'Failed to create trainer.' }
    revalidatePath('/admin/trainers')
    revalidatePath('/trainers')
    return { success: true, message: 'Trainer created.', id: data.id }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function updateTrainer(id: string, input: Partial<TrainerInput>): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('trainers').update(input).eq('id', id)
    if (error) return { success: false, error: error.code === '23505' ? 'Slug already exists.' : 'Failed to update trainer.' }
    revalidatePath('/admin/trainers')
    revalidatePath(`/admin/trainers/${id}`)
    revalidatePath('/trainers')
    revalidatePath('/')
    return { success: true, message: 'Trainer updated.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function deleteTrainer(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('trainers').update({ is_active: false }).eq('id', id)
    if (error) return { success: false, error: 'Failed to archive trainer.' }
    revalidatePath('/admin/trainers')
    revalidatePath('/trainers')
    return { success: true, message: 'Trainer archived.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

// ── Schedule ─────────────────────────────────────────
type ScheduleInput = {
  program_id: string
  trainer_id?: string | null
  day_of_week: number
  start_time: string
  end_time: string
  level?: 'all_levels' | 'beginner' | 'intermediate' | 'advanced' | null
  location?: string | null
  is_active?: boolean
}

export async function createScheduleItem(input: ScheduleInput): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('schedule_items').insert(input).select('id').single()
    if (error) return { success: false, error: 'Failed to create schedule item.' }
    revalidatePath('/admin/schedule')
    revalidatePath('/schedule')
    return { success: true, message: 'Schedule item created.', id: data.id }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function updateScheduleItem(id: string, input: Partial<ScheduleInput>): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('schedule_items').update(input).eq('id', id)
    if (error) return { success: false, error: 'Failed to update schedule item.' }
    revalidatePath('/admin/schedule')
    revalidatePath('/schedule')
    return { success: true, message: 'Schedule item updated.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function deleteScheduleItem(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('schedule_items').update({ is_active: false }).eq('id', id)
    if (error) return { success: false, error: 'Failed to deactivate item.' }
    revalidatePath('/admin/schedule')
    revalidatePath('/schedule')
    return { success: true, message: 'Schedule item deactivated.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

// ── Memberships ─────────────────────────────────────
type MembershipInput = {
  name: string
  slug: string
  description?: string | null
  price?: number | null
  billing_period?: 'monthly' | 'quarterly' | 'annually'
  features?: string[] | null
  is_active?: boolean
  is_featured?: boolean
  sort_order?: number
}

export async function createMembership(input: MembershipInput): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('membership_plans').insert(input).select('id').single()
    if (error) return { success: false, error: error.code === '23505' ? 'Slug already exists.' : 'Failed to create plan.' }
    revalidatePath('/admin/memberships')
    revalidatePath('/membership')
    return { success: true, message: 'Membership plan created.', id: data.id }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function updateMembership(id: string, input: Partial<MembershipInput>): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('membership_plans').update(input).eq('id', id)
    if (error) return { success: false, error: 'Failed to update plan.' }
    revalidatePath('/admin/memberships')
    revalidatePath('/membership')
    return { success: true, message: 'Membership plan updated.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

// ── Reviews ──────────────────────────────────────────
type ReviewInput = {
  reviewer_name: string
  rating: number
  review_text: string
  reviewer_role?: string | null
  source?: 'google' | 'facebook' | 'internal' | 'other'
  review_date?: string | null
  is_featured?: boolean
  is_published?: boolean
  sort_order?: number
}

export async function createReview(input: ReviewInput): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('reviews')
      .insert(input)
      .select('id')
      .single()
    if (error) return { success: false, error: 'Failed to create review.' }
    revalidatePath('/admin/reviews')
    revalidatePath('/')
    return { success: true, message: 'Review created.', id: data.id }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function updateReview(id: string, input: Partial<ReviewInput>): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('reviews').update(input).eq('id', id)
    if (error) return { success: false, error: 'Failed to update review.' }
    revalidatePath('/admin/reviews')
    revalidatePath('/')
    return { success: true, message: 'Review updated.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function deleteReview(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('reviews').update({ is_published: false }).eq('id', id)
    if (error) return { success: false, error: 'Failed to archive review.' }
    revalidatePath('/admin/reviews')
    revalidatePath('/')
    return { success: true, message: 'Review unpublished.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

// ── FAQs ───────────────────────────────────────────
type FAQInput = {
  question: string
  answer: string
  category?: string | null
  is_published?: boolean
  sort_order?: number
}

export async function createFAQ(input: FAQInput): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('faqs').insert(input).select('id').single()
    if (error) return { success: false, error: 'Failed to create FAQ.' }
    revalidatePath('/admin/faqs')
    return { success: true, message: 'FAQ created.', id: data.id }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function updateFAQ(id: string, input: Partial<FAQInput>): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('faqs').update(input).eq('id', id)
    if (error) return { success: false, error: 'Failed to update FAQ.' }
    revalidatePath('/admin/faqs')
    return { success: true, message: 'FAQ updated.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function deleteFAQ(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('faqs').delete().eq('id', id)
    if (error) return { success: false, error: 'Failed to delete FAQ.' }
    revalidatePath('/admin/faqs')
    return { success: true, message: 'FAQ deleted.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

// ── Facilities ───────────────────────────────────────
type FacilityInput = {
  name: string
  slug: string
  description?: string | null
  image_path?: string | null
  is_active?: boolean
  is_featured?: boolean
  sort_order?: number
}

export async function createFacility(input: FacilityInput): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('facilities').insert(input).select('id').single()
    if (error) return { success: false, error: error.code === '23505' ? 'Slug already exists.' : 'Failed to create facility.' }
    revalidatePath('/admin/facilities')
    return { success: true, message: 'Facility created.', id: data.id }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function updateFacility(id: string, input: Partial<FacilityInput>): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('facilities').update(input).eq('id', id)
    if (error) return { success: false, error: 'Failed to update facility.' }
    revalidatePath('/admin/facilities')
    return { success: true, message: 'Facility updated.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

// ── Gallery ──────────────────────────────────────────
type GalleryInput = {
  image_path: string
  title?: string | null
  description?: string | null
  category?: 'training' | 'gym' | 'coaches' | 'community' | 'events'
  is_featured?: boolean
  is_published?: boolean
  sort_order?: number
}

export async function createGalleryItem(input: GalleryInput): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('gallery_items')
      .insert(input)
      .select('id')
      .single()
    if (error) return { success: false, error: 'Failed to create gallery item.' }
    revalidatePath('/admin/gallery')
    return { success: true, message: 'Gallery item created.', id: data.id }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function updateGalleryItem(id: string, input: Partial<GalleryInput>): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('gallery_items').update(input).eq('id', id)
    if (error) return { success: false, error: 'Failed to update gallery item.' }
    revalidatePath('/admin/gallery')
    return { success: true, message: 'Gallery item updated.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('gallery_items').update({ is_published: false }).eq('id', id)
    if (error) return { success: false, error: 'Failed to archive gallery item.' }
    revalidatePath('/admin/gallery')
    return { success: true, message: 'Gallery item archived.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}
