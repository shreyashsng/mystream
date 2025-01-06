/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['m.media-amazon.com', 'img.omdbapi.com'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['app', 'components', 'utils']
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

export default nextConfig 