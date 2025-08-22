// Generate a simple SVG placeholder image as a data URL
export function generatePlaceholderImage(
  width: number = 400,
  height: number = 300,
  text: string = 'Image',
  bgColor: string = '#f3f4f6',
  textColor: string = '#6b7280'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" 
            fill="${textColor}" text-anchor="middle" dy=".3em">
        ${text}
      </text>
      <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="12" 
            fill="${textColor}" text-anchor="middle">
        📷
      </text>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Generate a simple colored rectangle as a data URL
export function generateSimplePlaceholder(
  width: number = 400,
  height: number = 300,
  color: string = '#e5e7eb'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}
