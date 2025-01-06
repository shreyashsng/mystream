import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Update security headers to be less restrictive
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self' https: http:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https: http: data:",
      "media-src 'self' https: http:",
      "frame-src 'self' https: http:",
      "connect-src 'self' https: http:",
    ].join('; ')
  )

  return response
}

export const config = {
  matcher: [
    '/api/stream/:path*',
    '/dashboard/:path*'
  ]
} 