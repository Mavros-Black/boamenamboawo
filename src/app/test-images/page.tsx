'use client'

import { useState } from 'react'

export default function TestImages() {
  const [testUrls] = useState([
    'https://picsum.photos/400/300?random=1',
    'https://picsum.photos/400/300?random=2&blur=2',
    'https://via.placeholder.com/400x300/cccccc/666666?text=Test',
    'https://dummyimage.com/400x300/cccccc/666666&text=Test'
  ])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Test Image URLs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testUrls.map((url, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2">Test {index + 1}</h3>
            <p className="text-sm text-gray-600 mb-2 break-all">{url}</p>
            <div className="h-48 bg-gray-200 rounded">
              <img 
                src={url} 
                alt={`Test ${index + 1}`}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  console.error(`Image ${index + 1} failed to load:`, url)
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const placeholder = document.createElement('div')
                  placeholder.className = 'w-full h-full flex items-center justify-center text-red-600'
                  placeholder.innerHTML = `
                    <div class="text-center">
                      <div class="text-4xl mb-2">❌</div>
                      <div class="text-sm">Failed to load</div>
                    </div>
                  `
                  target.parentNode?.appendChild(placeholder)
                }}
                onLoad={() => {
                  console.log(`Image ${index + 1} loaded successfully:`, url)
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-yellow-50 p-4 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Check which images load successfully</li>
          <li>Look at the browser console for load/error messages</li>
          <li>Use the working URLs for your fallback uploads</li>
        </ol>
      </div>
    </div>
  )
}
