import { useEffect } from 'react'
import { useAppearanceSettings } from '@/lib/settings'

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useAppearanceSettings((s) => s.theme)
  const autoSyncTheme = useAppearanceSettings((s) => s.autoSyncTheme)
  const setTheme = useAppearanceSettings((s) => s.update)

  useEffect(() => {
    if (theme !== 'system') {
      setTheme({ theme })
      applyTheme(theme)
      return
    }

    const resolved = getSystemTheme()
    applyTheme(resolved)

    if (!autoSyncTheme) return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const next = e.matches ? 'dark' : 'light'
      applyTheme(next)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme, autoSyncTheme, setTheme])
  return <>{children}</>
}
