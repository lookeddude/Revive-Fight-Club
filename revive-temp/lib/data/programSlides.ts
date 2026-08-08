import { createClient } from '@/lib/supabase/server'

export type ProgramSlide = {
  id: string
  program_id: string
  image_url: string
  alt_text: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ProgramWithSlides = {
  id: string
  name: string
  slug: string
  category: string | null
  level: string | null
  short_description: string | null
  description: string | null
  duration_minutes: number | null
  image_path: string | null
  is_active: boolean
  is_featured: boolean
  sort_order: number
  slides: ProgramSlide[]
}

/** Fetch all active programs with their slides — for admin */
export async function getProgramsWithSlides(): Promise<ProgramWithSlides[]> {
  const supabase = await createClient()

  const [programsRes, slidesRes] = await Promise.all([
    supabase.from('programs').select('id, name, slug, category, level, short_description, description, duration_minutes, image_path, is_active, is_featured, sort_order').eq('is_active', true).order('name'),
    supabase.from('program_slides').select('*').order('sort_order'),
  ])

  const programs = programsRes.data ?? []
  const slides = slidesRes.data ?? []

  return programs.map(p => ({
    ...p,
    slides: slides.filter(s => s.program_id === p.id) as ProgramSlide[],
  }))
}

/** Fetch slides for a single program — for public display */
export async function getProgramSlides(programId: string): Promise<ProgramSlide[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('program_slides')
    .select('*')
    .eq('program_id', programId)
    .eq('is_active', true)
    .order('sort_order')
  return (data ?? []) as ProgramSlide[]
}

/**
 * Fetch the FIRST active slide URL for each program.
 * Returns a map of programId → imageUrl.
 * Used by homepage and programs list to show the uploaded slide as featured image.
 */
export async function getFirstProgramSlides(
  programIds: string[]
): Promise<Record<string, string>> {
  if (programIds.length === 0) return {}
  const supabase = await createClient()
  const { data } = await supabase
    .from('program_slides')
    .select('program_id, image_url, sort_order')
    .in('program_id', programIds)
    .eq('is_active', true)
    .order('sort_order')

  const result: Record<string, string> = {}
  ;(data ?? []).forEach(row => {
    // Only keep the first (lowest sort_order) slide per program
    if (!result[row.program_id]) {
      result[row.program_id] = row.image_url
    }
  })
  return result
}
