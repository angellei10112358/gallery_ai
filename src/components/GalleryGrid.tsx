import { useState, useMemo, useCallback } from 'react'
import type { ManifestEntry } from '../types/gallery'
import ImageCard from './ImageCard'
import Lightbox from './Lightbox'

interface Props {
  images: ManifestEntry[]
}

const PAGE_SIZE = 50

export default function GalleryGrid({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  const displayImages = useMemo(
    () => images.slice(0, page * PAGE_SIZE),
    [images, page]
  )
  const hasMore = displayImages.length < images.length

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    document.body.classList.add('lightbox-open')
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
    document.body.classList.remove('lightbox-open')
  }, [])

  if (images.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        没有匹配的图片
      </div>
    )
  }

  return (
    <>
      <div className="masonry">
        {displayImages.map((img, i) => (
          <ImageCard key={img.id} image={img} onClick={() => openLightbox(i)} />
        ))}
      </div>
      {hasMore && (
        <div className="text-center py-8">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            加载更多 ({images.length - displayImages.length} 张)
          </button>
        </div>
      )}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onChange={setLightboxIndex}
        />
      )}
    </>
  )
}
