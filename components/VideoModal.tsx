'use client'
import { useState, useEffect } from 'react'
import VideoPlayerLayout from './VideoPlayerLayout'
import { ENDPOINTS } from '@/utils/constants'

interface VideoModalProps {
  imdbId: string
  title: string
  onClose: () => void
  onBack: () => void
}

export default function VideoModal({ imdbId, title, onClose, onBack }: VideoModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    // Cleanup function
    return () => {
      setIsLoading(true)
      setIsFullscreen(false)
    }
  }, [])

  return (
    <VideoPlayerLayout
      title={title}
      onClose={onClose}
      onBack={onBack}
      isFullscreen={isFullscreen}
      onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
    >
      <div className="flex flex-col items-center min-h-[calc(100vh-4rem)]">
        {/* Video Player Container */}
        <div className={`w-full ${isFullscreen ? 'flex-1' : 'h-[60vh] max-w-6xl'}`}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-red-600 rounded-full 
                             border-t-transparent animate-spin"></div>
              </div>
            </div>
          )}

          <iframe
            src={ENDPOINTS.MOVIE.WATCH(imdbId)}
            className={`w-full h-full border-0 transition-opacity duration-500
                     ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            allowFullScreen
            onLoad={handleIframeLoad}
            allow="autoplay; fullscreen"
          />
        </div>

        {/* Optional: Add movie details or recommendations section here */}
        {!isFullscreen && (
          <div className="w-full flex-1 bg-gray-900 overflow-auto">
            <div className="max-w-6xl mx-auto p-4">
              {/* You can add movie details, recommendations, or other content here */}
            </div>
          </div>
        )}
      </div>
    </VideoPlayerLayout>
  )
} 