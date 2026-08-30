import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  images: {
    domains: [],
    unoptimized: true,
  },

  trailingSlash: true,
}

export default nextConfig