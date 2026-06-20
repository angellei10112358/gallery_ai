import { useState } from 'react'
import { useImages, useFilteredImages, useAllTags } from './hooks/useImages'
import { useTheme } from './hooks/useTheme'
import Header from './components/Header'
import TagFilter from './components/TagFilter'
import SortSelector from './components/SortSelector'
import GalleryGrid from './components/GalleryGrid'
import Footer from './components/Footer'
import type { SortMode } from './types/gallery'

export default function App() {
  const { data, loading, error } = useImages()
  const defaultDark = data ? data.config.defaultTheme === 'dark' : true
  const { dark, toggle: toggleTheme } = useTheme(defaultDark)

  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sort, setSort] = useState<SortMode>('newest')

  const allImages = data?.images ?? []
  const config = data?.config

  const allTags = useAllTags(allImages)
  const filteredImages = useFilteredImages(allImages, search, selectedTags, sort)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        加载失败: {error}
      </div>
    )
  }

  if (!config) return null

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        config={config}
        dark={dark}
        onToggleTheme={toggleTheme}
        search={search}
        onSearchChange={setSearch}
      />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <SortSelector value={sort} onChange={setSort} />
          <TagFilter allTags={allTags} selected={selectedTags} onToggle={toggleTag} />
        </div>
        <GalleryGrid images={filteredImages} />
      </main>
      <Footer githubUrl={config.githubUrl} imageCount={allImages.length} />
    </div>
  )
}
