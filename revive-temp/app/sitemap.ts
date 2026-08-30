import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { SITE_URL } from '@/lib/seo.config'

/**
 * sitemap.ts — Production XML Sitemap
 * Served at: /sitemap.xml
 *
 * Includes all public, canonical, indexable pages.
 * Dynamic program/trainer slugs are fetched from Supabase (public anon key — RLS allows reads).
 * Uses production domain (https://revivefightclub.com) only.
 *
 * Excluded:
 *  - /admin/*  (private)
 *  - /login    (auth)
 *  - /invite/* (private)
 *  - /auth/*   (auth callback)
 *  - /book-trial (noindex form)
 */

// Revalidate sitemap every 24 hours so new programs/trainers appear automatically
export const revalidate = 86400

function url(path: string, priority: number, changeFreq: MetadataRoute.Sitemap[number]['changeFrequency']): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch active program and trainer slugs using anon key (public data, no auth needed)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [programsRes, trainersRes, workshopsRes] = await Promise.all([
    supabase.from('programs').select('slug, updated_at').eq('is_active', true).order('sort_order'),
    supabase.from('trainers').select('slug, updated_at').eq('is_active', true),
    supabase.from('workshops').select('slug, updated_at').eq('status', 'published').order('start_datetime', { ascending: true }),
  ])

  const programRoutes: MetadataRoute.Sitemap = (programsRes.data ?? []).map(p => ({
    url: `${SITE_URL}/programs/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const trainerRoutes: MetadataRoute.Sitemap = (trainersRes.data ?? []).map(t => ({
    url: `${SITE_URL}/trainers/${t.slug}`,
    lastModified: t.updated_at ? new Date(t.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const workshopRoutes: MetadataRoute.Sitemap = (workshopsRes.data ?? []).map((w: { slug: string; updated_at?: string }) => ({
    url: `${SITE_URL}/workshops/${w.slug}`,
    lastModified: w.updated_at ? new Date(w.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  return [
    // ── Core pages ──────────────────────────────────────────────
    url('/',           1.0, 'weekly'),
    url('/programs',   0.9, 'weekly'),
    url('/workshops',  0.85, 'weekly'),
    url('/trainers',   0.8, 'weekly'),
    url('/membership', 0.8, 'monthly'),
    url('/about',      0.7, 'monthly'),
    url('/contact',    0.7, 'monthly'),
    url('/reviews',    0.6, 'weekly'),
    url('/schedule',   0.6, 'weekly'),

    // ── Dynamic pages ───────────────────────────────────────────
    ...programRoutes,
    ...trainerRoutes,
    ...workshopRoutes,

    // ── Legal ───────────────────────────────────────────────────
    url('/privacy-policy',   0.2, 'yearly'),
    url('/terms-of-service', 0.2, 'yearly'),
  ]
}
