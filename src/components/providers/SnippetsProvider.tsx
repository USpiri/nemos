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

        document.querySelectorAll(`[${GLOBAL_ATTR}]`).forEach((el) => {
          if (!nextGlobalIds.has(el.getAttribute(GLOBAL_ATTR)!)) el.remove()
        })
        document.querySelectorAll(`[${WORKSPACE_ATTR}]`).forEach((el) => {
          if (!nextWorkspaceIds.has(el.getAttribute(WORKSPACE_ATTR)!))
            el.remove()
        })
      },
    )

    return () => {
      cancelled = true
    }
  }, [workspacePath, disabledGlobal, disabledWorkspace])

  return <>{children}</>
}
