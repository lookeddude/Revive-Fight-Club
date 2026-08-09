'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/getAdminSession'
import { revalidatePath } from 'next/cache'

/**
 * Move a program up or down in sort_order by swapping with its neighbour.
 * The top 4 active programs (by sort_order) are automatically shown as
 * featured on the public website.
 */
export async function reorderProgram(
  programId: string,
  direction: 'up' | 'down',
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const supabase = await createClient()

    // Fetch all active programs ordered by sort_order
    const { data: programs, error: fetchError } = await supabase
      .from('programs')
      .select('id, sort_order')
      .order('sort_order', { ascending: true })

    if (fetchError || !programs) return { success: false, error: 'Failed to load programs.' }

    const idx = programs.findIndex(p => p.id === programId)
    if (idx === -1) return { success: false, error: 'Program not found.' }

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= programs.length) return { success: false, error: 'Already at boundary.' }

    const current = programs[idx]
    const neighbour = programs[swapIdx]

    // Swap sort_order values
    const { error: e1 } = await supabase
      .from('programs')
      .update({ sort_order: neighbour.sort_order })
      .eq('id', current.id)

    const { error: e2 } = await supabase
      .from('programs')
      .update({ sort_order: current.sort_order })
      .eq('id', neighbour.id)

    if (e1 || e2) return { success: false, error: 'Failed to reorder.' }

    revalidatePath('/admin/programs')
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'Unexpected error.' }
  }
}
