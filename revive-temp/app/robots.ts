import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo.config'

/**
 * robots.ts — Production robots.txt
 * Served at: /robots.txt
 *
 * Allows all major crawlers on public pages.
 * Blocks admin, auth, API, invite and login routes.
 * References production sitemap (NOT Vercel URL).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/auth/',
          '/login',
          '/invite/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
