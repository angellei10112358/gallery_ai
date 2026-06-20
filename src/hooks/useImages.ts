import { useState, useEffect } from 'react'
import type { ManifestData, ManifestEntry, SortMode } from '../types/gallery'

const BASE = import.meta.env.BASE_URL

export function useImages() {
  const [data, setData] = useState<ManifestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${BASE}manifest.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load manifest: ${r.status}`)
        return r.json()
      })
      .then((d: ManifestData) => {
        setData(d)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}

export function useFilteredImages(images: ManifestEntry[], search: string, tags: string[], sort: SortMode) {
  const filtered = images.filter((img) => {
    if (search) {
      const q = search.toLowerCase()
      const matchesSearch =
        img.title.toLowerCase().includes(q) ||
        img.filename.toLowerCase().includes(q) ||
        img.tags.some((t) => t.toLowerCase().includes(q))
      if (!matchesSearch) return false
    }
    if (tags.length > 0) {
      if (!tags.some((t) => img.tags.includes(t))) return false
    }
    return true
  })

  const sorted = [...filtered]

  switch (sort) {
    case 'newest':
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      break
    case 'oldest':
      sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      break
    case 'name':
      sorted.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'random':
      sorted.sort(() => Math.random() - 0.5)
      break
  }

  return sorted
}

export function useAllTags(images: ManifestEntry[]): string[] {
  const tagSet = new Set<string>()
  images.forEach((img) => img.tags.forEach((t) => tagSet.add(t)))
  return Array.from(tagSet).sort()
}
