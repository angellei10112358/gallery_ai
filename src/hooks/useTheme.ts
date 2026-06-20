import { useState, useEffect, useCallback } from 'react'

export function useTheme(defaultDark: boolean) {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('gallery-theme')
    if (stored) return stored === 'dark'
    return defaultDark
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('gallery-theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggle = useCallback(() => setDark((v) => !v), [])

  return { dark, toggle }
}
