'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/getAdminSession'

// ── Add a slide ─────────────────────────────────────────────────────────────
export async function addProgramSlide(
  programId: string,
  imageUrl: string,
  altText?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const { data: existing } = await supabase
      .from('program_slides')
      .select('sort_order')
      .eq('program_id', programId)
      .order('sort_order', { ascending: false })
      .limit(1)

    const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1

    const { data, error } = await supabase
      .from('program_slides')
      .insert({ program_id: programId, image_url: imageUrl, alt_text: altText ?? null, sort_order: nextOrder })
      .select('id')
      .single()

    if (error) return { success: false, error: error.message }

    revalidatePath('/programs')
    revalidatePath('/admin/images')
    return { success: true, id: data.id }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

// ── Delete a slide ───────────────────────────────────────────────────────────
export async function deleteProgramSlide(
  slideId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const { error } = await supabase.from('program_slides').delete().eq('id', slideId)
    if (error) return { success: false, error: error.message }
    revalidatePath('/programs')
    revalidatePath('/admin/images')
    return { success: true }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

// ── Toggle slide active state ────────────────────────────────────────────────
export async function toggleProgramSlide(
  slideId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const { error } = await supabase
      .from('program_slides')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', slideId)
    if (error) return { success: false, error: error.message }
    revalidatePath('/programs')
    revalidatePath('/admin/images')
    return { success: true }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

// ── Update alt text ──────────────────────────────────────────────────────────
export async function updateProgramSlideAlt(
  slideId: string,
  altText: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const { error } = await supabase
      .from('program_slides')
      .update({ alt_text: altText, updated_at: new Date().toISOString() })
      .eq('id', slideId)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/images')
    return { success: true }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

// ── Reorder slides ───────────────────────────────────────────────────────────
export async function reorderProgramSlides(
  updates: { id: string; sort_order: number }[]
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = await createClient()
    await Promise.all(
      updates.map(u =>
        supabase
          .from('program_slides')
          .update({ sort_order: u.sort_order, updated_at: new Date().toISOString() })
          .eq('id', u.id)
      )
    )
    revalidatePath('/programs')
    revalidatePath('/admin/images')
    return { success: true }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}
