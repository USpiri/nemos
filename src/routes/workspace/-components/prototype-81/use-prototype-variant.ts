// PROTOTYPE for issue #81 — throwaway URL-param variant switcher.
import { useCallback, useEffect, useState } from 'react'

export function usePrototypeVariant(variants: string[], defaultVariant: string) {
  const [variant, setVariantState] = useState(() => {
    if (typeof window === 'undefined') return defaultVariant
    const fromUrl = new URLSearchParams(window.location.search).get('variant')
    return fromUrl && variants.includes(fromUrl) ? fromUrl : defaultVariant
  })

  const setVariant = useCallback((next: string) => {
    setVariantState(next)
    const url = new URL(window.location.href)
    url.searchParams.set('variant', next)
    window.history.replaceState({}, '', url)
  }, [])

  const cycle = useCallback(
    (direction: 1 | -1) => {
      setVariantState((current) => {
        const idx = variants.indexOf(current)
        const next =
          variants[(idx + direction + variants.length) % variants.length]
        const url = new URL(window.location.href)
        url.searchParams.set('variant', next)
        window.history.replaceState({}, '', url)
        return next
      })
    },
    [variants],
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        ['INPUT', 'TEXTAREA'].includes(target.tagName) ||
        target.isContentEditable
      ) {
        return
      }
      if (e.key === 'ArrowLeft') cycle(-1)
      if (e.key === 'ArrowRight') cycle(1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [cycle])

  return { variant, setVariant, cycle }
}
