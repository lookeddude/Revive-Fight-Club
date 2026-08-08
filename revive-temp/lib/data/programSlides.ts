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
  is_active: boolean
  slides: ProgramSlide[]
}

/** Fetch all active programs with their slides — for admin */
export async function getProgramsWithSlides(): Promise<ProgramWithSlides[]> {
  const supabase = await createClient()

  const [programsRes, slidesRes] = await Promise.all([
    supabase.from('programs').select('id, name, slug, is_active').eq('is_active', true).order('name'),
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
