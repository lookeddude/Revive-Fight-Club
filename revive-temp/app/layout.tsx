import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-inter',
  display: 'swap',
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
    <html lang="en" className={`${outfit.variable} ${inter.variable} dark`}>
      <body className="bg-[#121413] text-[#e2e3e1] font-[family-name:var(--font-inter)] antialiased">
        {children}
      </body>
    </html>
  )
}
