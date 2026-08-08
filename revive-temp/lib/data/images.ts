import { createClient } from '@/lib/supabase/server'
import type {
  ImageSlot,
  MediaAsset,
  ImageAssignmentHistory as AssignmentHistory,
} from '@/types/database'

export type { ImageSlot, MediaAsset, AssignmentHistory }

// ── Public resolver ───────────────────────────────────────────────────────────
// Used by public pages to get the current image for a slot

export async function getSlotImage(slotKey: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('image_slots')
    .select('current_url')
    .eq('slot_key', slotKey)
    .eq('is_active', true)
    .single()
  return data?.current_url ?? null
}

export async function getSlotImages(
  keys: string[]
): Promise<Record<string, string | null>> {
  if (keys.length === 0) return {}
  const supabase = await createClient()
  const { data } = await supabase
    .from('image_slots')
    .select('slot_key, current_url')
    .in('slot_key', keys)
    .eq('is_active', true)

  const result: Record<string, string | null> = {}
  keys.forEach(k => { result[k] = null })
  ;(data ?? []).forEach(row => { result[row.slot_key] = row.current_url })
  return result
}

// ── Admin data fetchers ───────────────────────────────────────────────────────

export async function getAllSlots(section?: string): Promise<ImageSlot[]> {
  const supabase = await createClient()
  let query = supabase
    .from('image_slots')
    .select('*')
    .order('section')
    .order('title')

  if (section && section !== 'all') {
    query = query.eq('section', section)
  }

  const { data, error } = await query
  if (error) {
    console.error('[getAllSlots]', error.message)
    return []
  }
  return (data ?? []) as ImageSlot[]
}

export async function getMediaLibrary(
  search?: string,
  page = 1,
  pageSize = 24
): Promise<{ data: MediaAsset[]; count: number }> {
  const supabase = await createClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('media_assets')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (search) {
    query = query.ilike('file_name', `%${search}%`)
  }

  const { data, count, error } = await query
  if (error) {
    console.error('[getMediaLibrary]', error.message)
    return { data: [], count: 0 }
  }
  return { data: (data ?? []) as MediaAsset[], count: count ?? 0 }
}

export async function getSlotHistory(slotId: string): Promise<AssignmentHistory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('image_assignment_history')
    .select('*')
    .eq('slot_id', slotId)
    .order('changed_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('[getSlotHistory]', error.message)
    return []
  }
  return (data ?? []) as AssignmentHistory[]
}

export async function getMediaUsage(
  mediaId: string
): Promise<ImageSlot[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('image_slots')
    .select('*')
    .eq('current_media_id', mediaId)

  if (error) return []
  return (data ?? []) as ImageSlot[]
}

export async function getImageStats(): Promise<{
  totalMedia: number
  activeSlots: number
  unassignedSlots: number
  recentlyUpdated: number
}> {
  const supabase = await createClient()
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [mediaRes, slotsRes, recentRes] = await Promise.all([
    supabase.from('media_assets').select('id', { count: 'exact', head: true }),
    supabase.from('image_slots').select('id, current_url', { count: 'exact' }),
    supabase
      .from('image_slots')
      .select('id', { count: 'exact', head: true })
      .gte('updated_at', weekAgo),
  ])

  const slots = slotsRes.data ?? []
  return {
    totalMedia: mediaRes.count ?? 0,
    activeSlots: slots.length,
    unassignedSlots: slots.filter(s => !s.current_url).length,
    recentlyUpdated: recentRes.count ?? 0,
  }
}
