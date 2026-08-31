import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ── Image Optimization ────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    // avif quality 70 (smaller), webp quality 80 (compat fallback)
    qualities: [70, 80],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 1 year CDN cache for Next.js-optimised images
    minimumCacheTTL: 31536000,
    // Serve optimized images inline for better CDN caching
    contentDispositionType: 'inline',
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      {
        protocol: 'https',
        hostname: 'hnmtjcpmdywwtafgexxk.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // ── Compression + Security ────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  // ── Server actions ────────────────────────────────────────────
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },

  // ── HTTP Headers ──────────────────────────────────────────────
  async headers() {
    return [
      // 1 year immutable cache for all static assets (images, fonts, etc.)
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff2|woff)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Stale-while-revalidate for HTML pages — serve stale while fetching fresh
      {
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://hnmtjcpmdywwtafgexxk.supabase.co https://images.unsplash.com https://lh3.googleusercontent.com",
              "connect-src 'self' https://hnmtjcpmdywwtafgexxk.supabase.co wss://hnmtjcpmdywwtafgexxk.supabase.co https://lumberjack.razorpay.com https://api.razorpay.com https://www.google-analytics.com https://www.googletagmanager.com",
              "frame-src https://api.razorpay.com https://checkout.razorpay.com",
              "media-src 'self' https://hnmtjcpmdywwtafgexxk.supabase.co",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
