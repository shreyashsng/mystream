'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleStartWatching = () => {
    router.push('/login')
  }

  if (loading || user) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 relative overflow-hidden">
      {/* Background Video/Image Overlay */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      <div className="container mx-auto px-4">
        {/* Navigation */}
        <nav className="py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">
              my<span className="text-red-600">stream</span>
            </h1>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Unlimited Movies & TV Shows<br />
            <span className="text-red-600">Anytime, Anywhere</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl">
            Stream your favorite content instantly. Join now and start watching the best movies and TV shows.
          </p>
          
          {/* CTA Button */}
          <button
            onClick={handleStartWatching}
            className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-full
                     hover:bg-red-700 transform hover:scale-105 transition-all duration-300
                     shadow-lg hover:shadow-red-600/30"
          >
            Start Watching Now
          </button>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="text-red-600 text-2xl mb-4">✨</div>
              <h3 className="text-white text-xl font-semibold mb-2">HD Quality</h3>
              <p className="text-gray-400">Crystal clear streaming quality for the best experience</p>
            </div>
            <div className="text-center p-6">
              <div className="text-red-600 text-2xl mb-4">🎬</div>
              <h3 className="text-white text-xl font-semibold mb-2">Latest Content</h3>
              <p className="text-gray-400">Access to the newest movies and TV shows</p>
            </div>
            <div className="text-center p-6">
              <div className="text-red-600 text-2xl mb-4">📱</div>
              <h3 className="text-white text-xl font-semibold mb-2">Watch Everywhere</h3>
              <p className="text-gray-400">Stream on your favorite devices anytime</p>
            </div>
          </div>
        </div>
        </div>
      </main>
  )
}
