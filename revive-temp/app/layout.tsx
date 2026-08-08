import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import './globals.css'

// Preload only needed weights — faster font load
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'Revive Fight Club | MMA & Fitness in Bengaluru',
    template: '%s | Revive Fight Club',
  },
  description:
    'Elite MMA, Muay Thai, BJJ and fitness training in Frazer Town, Bengaluru. Book a trial class today.',
  keywords: [
    'MMA Bengaluru',
    'fight club Bengaluru',
    'Muay Thai Bengaluru',
    'BJJ Bengaluru',
    'boxing Bengaluru',
    'kickboxing Bengaluru',
    'fitness Frazer Town',
    'combat sports training',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Revive Fight Club',
    title: 'Revive Fight Club | MMA & Fitness in Bengaluru',
    description:
      'Elite MMA, Muay Thai, BJJ and fitness training in Frazer Town, Bengaluru.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revive Fight Club | MMA & Fitness in Bengaluru',
    description:
      'Elite MMA, Muay Thai, BJJ and fitness training in Frazer Town, Bengaluru.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        {/* Preconnect to Supabase for faster API + image loads */}
        <link rel="preconnect" href="https://hnmtjcpmdywwtafgexxk.supabase.co" />
        <link rel="dns-prefetch" href="https://hnmtjcpmdywwtafgexxk.supabase.co" />
        {/* Preconnect to Google Fonts CDN */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#0d0c0b] text-[#f0ede8] font-[family-name:var(--font-inter)] antialiased">
        {children}
      </body>
    </html>
  )
}
