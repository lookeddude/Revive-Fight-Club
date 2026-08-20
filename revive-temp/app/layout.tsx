import type { Metadata } from 'next'
import { Outfit, Barlow } from 'next/font/google'
import { LenisProvider } from '@/components/providers/LenisProvider'
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
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${barlow.variable}`}>
      <head>
        {/* Preconnect to Supabase for faster API + image loads */}
        <link rel="preconnect" href="https://hnmtjcpmdywwtafgexxk.supabase.co" />
        <link rel="dns-prefetch" href="https://hnmtjcpmdywwtafgexxk.supabase.co" />
        {/* Preconnect to Google Fonts CDN */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#0d0c0b] text-[#f0ede8] font-[family-name:var(--font-body)] antialiased">
        <a 
          href="#main" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-[#ff571a] focus:text-black focus:font-bold focus:uppercase focus:tracking-widest"
        >
          Skip to content
        </a>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
