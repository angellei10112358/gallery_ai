interface Props {
  githubUrl: string
  imageCount: number
}

export default function Footer({ githubUrl, imageCount }: Props) {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>© {new Date().getFullYear()} · {imageCount} images</span>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          GitHub
        </a>
      </div>
    </footer>
  )
}
