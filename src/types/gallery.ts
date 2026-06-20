export interface ManifestEntry {
  id: string
  filename: string
  title: string
  description: string
  tags: string[]
  prompt: string
  model: string
  date: string
  width: number
  height: number
  aspectRatio: number
  fileSize: number
  modifiedTime: string
  formats: {
    webp: string[]
    avif: string[]
    original: string[]
  }
  lqip: string
}

export interface GalleryConfig {
  siteTitle: string
  author: string
  bio: string
  githubUrl: string
  defaultTheme: string
  layout: string
  watermark: { enabled: boolean; text: string }
  disableRightClick: boolean
  sortDefault: string
}

export interface ManifestData {
  images: ManifestEntry[]
  config: GalleryConfig
  generatedAt: string
}

export type SortMode = 'newest' | 'oldest' | 'random' | 'name'
