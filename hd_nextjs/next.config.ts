import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [],
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
}

export default nextConfig