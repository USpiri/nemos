import { useEffect } from 'react'
import { useAppearanceSettings } from '@/lib/settings'
import { readThemeCss } from '@/lib/themes'

const THEME_STYLE_ATTR = 'data-nemos-theme'

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

function applyThemeCSS(css: string | null) {
  const existing = document.querySelector(`[${THEME_STYLE_ATTR}]`)
  if (!css) {
    existing?.remove()
    return
  }
  if (existing) {
    existing.textContent = css
  } else {
    const style = document.createElement('style')
    style.setAttribute(THEME_STYLE_ATTR, '')
    style.textContent = css
    document.head.appendChild(style)
  }
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useAppearanceSettings((s) => s.theme)
  const autoSyncTheme = useAppearanceSettings((s) => s.autoSyncTheme)
  const setTheme = useAppearanceSettings((s) => s.update)
  const activeTheme = useAppearanceSettings((s) => s.activeTheme)
  const workspacePath = useAppearanceSettings((s) => s.workspacePath)

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

  useEffect(() => {
    if (!activeTheme) {
      applyThemeCSS(null)
      return
    }
    let cancelled = false
    readThemeCss(activeTheme, workspacePath).then((css) => {
      if (!cancelled) applyThemeCSS(css)
    })
    return () => {
      cancelled = true
    }
  }, [activeTheme, workspacePath])

  return <>{children}</>
}
