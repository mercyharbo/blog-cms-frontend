import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['img.freepik.com', 'example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '/free-photo/**',
      },
      {
        protocol: 'https',
        hostname: 'fnyhkcrguyptmwcjuhqz.supabase.co',
        pathname: '/storage/v1/object/public/media/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/auth/v1/verify',
        destination: '/auth/callback',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
