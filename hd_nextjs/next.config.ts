import type { NextConfig } from 'next'

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'hide-design-q2o9.onrender.com' },
    ],
  },
}

module.exports = nextConfig

// export default nextConfig