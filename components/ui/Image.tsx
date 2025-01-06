'use client'
import NextImage from 'next/image'
import { useState } from 'react'

interface ImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export default function Image({ src, alt, width, height, className = '' }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`relative ${className}`}>
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`duration-700 ease-in-out ${
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
        }`}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  )
} 