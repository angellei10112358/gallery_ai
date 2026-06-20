import ThemeToggle from './ThemeToggle'
import SearchBar from './SearchBar'
import type { GalleryConfig } from '../types/gallery'

interface Props {
  config: GalleryConfig
  dark: boolean
  onToggleTheme: () => void
  search: string
  onSearchChange: (v: string) => void
}

export default function Header({ config, dark, onToggleTheme, search, onSearchChange }: Props) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">{config.siteTitle}</h1>
            {config.bio && <p className="text-sm text-gray-500 dark:text-gray-400">{config.bio}</p>}
          </div>
          <div className="flex items-center gap-3">
            <SearchBar value={search} onChange={onSearchChange} />
            <ThemeToggle dark={dark} onToggle={onToggleTheme} />
          </div>
        </div>
      </div>
    </header>
  )
}
