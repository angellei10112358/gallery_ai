import { useEffect, useRef, useState, useCallback } from 'react'
import type { ManifestEntry } from '../types/gallery'

const BASE = import.meta.env.BASE_URL

interface Props {
  images: ManifestEntry[]
  currentIndex: number
  onClose: () => void
  onChange: (index: number) => void
}

export default function Lightbox({ images, currentIndex, onClose, onChange }: Props) {
  const img = images[currentIndex]
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const resetTransform = useCallback(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    setLoaded(false)
    resetTransform()
  }, [currentIndex, resetTransform])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          onChange((currentIndex - 1 + images.length) % images.length)
          break
        case 'ArrowRight':
          onChange((currentIndex + 1) % images.length)
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentIndex, images.length, onClose, onChange])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      setZoom((z) => Math.max(1, Math.min(5, z + delta)))
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current || e.changedTouches.length !== 1) return
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y
      touchStartRef.current = null

      if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 2) {
        onChange(dx > 0 ? (currentIndex - 1 + images.length) % images.length : (currentIndex + 1) % images.length)
      }
    },
    [currentIndex, images.length, onChange],
  )

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  const src = `${BASE}${img.formats.webp[2] || img.formats.webp[0]}`
  const fileSizeMB = (img.fileSize / (1024 * 1024)).toFixed(1)

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center touch-none"
      onClick={handleOverlayClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors"
        aria-label="关闭"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        onClick={() => onChange((currentIndex - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/60 hover:text-white transition-colors"
        aria-label="上一张"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => onChange((currentIndex + 1) % images.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/60 hover:text-white transition-colors"
        aria-label="下一张"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transition: zoom === 1 ? 'transform 0.2s ease' : 'none',
        }}
      >
        {!loaded && (
          <img src={img.lqip} alt="" className="absolute inset-0 w-full h-full object-contain blur-xl scale-110" aria-hidden="true" />
        )}
        <img
          ref={imgRef}
          src={src}
          alt={img.title}
          className={`max-w-full max-h-[90vh] object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          draggable={false}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-between text-white">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium truncate">{img.title}</h3>
            {img.description && <p className="text-sm text-gray-300 truncate">{img.description}</p>}
          </div>
          <button
            onClick={() => setShowInfo((v) => !v)}
            className="ml-4 p-2 text-white/60 hover:text-white transition-colors shrink-0"
            aria-label="图片信息"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        {showInfo && (
          <div className="mt-2 text-sm text-gray-300 space-y-1">
            <p>文件名: {img.filename}</p>
            <p>尺寸: {img.width} × {img.height}</p>
            <p>大小: {fileSizeMB} MB</p>
            <p>日期: {img.date}</p>
            {img.model && <p>模型: {img.model}</p>}
            {img.prompt && <p>提示词: {img.prompt}</p>}
            {img.tags.length > 0 && <p>标签: {img.tags.join(', ')}</p>}
          </div>
        )}
      </div>

      <div className="absolute top-4 left-4 text-white/60 text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {zoom > 1 && (
        <button
          onClick={resetTransform}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded bg-white/20 text-white text-sm hover:bg-white/30 transition-colors"
        >
          重置 ({Math.round(zoom * 100)}%)
        </button>
      )}
    </div>
  )
}
