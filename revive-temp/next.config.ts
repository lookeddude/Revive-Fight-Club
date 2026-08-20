import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ── Image Optimization ────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000, // 30 days
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

  // ── Compression ───────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  // ── Allow large video uploads (up to 50 MB) ──────────────────
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },

  // ── Static asset caching (only for user-uploaded assets, not _next/static) ─
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
