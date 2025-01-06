import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const id = searchParams.get('id')
    const season = searchParams.get('season')
    const episode = searchParams.get('episode')

    if (!type || !id) {
      return new NextResponse('Missing parameters', { status: 400 })
    }

    // Construct the real URL server-side
    const baseUrl = 'https://vidsrc.xyz/embed'
    const url = type === 'movie' 
      ? `${baseUrl}/movie/${id}`
      : `${baseUrl}/tv?imdb=${id}&season=${season}&episode=${episode}`

    // Redirect to the actual video source
    return NextResponse.redirect(url)
  } catch (error) {
    console.error('Streaming error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 