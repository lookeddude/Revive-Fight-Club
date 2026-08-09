'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/getAdminSession'
import { revalidatePath } from 'next/cache'

type ProgramRow = { id: string; sort_order: number }

/**
 * Move a program up or down.
 * Instead of swapping two rows (race-prone), we fetch the full ordered list,
 * move the target item, then reassign clean sequential sort_order values
 * (1, 2, 3 …) to ALL programs in one upsert. Completely atomic, no conflicts.
 */
export async function reorderProgram(
  programId: string,
  direction: 'up' | 'down',
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any

    // 1. Fetch all programs sorted by current sort_order
    const { data, error: fetchError } = await supabase
      .from('programs')
      .select('id, sort_order')
      .order('sort_order', { ascending: true })

    if (fetchError || !data) {
      return { success: false, error: 'Could not load programs.' }
    }

    const list: ProgramRow[] = data as ProgramRow[]

    // 2. Find the target and its neighbour
    const idx = list.findIndex((p) => p.id === programId)
    if (idx === -1) return { success: false, error: 'Program not found.' }

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= list.length) {
      return { success: false, error: 'Already at boundary.' }
    }

    // 3. Swap positions in the array
    const reordered = [...list]
    const tmp = reordered[idx]
    reordered[idx] = reordered[swapIdx]
    reordered[swapIdx] = tmp

    // 4. Build clean sequential sort_order values (1, 2, 3, …)
    const updates = reordered.map((p, i) => ({ id: p.id, sort_order: i + 1 }))

    // 5. Upsert ALL programs in one call — atomic, no conflicts
    const { error: upsertError } = await supabase
      .from('programs')
      .upsert(updates, { onConflict: 'id' })

    if (upsertError) {
      return { success: false, error: `Save failed: ${upsertError.message}` }
    }

    revalidatePath('/admin/programs')
    revalidatePath('/')
    return { success: true }
  } catch (err) {
    console.error('[reorderProgram]', err)
    return { success: false, error: 'Unexpected error.' }
  }
}
