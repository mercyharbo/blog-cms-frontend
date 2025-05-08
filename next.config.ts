import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['img.freepik.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '/free-photo/**',
      },
    ],
  },
}

export default nextConfig
