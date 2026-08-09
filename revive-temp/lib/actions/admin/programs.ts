'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/getAdminSession'
import { revalidatePath } from 'next/cache'

type ProgramRow = { id: string; sort_order: number }

/**
 * Move a program up or down.
 * Fetches the full ordered list, swaps the two affected rows' sort_order
 * values using plain UPDATE (not upsert — avoids NOT NULL constraint errors),
 * then reassigns clean sequential values to every row to keep things tidy.
 */
export async function reorderProgram(
  programId: string,
  direction: 'up' | 'down',
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any

    // 1. Fetch all programs ordered by sort_order
    const { data, error: fetchError } = await supabase
      .from('programs')
      .select('id, sort_order')
      .order('sort_order', { ascending: true })

    if (fetchError || !data) {
      return { success: false, error: 'Could not load programs.' }
    }

    const list: ProgramRow[] = data as ProgramRow[]

    // 2. Find target and neighbour
    const idx = list.findIndex((p) => p.id === programId)
    if (idx === -1) return { success: false, error: 'Program not found.' }

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= list.length) {
      return { success: false, error: 'Already at boundary.' }
    }

    // 3. Build new full order by moving item in array
    const reordered = [...list]
    const tmp = reordered[idx]
    reordered[idx] = reordered[swapIdx]
    reordered[swapIdx] = tmp

    // 4. Update ONLY sort_order for every program using UPDATE (never INSERT)
    //    Run all updates in parallel for speed
    const updatePromises = reordered.map((p, i) =>
      supabase
        .from('programs')
        .update({ sort_order: i + 1 })
        .eq('id', p.id)
    )

    const results = await Promise.all(updatePromises)
    const failed = results.find((r: { error: unknown }) => r.error)
    if (failed) {
      return { success: false, error: 'Failed to save order. Please try again.' }
    }

    revalidatePath('/admin/programs')
    revalidatePath('/')
    return { success: true }
  } catch (err) {
    console.error('[reorderProgram]', err)
    return { success: false, error: 'Unexpected error.' }
  }
}
