import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/')
    let url: string

    try {
      // Check if the path is a base64 encoded URL
      url = Buffer.from(path, 'base64').toString()
      if (!url.startsWith('http')) {
        throw new Error('Invalid URL')
      }
    } catch {
      // If not base64, assume it's a direct path
      url = `https://vidsrc.xyz/${path}`
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': request.headers.get('User-Agent') || '',
        'Referer': 'https://vidsrc.xyz/',
        'Origin': 'https://vidsrc.xyz'
      }
    })

    // Get the response body as an array buffer
    const data = await response.arrayBuffer()

    // Copy original headers
    const headers = new Headers()
    response.headers.forEach((value, key) => {
      // Skip headers that might reveal the origin
      if (!['server', 'alt-svc', 'report-to', 'nel'].includes(key.toLowerCase())) {
        headers.set(key, value)
      }
    })

    // Force CORS and caching headers
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Cache-Control', 'public, max-age=3600')

    return new NextResponse(data, {
      status: response.status,
      headers
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 })
  }
} 