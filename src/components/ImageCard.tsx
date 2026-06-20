import { useState, useCallback } from 'react'
import type { ManifestEntry } from '../types/gallery'

const BASE = import.meta.env.BASE_URL

interface Props {
  image: ManifestEntry
  onClick: () => void
}

export default function ImageCard({ image, onClick }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleLoad = useCallback(() => setLoaded(true), [])
  const handleError = useCallback(() => setError(true), [])

  const src = `${BASE}${image.formats.webp[0]}`
  const srcSet = image.formats.webp
    .map((p, i) => `${BASE}${p} ${[400, 800, 1600][i]}w`)
    .join(', ')

  return (
    <div
      className="relative overflow-hidden rounded-xl cursor-pointer group bg-gray-100 dark:bg-gray-800"
      style={{ aspectRatio: image.aspectRatio }}
      onClick={onClick}
      onContextMenu={image.model ? undefined : undefined}
    >
      {!loaded && (
        <img
          src={image.lqip}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        srcSet={srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        alt={image.title}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-500 ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } group-hover:scale-105`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
        <p className="text-white text-sm font-medium truncate">{image.title}</p>
      </div>
    </div>
  )
}
