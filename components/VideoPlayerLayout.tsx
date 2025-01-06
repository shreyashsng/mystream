'use client'
import { ArrowLeft, X, Maximize2, Minimize2 } from 'lucide-react'

interface VideoPlayerLayoutProps {
  title: string
  onClose: () => void
  onBack?: () => void
  children: React.ReactNode
  isFullscreen: boolean
  onToggleFullscreen: () => void
  subtitle?: string
}

export default function VideoPlayerLayout({
  title,
  subtitle,
  onClose,
  onBack,
  children,
  isFullscreen,
  onToggleFullscreen
}: VideoPlayerLayoutProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 text-white/80 hover:text-white rounded-full
                           hover:bg-white/10 transition-all"
                  title="Back to Search"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="flex flex-col">
                <h2 className="text-white font-medium truncate">{title}</h2>
                {subtitle && (
                  <p className="text-sm text-gray-400 truncate">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleFullscreen}
                className="p-2 text-white/80 hover:text-white rounded-full
                         hover:bg-white/10 transition-all"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white rounded-full
                         hover:bg-white/10 transition-all"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  )
} 