import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ── Image Optimization ────────────────────────────────────────
  images: {
    // Auto-convert to WebP/AVIF — massive size reduction
    formats: ['image/avif', 'image/webp'],
    // Optimized size breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Aggressive caching — 30 days
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'hnmtjcpmdywwtafgexxk.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // ── Compression ───────────────────────────────────────────────
  compress: true,

  // ── Production optimizations ──────────────────────────────────
  poweredByHeader: false,

  // ── Headers for caching static assets ────────────────────────
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
      {
        source: '/_next/static/:path*',
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
