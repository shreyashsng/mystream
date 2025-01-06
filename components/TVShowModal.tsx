'use client'
import { useState, useEffect } from 'react'
import VideoPlayerLayout from './VideoPlayerLayout'
import { ENDPOINTS } from '@/utils/constants'

interface TVShowModalProps {
  imdbId: string
  title: string
  totalSeasons?: string
  onClose: () => void
}

interface Episode {
  Title: string
  Episode: string
  Released: string
  imdbRating: string
}

interface Season {
  episodes: Episode[]
  seasonNumber: number
}

export default function TVShowModal({ imdbId, title, totalSeasons, onClose }: TVShowModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [seasons, setSeasons] = useState<Season[]>([])
  const [currentSeason, setCurrentSeason] = useState(1)
  const [currentEpisode, setCurrentEpisode] = useState(1)
  const [error, setError] = useState<string | null>(null)

  // Fetch episodes for current season
  useEffect(() => {
    const fetchSeasonDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(
          `https://www.omdbapi.com/?i=${imdbId}&Season=${currentSeason}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
        )
        const data = await response.json()
        
        if (data.Error) {
          throw new Error(data.Error)
        }
        
        if (data.Episodes) {
          setSeasons(prev => {
            const seasonExists = prev.some(s => s.seasonNumber === currentSeason)
            if (seasonExists) {
              return prev
            }
            return [...prev, {
              seasonNumber: currentSeason,
              episodes: data.Episodes
            }]
          })
        }
      } catch (error) {
        console.error('Error fetching season details:', error)
        setError(error instanceof Error ? error.message : 'Failed to load episodes')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSeasonDetails()
  }, [imdbId, currentSeason])

  const handleSeasonChange = (season: number) => {
    setCurrentSeason(season)
    setCurrentEpisode(1)
  }

  const handleEpisodeChange = (episode: number) => {
    setCurrentEpisode(episode)
  }

  const currentSeasonData = seasons.find(s => s.seasonNumber === currentSeason)
  const totalSeasonsNumber = totalSeasons ? parseInt(totalSeasons) : 1

  return (
    <VideoPlayerLayout
      title={title}
      subtitle={`Season ${currentSeason} Episode ${currentEpisode}`}
      onClose={onClose}
      onBack={onClose}
      isFullscreen={isFullscreen}
      onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
    >
      <div className="flex flex-col items-center min-h-[calc(100vh-4rem)]">
        {/* Video Player Container */}
        <div className={`w-full ${isFullscreen ? 'flex-1' : 'h-[60vh] max-w-6xl'}`}>
          <iframe
            src={ENDPOINTS.TV.WATCH(imdbId, currentSeason, currentEpisode)}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen"
          />
        </div>

        {/* Episode Selector */}
        {!isFullscreen && (
          <div className="w-full flex-1 bg-gray-900 overflow-auto">
            <div className="max-w-6xl mx-auto p-4">
              {/* Season Selector */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 sticky top-0 bg-gray-900 z-10
                           scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-800">
                {Array.from({ length: totalSeasonsNumber }, (_, i) => i + 1).map((season) => (
                  <button
                    key={season}
                    onClick={() => handleSeasonChange(season)}
                    className={`px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${
                      currentSeason === season
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    Season {season}
                  </button>
                ))}
              </div>

              {/* Episode Grid */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-red-600 border-t-transparent 
                               rounded-full animate-spin mx-auto"/>
                </div>
              ) : currentSeasonData ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentSeasonData.episodes.map((episode) => (
                    <button
                      key={episode.Episode}
                      onClick={() => handleEpisodeChange(Number(episode.Episode))}
                      className={`p-4 rounded-lg transition-all ${
                        currentEpisode === Number(episode.Episode)
                          ? 'bg-red-600/20 border-red-600'
                          : 'bg-gray-800/50 border-transparent'
                      } border hover:border-red-600/50 text-left`}
                    >
                      <div className="text-sm text-gray-400">Episode {episode.Episode}</div>
                      <div className="text-white font-medium truncate">{episode.Title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Rating: {episode.imdbRating}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No episodes found for this season
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        )}
      </div>
    </VideoPlayerLayout>
  )
} 