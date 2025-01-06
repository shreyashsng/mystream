'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import VideoModal from '@/components/VideoModal'
import { Search, History, LogOut, Trash2 } from 'lucide-react'
import { supabase } from '@/utils/supabase'
import WatchHistoryModal from '@/components/WatchHistoryModal'
import TVShowModal from '@/components/TVShowModal'
import { ENDPOINTS, ContentType } from '@/utils/constants'

interface Movie {
  Title: string
  Year: string
  imdbID: string
  Poster: string
  Type?: 'movie' | 'series'
}

interface SearchHistory {
  id: string
  movie_id: string
  movie_title: string
  movie_year: string
  movie_poster: string
  created_at: string
}

interface TVShow extends Movie {
  Type: 'series'
  totalSeasons?: string
}

export default function Dashboard() {
  const [search, setSearch] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [selectedImdbId, setSelectedImdbId] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedShow, setSelectedShow] = useState<TVShow | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [contentType, setContentType] = useState<ContentType>('movie')

  // Fetch search history
  useEffect(() => {
    const fetchSearchHistory = async () => {
      if (!user) return
      
      try {
        const { data, error } = await supabase
          .from('search_history')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) throw error
        setSearchHistory(data || [])
      } catch (error) {
        console.error('Error fetching search history:', error)
      } finally {
        setIsLoadingHistory(false)
      }
    }

    fetchSearchHistory()
  }, [user])

  // Save to search history with upsert
  const saveToHistory = async (movie: Movie) => {
    if (!user) return

    try {
      // Check if record exists
      const { data: existingRecord, error: checkError } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .eq('movie_id', movie.imdbID)
        .single()

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no record found
        console.error('Error checking history:', checkError.message)
        throw checkError
      }

      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('search_history')
          .update({
            created_at: new Date().toISOString()
          })
          .eq('id', existingRecord.id)

        if (updateError) {
          console.error('Error updating history:', updateError.message)
          throw updateError
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('search_history')
          .insert({
            user_id: user.id,
            movie_id: movie.imdbID,
            movie_title: movie.Title,
            movie_year: movie.Year,
            movie_poster: movie.Poster,
            created_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('Error inserting history:', insertError.message)
          throw insertError
        }
      }

      // Refresh search history
      const { data: newHistory, error: fetchError } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (fetchError) {
        console.error('Error fetching updated history:', fetchError.message)
        throw fetchError
      }

      if (newHistory) {
        setSearchHistory(newHistory)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error saving to history:', error.message)
      } else {
        console.error('Unknown error saving to history:', error)
      }
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    const searchContent = async () => {
      if (search.length < 3) {
        setMovies([])
        return
      }

      setIsLoading(true)
      try {
        const endpoint = contentType === 'movie' ? ENDPOINTS.MOVIE : ENDPOINTS.TV
        const response = await fetch(endpoint.SEARCH(encodeURIComponent(search)))
        const data = await response.json()
        
        if (data.Search) {
          const contentWithDetails = await Promise.all(
            data.Search.map(async (item: Movie) => {
              const detailResponse = await fetch(endpoint.DETAILS(item.imdbID))
              const detailData = await detailResponse.json()
              return {
                ...item,
                Type: contentType,
                totalSeasons: detailData.totalSeasons
              }
            })
          )
          setMovies(contentWithDetails)
        }
      } catch (error) {
        console.error('Error fetching content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimeout = setTimeout(searchContent, 300)
    return () => clearTimeout(debounceTimeout)
  }, [search, contentType])

  const handleMovieSelect = async (content: Movie | TVShow) => {
    if ('Type' in content && content.Type === 'series') {
      setSelectedShow(content as TVShow)
    } else {
      setSelectedMovie(content)
      setSelectedImdbId(content.imdbID)
      setIsModalOpen(true)
    }
    setShowResults(false)
    setSearch('')
    await saveToHistory(content)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const clearHistory = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        console.error('Error clearing history:', error.message)
        throw error
      }

      setSearchHistory([])
    } catch (error) {
      console.error('Error clearing history:', error)
    }
  }

  if (loading || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900">
      {/* Navbar */}
      <nav className="bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-white">
              my<span className="text-red-600">stream</span>
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHistory(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors relative"
                title="Watch History"
              >
                <History size={20} />
                {searchHistory.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-white 
                               text-xs flex items-center justify-center">
                    {searchHistory.length}
                  </span>
                )}
              </button>
              <span className="text-gray-400 text-sm hidden md:block">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Content Type Selector */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setContentType('movie')}
              className={`px-6 py-3 rounded-lg transition-all ${
                contentType === 'movie'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setContentType('series')}
              className={`px-6 py-3 rounded-lg transition-all ${
                contentType === 'series'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              TV Shows
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder={
                contentType === 'movie'
                  ? 'Search movies... (e.g., Inception, The Dark Knight)'
                  : 'Search TV shows... (e.g., Breaking Bad, Game of Thrones)'
              }
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setShowResults(true)
              }}
              onFocus={() => setShowResults(true)}
              className="w-full px-6 py-4 pl-12 rounded-xl bg-white/10 border-2 border-white/20 
                      text-white placeholder-gray-400 focus:outline-none focus:border-red-600
                      transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Search Results Dropdown */}
          {showResults && (search.length > 2 || movies.length > 0) && (
            <div className="absolute mt-2 w-full max-w-2xl bg-gray-900/95 backdrop-blur-sm rounded-xl 
                        border-2 border-white/10 shadow-xl max-h-[60vh] overflow-y-auto z-50">
              {isLoading ? (
                <div className="p-4 text-center text-gray-400">
                  <div className="w-6 h-6 border-2 border-red-600 border-t-transparent 
                               rounded-full animate-spin mx-auto"/>
                </div>
              ) : movies.length > 0 ? (
                <div className="p-2">
                  {movies.map((item) => (
                    <button
                      key={item.imdbID}
                      onClick={() => handleMovieSelect(item)}
                      className="flex items-center gap-4 w-full p-2 hover:bg-white/5 
                              rounded-lg transition-colors duration-200 text-left"
                    >
                      <img
                        src={item.Poster !== 'N/A' ? item.Poster : '/no-poster.png'}
                        alt={item.Title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="text-white font-semibold">{item.Title}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-400 text-sm">{item.Year}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full 
                                        bg-gray-800 text-gray-400 capitalize">
                            {contentType}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : search.length > 2 ? (
                <div className="p-4 text-center text-gray-400">
                  No movies found
                </div>
              ) : null}
            </div>
          )}
        </div>

        {showHistory && (
          <WatchHistoryModal
            history={searchHistory}
            isLoading={isLoadingHistory}
            onClose={() => setShowHistory(false)}
            onClear={clearHistory}
            onSelectMovie={(movie) => {
              handleMovieSelect(movie)
              setShowHistory(false)
            }}
          />
        )}
      </div>

      {/* Video Modal */}
      {isModalOpen && selectedMovie && (
        <VideoModal
          imdbId={selectedImdbId}
          title={selectedMovie.Title}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedImdbId('')
            setSelectedMovie(null)
          }}
          onBack={() => {
            setIsModalOpen(false)
            setSelectedImdbId('')
            setSelectedMovie(null)
            setShowResults(true)
          }}
        />
      )}

      {selectedShow && (
        <TVShowModal
          imdbId={selectedShow.imdbID}
          title={selectedShow.Title}
          totalSeasons={selectedShow.totalSeasons}
          onClose={() => {
            setSelectedShow(null)
            setShowResults(true)
          }}
        />
      )}
    </div>
  )
} 