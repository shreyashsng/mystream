/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'm.media-amazon.com', // OMDB images
      'image.tmdb.org',     // TMDB images if used
    ],
  },
  // Add CORS headers for video player
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  }
}

module.exports = nextConfig 