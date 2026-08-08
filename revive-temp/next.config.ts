import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
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
        // Supabase storage for trainer, program, gallery images
        hostname: 'hnmtjcpmdywwtafgexxk.supabase.co',
      },
    ],
  },
}

export default nextConfig
