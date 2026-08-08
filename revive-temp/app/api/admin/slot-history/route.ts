import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slotId = searchParams.get('slotId')
  if (!slotId) return NextResponse.json([])

  const supabase = await createClient()
  const { data } = await supabase
    .from('image_assignment_history')
    .select('*')
    .eq('slot_id', slotId)
    .order('changed_at', { ascending: false })
    .limit(20)

  return NextResponse.json(data ?? [])
}
