import type { Metadata } from 'next'
import Script from 'next/script'
import { Outfit, Barlow } from 'next/font/google'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat'
import { SITE_URL, BUSINESS, DEFAULT_OG_IMAGE, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from '@/lib/seo.config'
import './globals.css'

// Preload only needed weights — faster font load
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
  preload: true,
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
})

/**
 * metadataBase is REQUIRED for Next.js to resolve relative OG/canonical URLs correctly.
 * Must be the production domain — never the Vercel testing URL.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'MMA Bengaluru',
    'fight club Bengaluru',
    'Muay Thai Bengaluru',
    'Jiu-Jitsu Bengaluru',
    'boxing Bengaluru',
    'kickboxing Bengaluru',
    'fitness Fraser Town',
    'combat sports training Bengaluru',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: BUSINESS.brandName,
    title: DEFAULT_TITLE.default,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 512,
        height: 512,
        alt: 'Revive Fight Club — MMA & Fitness Gym in Bengaluru',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE.default,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

/**
 * Global JSON-LD Structured Data
 * ─────────────────────────────────
 * WebSite: establishes the site entity
 * LocalBusiness / SportsActivityLocation: local SEO for Bengaluru
 *
 * Rules followed:
 *  - No AggregateRating (would require verified third-party source)
 *  - No fabricated hours, coordinates, or price range
 *  - Only verified NAP information
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: BUSINESS.brandName,
      url: SITE_URL,
      description: DEFAULT_DESCRIPTION,
      inLanguage: 'en-IN',
    },
    {
      '@type': ['LocalBusiness', 'SportsActivityLocation'],
      '@id': `${SITE_URL}/#localbusiness`,
      name: BUSINESS.name,
      alternateName: BUSINESS.brandName,
      url: SITE_URL,
      telephone: BUSINESS.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS.address.street,
        addressLocality: BUSINESS.address.locality,
        addressRegion: BUSINESS.address.state,
        postalCode: BUSINESS.address.postalCode,
        addressCountry: BUSINESS.address.country,
      },
      image: DEFAULT_OG_IMAGE,
      sameAs: [],
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN" className={`${outfit.variable} ${barlow.variable}`}>
      <head>
        {/* JSON-LD Structured Data — stays in head for SEO crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Critical preconnects — establishes TCP+TLS early for main resources */}
        <link rel="preconnect" href="https://hnmtjcpmdywwtafgexxk.supabase.co" />
        <link rel="dns-prefetch" href="https://hnmtjcpmdywwtafgexxk.supabase.co" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preconnect GTM only if GA4 is configured */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <link rel="preconnect" href="https://www.googletagmanager.com" />
        )}
      </head>
      <body className="bg-[#0E0C10] text-[#FCFDFD] font-[family-name:var(--font-body)] antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-[#FCFDFD] focus:text-[#0E0C10] focus:font-bold focus:uppercase focus:tracking-widest"
        >
          Skip to content
        </a>
        <LenisProvider>
          {children}
        </LenisProvider>
        <WhatsAppFloat />

        {/* Google Analytics 4 — deferred until after page is interactive (non-blocking) */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                    send_page_view: true
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}
