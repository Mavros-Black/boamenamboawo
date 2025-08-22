'use client'

import React from 'react'

interface PlaceholderImageProps {
  width?: number
  height?: number
  text?: string
  className?: string
  alt?: string
}

export default function PlaceholderImage({
  width = 400,
  height = 300,
  text = 'Image',
  className = '',
  alt = 'Placeholder image'
}: PlaceholderImageProps) {
  return (
    <div
      className={`bg-gray-200 flex items-center justify-center text-gray-600 font-medium ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        minWidth: `${width}px`,
        minHeight: `${height}px`
      }}
      role="img"
      aria-label={alt}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">📷</div>
        <div className="text-sm">{text}</div>
      </div>
    </div>
  )
}
