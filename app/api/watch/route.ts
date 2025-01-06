import { NextResponse } from 'next/server'

const VIDEO_BASE_URL = 'https://vidsrc.xyz/embed/movie/'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const decoded = Buffer.from(token, 'base64').toString()
      const [id, timestamp] = decoded.split('-')
      
      // Check if token is expired (e.g., 1 hour)
      if (Date.now() - Number(timestamp) > 3600000) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 })
      }

      // Fetch the content from vidsrc
      const response = await fetch(`${VIDEO_BASE_URL}${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch video content')
      }

      const html = await response.text()

      // Modify the HTML to remove any references to the original domain
      const modifiedHtml = html
        .replace(new RegExp(VIDEO_BASE_URL, 'g'), '/api/proxy/')
        .replace(/vidsrc\.xyz/g, request.headers.get('host') || '')
        .replace(/https:\/\/[^"']+/g, (url) => {
          if (url.includes('vidsrc.xyz')) {
            return `/api/proxy/${Buffer.from(url).toString('base64')}`
          }
          return url
        })

      return new NextResponse(modifiedHtml, {
        headers: {
          'Content-Type': 'text/html',
          'X-Frame-Options': 'SAMEORIGIN'
        }
      })
    } catch (error) {
      console.error('Token decode error:', error)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  } catch (error) {
    console.error('Watch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 