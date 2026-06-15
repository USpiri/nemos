import { useEffect } from 'react'
import { useAppearanceSettings } from '@/lib/settings'
import { filterEnabled, loadCssSnippets, readSnippetCss } from '@/lib/themes'

const GLOBAL_ATTR = 'data-nemos-snippet-global'
const WORKSPACE_ATTR = 'data-nemos-snippet-workspace'

function injectSnippetStyle(attr: string, id: string, css: string) {
  const existing = document.querySelector(`[${attr}="${id}"]`)
  if (existing) {
    existing.textContent = css
    return
  }
  const style = document.createElement('style')
  style.setAttribute(attr, id)
  style.textContent = css
  document.head.appendChild(style)
}

function removeAllSnippetStyles(attr: string) {
  document.querySelectorAll(`[${attr}]`).forEach((el) => el.remove())
}

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

  useEffect(() => {
    if (!workspacePath) return
    let cancelled = false

    removeAllSnippetStyles(GLOBAL_ATTR)
    removeAllSnippetStyles(WORKSPACE_ATTR)

    loadCssSnippets(workspacePath).then(
      async ({ globalSnippets, workspaceSnippets }) => {
        if (cancelled) return

        const enabledGlobal = filterEnabled(globalSnippets, disabledGlobal)
        const enabledWorkspace = filterEnabled(
          workspaceSnippets,
          disabledWorkspace,
        )

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
      },
    )

    return () => {
      cancelled = true
    }
  }, [workspacePath, disabledGlobal, disabledWorkspace])

  return <>{children}</>
}
