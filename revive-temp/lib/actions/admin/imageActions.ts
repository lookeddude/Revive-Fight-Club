'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { uploadImage } from '@/lib/actions/admin/uploadActions'

export type ActionResult =
  | { success: true; message: string; id?: string; url?: string }
  | { success: false; error: string }

// ── Assign image to slot ──────────────────────────────────────────────────────
export async function assignImageToSlot(
  slotKey: string,
  imageUrl: string,
  mediaId: string | null,
  altText?: string | null
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated.' }

    // Get current slot state for history
    const { data: slot } = await supabase
      .from('image_slots')
      .select('id, current_url, title')
      .eq('slot_key', slotKey)
      .single()

    if (!slot) return { success: false, error: `Slot "${slotKey}" not found.` }

    // Record history
    await supabase.from('image_assignment_history').insert({
      slot_id: slot.id,
      previous_url: slot.current_url,
      new_url: imageUrl,
      media_id: mediaId,
      changed_by: user.id,
    })

    // Update slot
    const { error } = await supabase
      .from('image_slots')
      .update({
        current_url: imageUrl,
        current_media_id: mediaId,
        alt_text: altText ?? null,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq('slot_key', slotKey)

    if (error) {
      console.error('[assignImageToSlot]', error.message)
      return { success: false, error: 'Failed to update image slot.' }
    }

    // Revalidate all public pages so new image shows immediately
    revalidatePath('/')
    revalidatePath('/programs')
    revalidatePath('/trainers')
    revalidatePath('/about')
    revalidatePath('/membership')
    revalidatePath('/contact')
    revalidatePath('/admin/images')

    return { success: true, message: `"${slot.title}" image updated successfully.` }
  } catch (e) {
    console.error('[assignImageToSlot]', e)
    return { success: false, error: 'Something went wrong.' }
  }
}

// ── Restore from history ──────────────────────────────────────────────────────
export async function restoreFromHistory(historyId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated.' }

    const { data: history } = await supabase
      .from('image_assignment_history')
      .select('*, image_slots(slot_key, title)')
      .eq('id', historyId)
      .single()

    if (!history) return { success: false, error: 'History record not found.' }

    const slot = history.image_slots as { slot_key: string; title: string } | null
    if (!slot) return { success: false, error: 'Slot not found.' }

    const restoreUrl = history.previous_url
    return await assignImageToSlot(slot.slot_key, restoreUrl ?? '', null, null)
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

// ── Upload to media library ───────────────────────────────────────────────────
export async function uploadToMediaLibrary(
  formData: FormData,
  altText?: string
): Promise<ActionResult & { url?: string; mediaId?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated.' }

    const file = formData.get('file') as File | null
    if (!file) return { success: false, error: 'No file provided.' }

    // Upload to Supabase storage
    const uploadResult = await uploadImage(formData, 'revive-gallery', 'media-library')
    if (!uploadResult.success) return { success: false, error: uploadResult.error }

    // Register in media_assets
    const { data: asset, error } = await supabase
      .from('media_assets')
      .insert({
        file_name: file.name,
        storage_bucket: 'revive-gallery',
        storage_path: uploadResult.path,
        public_url: uploadResult.url,
        mime_type: file.type,
        file_size: file.size,
        alt_text: altText || null,
        created_by: user.id,
      })
      .select('id')
      .single()

    if (error) {
      console.error('[uploadToMediaLibrary]', error.message)
      return { success: false, error: 'Uploaded but failed to register in media library.' }
    }

    revalidatePath('/admin/images')
    revalidatePath('/admin/gallery')

    return {
      success: true,
      message: 'Image uploaded to media library.',
      url: uploadResult.url,
      mediaId: asset.id,
    }
  } catch {
    return { success: false, error: 'Upload failed.' }
  }
}

// ── Delete media asset (with protection) ─────────────────────────────────────
export async function deleteMediaAsset(mediaId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // Check if used by any active slot
    const { data: usedSlots } = await supabase
      .from('image_slots')
      .select('title')
      .eq('current_media_id', mediaId)

    if (usedSlots && usedSlots.length > 0) {
      const names = usedSlots.map(s => s.title).join(', ')
      return {
        success: false,
        error: `This image is currently used by: ${names}. Please replace it first.`,
      }
    }

    const { error } = await supabase
      .from('media_assets')
      .delete()
      .eq('id', mediaId)

    if (error) return { success: false, error: 'Failed to delete image.' }

    revalidatePath('/admin/images')
    return { success: true, message: 'Image deleted.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

// ── Register gallery upload in media library ──────────────────────────────────
export async function registerGalleryImageInMediaLibrary(
  publicUrl: string,
  storagePath: string,
  fileName: string,
  mimeType: string,
  fileSize: number,
): Promise<string | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('media_assets')
      .insert({
        file_name: fileName,
        storage_bucket: 'revive-gallery',
        storage_path: storagePath,
        public_url: publicUrl,
        mime_type: mimeType,
        file_size: fileSize,
        created_by: user?.id ?? null,
      })
      .select('id')
      .single()

    return data?.id ?? null
  } catch {
    return null
  }
}

// ── Update slot alt text ──────────────────────────────────────────────────────
export async function updateSlotAltText(
  slotKey: string,
  altText: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('image_slots')
      .update({ alt_text: altText, updated_at: new Date().toISOString() })
      .eq('slot_key', slotKey)

    if (error) return { success: false, error: 'Failed to update alt text.' }
    revalidatePath('/admin/images')
    return { success: true, message: 'Alt text updated.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}
