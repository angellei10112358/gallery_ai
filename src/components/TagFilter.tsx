interface Props {
  allTags: string[]
  selected: string[]
  onToggle: (tag: string) => void
}

export default function TagFilter({ allTags, selected, onToggle }: Props) {
  if (allTags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {allTags.map((tag) => {
        const active = selected.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              active
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
