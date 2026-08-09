'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/getAdminSession'

export type SlideshowResult =
  | { success: true; message: string; id?: string }
  | { success: false; error: string }

const MAX_SLIDES = 10

// ── Add slide ─────────────────────────────────────────────────────────────────
export async function addHeroSlide(
  desktopUrl: string,
  mobileUrl?: string | null,
  tabletUrl?: string | null,
  altText?: string | null
): Promise<SlideshowResult> {
  try {
    await requireAdmin()
    const supabase = await createClient()

    // Check limit
    const { count } = await supabase
      .from('hero_slides')
      .select('id', { count: 'exact', head: true })

    if ((count ?? 0) >= MAX_SLIDES) {
      return { success: false, error: `Maximum ${MAX_SLIDES} slides allowed. Delete one first.` }
    }

    // Get next sort_order
    const { data: last } = await supabase
      .from('hero_slides')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)

    const nextOrder = (last?.[0]?.sort_order ?? -1) + 1

    const { data, error } = await supabase
      .from('hero_slides')
      .insert({
        desktop_url: desktopUrl,
        mobile_url: mobileUrl ?? null,
        tablet_url: tabletUrl ?? null,
        alt_text: altText ?? null,
        sort_order: nextOrder,
        is_active: true,
      })
      .select('id')
      .single()

    if (error) return { success: false, error: 'Failed to add slide.' }

    revalidatePath('/')
    revalidatePath('/admin/images')
    return { success: true, message: 'Slide added.', id: data.id }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

// ── Update slide ──────────────────────────────────────────────────────────────
export async function updateHeroSlide(
  id: string,
  fields: {
    desktop_url?: string
    mobile_url?: string | null
    tablet_url?: string | null
    alt_text?: string | null
  }
): Promise<SlideshowResult> {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const { error } = await supabase
      .from('hero_slides')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) return { success: false, error: 'Failed to update slide.' }

    revalidatePath('/')
    revalidatePath('/admin/images')
    return { success: true, message: 'Slide updated.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

// ── Toggle slide active ───────────────────────────────────────────────────────
export async function toggleHeroSlide(id: string, isActive: boolean): Promise<SlideshowResult> {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const { error } = await supabase
      .from('hero_slides')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) return { success: false, error: 'Failed to toggle slide.' }

    revalidatePath('/')
    revalidatePath('/admin/images')
    return { success: true, message: isActive ? 'Slide enabled.' : 'Slide disabled.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

// ── Delete slide ──────────────────────────────────────────────────────────────
export async function deleteHeroSlide(id: string): Promise<SlideshowResult> {
  try {
    await requireAdmin()
    const supabase = await createClient()

    // Ensure at least 1 slide remains
    const { count } = await supabase
      .from('hero_slides')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)

    if ((count ?? 0) <= 1) {
      // Check if THIS is the last active slide
      const { data: slide } = await supabase
        .from('hero_slides')
        .select('is_active')
        .eq('id', id)
        .single()

      if (slide?.is_active) {
        return { success: false, error: 'Cannot delete the last active slide. Disable it instead.' }
      }
    }

    const { error } = await supabase.from('hero_slides').delete().eq('id', id)
    if (error) return { success: false, error: 'Failed to delete slide.' }

    revalidatePath('/')
    revalidatePath('/admin/images')
    return { success: true, message: 'Slide deleted.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

// ── Reorder slides ────────────────────────────────────────────────────────────
export async function reorderHeroSlides(orderedIds: string[]): Promise<SlideshowResult> {
  try {
    await requireAdmin()
    const supabase = await createClient()

    await Promise.all(
      orderedIds.map((id, index) =>
        supabase
          .from('hero_slides')
          .update({ sort_order: index, updated_at: new Date().toISOString() })
          .eq('id', id)
      )
    )

    revalidatePath('/')
    revalidatePath('/admin/images')
    return { success: true, message: 'Slides reordered.' }
  } catch {
    return { success: false, error: 'Failed to reorder slides.' }
  }
}

// ── Update settings ───────────────────────────────────────────────────────────
export async function updateHeroSettings(
  intervalSeconds: number,
  transition: string
): Promise<SlideshowResult> {
  try {
    await requireAdmin()
    const supabase = await createClient()

    const clampedInterval = Math.min(15, Math.max(3, intervalSeconds))

    const { error } = await supabase
      .from('hero_settings')
      .upsert({
        id: 1,
        interval_seconds: clampedInterval,
        transition,
        updated_at: new Date().toISOString(),
      })

    if (error) return { success: false, error: 'Failed to save settings.' }

    revalidatePath('/')
    revalidatePath('/admin/images')
    return { success: true, message: `Settings saved — ${clampedInterval}s interval.` }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}
