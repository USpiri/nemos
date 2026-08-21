import { useEffect } from 'react'
import { useAppearanceSettings } from '@/lib/settings'
import { filterEnabled, loadCssSnippets, readSnippetCss } from '@/lib/themes'
import {
  GLOBAL_ATTR,
  injectSnippetStyle,
  ROOT_ATTR,
  removeStaleSnippets,
} from '@/lib/themes/style-injectors'

export const SnippetsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const rootPath = useAppearanceSettings((s) => s.rootPath)
  const disabledGlobal = useAppearanceSettings((s) => s.disabledGlobalSnippets)
  const disabledRoot = useAppearanceSettings((s) => s.disabledRootSnippets)

  // Mirrors the pipeline in reload-styles.ts but needs a cancellation flag to
  // drop stale async reads when deps change before the effect completes.
  useEffect(() => {
    if (!rootPath) return
    let cancelled = false

    loadCssSnippets(rootPath).then(async ({ globalSnippets, rootSnippets }) => {
      if (cancelled) return

      const enabledGlobal = filterEnabled(globalSnippets, disabledGlobal)
      const enabledRoot = filterEnabled(rootSnippets, disabledRoot)

      const nextGlobalIds = new Set(enabledGlobal.map((s) => s.id))
      const nextRootIds = new Set(enabledRoot.map((s) => s.id))

      for (const snippet of enabledGlobal) {
        if (cancelled) return
        const css = await readSnippetCss(
          'global',
          `${snippet.id}.css`,
          rootPath,
        )
        if (cancelled || !css) continue
        injectSnippetStyle(GLOBAL_ATTR, snippet.id, css)
      }

      for (const snippet of enabledRoot) {
        if (cancelled) return
        const css = await readSnippetCss('root', `${snippet.id}.css`, rootPath)
        if (cancelled || !css) continue
        injectSnippetStyle(ROOT_ATTR, snippet.id, css)
      }

      if (cancelled) return

      removeStaleSnippets(GLOBAL_ATTR, nextGlobalIds)
      removeStaleSnippets(ROOT_ATTR, nextRootIds)
    })

    return () => {
      cancelled = true
    }
  }, [rootPath, disabledGlobal, disabledRoot])

  return <>{children}</>
}
