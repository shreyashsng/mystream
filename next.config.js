/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['m.media-amazon.com', 'img.omdbapi.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/stream/:path*',
        destination: 'https://vidsrc.xyz/embed/:path*',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
        ],
      },
    ]
  }
}

module.exports = nextConfig 