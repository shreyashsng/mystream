'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WatchPage({ params }: { params: { imdbId: string } }) {
  const router = useRouter()
  const videoUrl = process.env.NEXT_PUBLIC_VIDEO_BASE_URL

  useEffect(() => {
    if (!params.imdbId.startsWith('tt')) {
      router.push('/')
    }
  }, [params.imdbId, router])

  return (
    <div className="min-h-screen bg-black">
      <iframe
        src={`${videoUrl}${params.imdbId}`}
        className="w-full h-screen"
        allowFullScreen
      />
    </div>
  )
} 