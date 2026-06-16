import { useEffect } from 'react'
import { useAppearanceSettings } from '@/lib/settings'
import { filterEnabled, loadCssSnippets, readSnippetCss } from '@/lib/themes'
import {
  GLOBAL_ATTR,
  injectSnippetStyle,
  removeStaleSnippets,
  WORKSPACE_ATTR,
} from '@/lib/themes/style-injectors'

export const SnippetsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const workspacePath = useAppearanceSettings((s) => s.workspacePath)
  const disabledGlobal = useAppearanceSettings((s) => s.disabledGlobalSnippets)
  const disabledWorkspace = useAppearanceSettings(
    (s) => s.disabledWorkspaceSnippets,
  )

  // Mirrors the pipeline in reload-styles.ts but needs a cancellation flag to
  // drop stale async reads when deps change before the effect completes.
  useEffect(() => {
    if (!workspacePath) return
    let cancelled = false

    loadCssSnippets(workspacePath).then(
      async ({ globalSnippets, workspaceSnippets }) => {
        if (cancelled) return

        const enabledGlobal = filterEnabled(globalSnippets, disabledGlobal)
        const enabledWorkspace = filterEnabled(
          workspaceSnippets,
          disabledWorkspace,
        )

        const nextGlobalIds = new Set(enabledGlobal.map((s) => s.id))
        const nextWorkspaceIds = new Set(enabledWorkspace.map((s) => s.id))

        for (const snippet of enabledGlobal) {
          if (cancelled) return
          const css = await readSnippetCss(
            'global',
            `${snippet.id}.css`,
            workspacePath,
          )
          if (cancelled || !css) continue
          injectSnippetStyle(GLOBAL_ATTR, snippet.id, css)
        }

        for (const snippet of enabledWorkspace) {
          if (cancelled) return
          const css = await readSnippetCss(
            'workspace',
            `${snippet.id}.css`,
            workspacePath,
          )
          if (cancelled || !css) continue
          injectSnippetStyle(WORKSPACE_ATTR, snippet.id, css)
        }

        if (cancelled) return

        removeStaleSnippets(GLOBAL_ATTR, nextGlobalIds)
        removeStaleSnippets(WORKSPACE_ATTR, nextWorkspaceIds)
      },
    )

    return () => {
      cancelled = true
    }
  }, [workspacePath, disabledGlobal, disabledWorkspace])

  return <>{children}</>
}
