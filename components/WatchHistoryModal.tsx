'use client'
import { useState } from 'react'
import { X, History, Trash2 } from 'lucide-react'

interface Movie {
  Title: string
  Year: string
  imdbID: string
  Poster: string
}

interface SearchHistory {
  id: string
  movie_id: string
  movie_title: string
  movie_year: string
  movie_poster: string
  created_at: string
}

interface WatchHistoryModalProps {
  history: SearchHistory[]
  isLoading: boolean
  onClose: () => void
  onClear: () => Promise<void>
  onSelectMovie: (movie: Movie) => void
}

export default function WatchHistoryModal({
  history,
  isLoading,
  onClose,
  onClear,
  onSelectMovie
}: WatchHistoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="text-red-600" size={24} />
            <h2 className="text-xl font-semibold text-white">Watch History</h2>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="px-4 py-2 text-sm text-red-500 hover:text-red-400 
                         hover:bg-red-500/10 rounded-lg transition-all duration-200
                         flex items-center gap-2"
              >
                <Trash2 size={16} />
                Clear History
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-full
                       hover:bg-white/10 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent 
                           rounded-full animate-spin mx-auto"/>
            </div>
          ) : history.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectMovie({
                    imdbID: item.movie_id,
                    Title: item.movie_title,
                    Year: item.movie_year,
                    Poster: item.movie_poster
                  })}
                  className="group relative aspect-[2/3] rounded-lg overflow-hidden 
                           hover:ring-2 ring-red-600 transition-all duration-300"
                >
                  <img
                    src={item.movie_poster !== 'N/A' ? item.movie_poster : '/no-poster.png'}
                    alt={item.movie_title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 
                               to-transparent opacity-0 group-hover:opacity-100 transition-opacity
                               flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold text-sm">{item.movie_title}</h3>
                    <p className="text-gray-400 text-xs">{item.movie_year}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No watch history yet. Start searching for movies!
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 