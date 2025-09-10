import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Disable strict mode if it's causing hydration issues
  reactStrictMode: false,
}

export default nextConfig
