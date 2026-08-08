import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'
import type { ScheduleItem } from '@/types/database'

type MembershipPlanRow = Database['public']['Tables']['membership_plans']['Row']
type FacilityRow = Database['public']['Tables']['facilities']['Row']
type GalleryItemRow = Database['public']['Tables']['gallery_items']['Row']

// ── Membership Plans ──────────────────────────────────────────────

export type MembershipPlanCard = Pick<
  MembershipPlanRow,
  'id' | 'slug' | 'name' | 'description' | 'price' | 'billing_period' | 'features' | 'is_featured' | 'sort_order'
>

export async function getActiveMembershipPlans(): Promise<MembershipPlanCard[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('membership_plans')
    .select('id, slug, name, description, price, billing_period, features, is_featured, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[getActiveMembershipPlans]', error.message)
    return []
  }
  return (data ?? []) as MembershipPlanCard[]
}

// ── Schedule ──────────────────────────────────────────────────────

export type ScheduleItemWithRelations = Pick<
  ScheduleItem,
  'id' | 'day_of_week' | 'start_time' | 'end_time' | 'level' | 'location' | 'program_id' | 'trainer_id'
> & {
  programs: { name: string; slug: string; category: string | null } | null
  trainers: { name: string; slug: string } | null
}

export async function getActiveSchedule(): Promise<ScheduleItemWithRelations[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('schedule_items')
    .select(`
      id, day_of_week, start_time, end_time, level, location,
      program_id, trainer_id,
      programs ( name, slug, category ),
      trainers ( name, slug )
    `)
    .eq('is_active', true)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    console.error('[getActiveSchedule]', error.message)
    return []
  }
  return (data ?? []) as unknown as ScheduleItemWithRelations[]
}

// ── Facilities ────────────────────────────────────────────────────

export type FacilityCard = Pick<
  FacilityRow,
  'id' | 'slug' | 'name' | 'description' | 'image_path' | 'is_featured' | 'sort_order'
>

export async function getActiveFacilities(): Promise<FacilityCard[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('facilities')
    .select('id, slug, name, description, image_path, is_featured, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[getActiveFacilities]', error.message)
    return []
  }
  return (data ?? []) as FacilityCard[]
}

// ── Gallery ───────────────────────────────────────────────────────

export type GalleryCard = Pick<
  GalleryItemRow,
  'id' | 'title' | 'description' | 'image_path' | 'category' | 'is_featured' | 'sort_order'
>

export async function getPublishedGalleryItems(
  category?: GalleryItemRow['category']
): Promise<GalleryCard[]> {
  const supabase = await createClient()
  let query = supabase
    .from('gallery_items')
    .select('id, title, description, image_path, category, is_featured, sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('[getPublishedGalleryItems]', error.message)
    return []
  }
  return (data ?? []) as GalleryCard[]
}
