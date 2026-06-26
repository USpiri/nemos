import { loadCssSnippets } from './service/load-css-snippets'
import { readSnippetCss } from './service/read-snippet-css'
import { readThemeCss } from './service/read-theme-css'
import {
  applyThemeCSS,
  GLOBAL_ATTR,
  injectSnippetStyle,
  removeStaleSnippets,
  WORKSPACE_ATTR,
} from './style-injectors'
import type { SnippetDescriptor } from './theme.types'
import { filterEnabled } from './utils'

interface ReloadStylesParams {
  activeTheme: string | null
  workspacePath: string | null
  disabledGlobalSnippets: string[]
  disabledWorkspaceSnippets: string[]
}

interface ReloadStylesResult {
  globalSnippets: SnippetDescriptor[]
  workspaceSnippets: SnippetDescriptor[]
}

export async function reloadStyles({
  activeTheme,
  workspacePath,
  disabledGlobalSnippets,
  disabledWorkspaceSnippets,
}: ReloadStylesParams): Promise<ReloadStylesResult> {
  if (activeTheme) {
    const css = await readThemeCss(activeTheme, workspacePath)
    applyThemeCSS(css)
  } else {
    applyThemeCSS(null)
  }

  if (!workspacePath) {
    return { globalSnippets: [], workspaceSnippets: [] }
  }

  let globalSnippets: SnippetDescriptor[] = []
  let workspaceSnippets: SnippetDescriptor[] = []

  try {
    ;({ globalSnippets, workspaceSnippets } =
      await loadCssSnippets(workspacePath))
  } catch {
    return { globalSnippets: [], workspaceSnippets: [] }
  }

  const enabledGlobal = filterEnabled(globalSnippets, disabledGlobalSnippets)
  const enabledWorkspace = filterEnabled(
    workspaceSnippets,
    disabledWorkspaceSnippets,
  )

  for (const snippet of enabledGlobal) {
    const css = await readSnippetCss(
      'global',
      `${snippet.id}.css`,
      workspacePath,
    )
    if (css) injectSnippetStyle(GLOBAL_ATTR, snippet.id, css)
  }

  for (const snippet of enabledWorkspace) {
    const css = await readSnippetCss(
      'workspace',
      `${snippet.id}.css`,
      workspacePath,
    )
    if (css) injectSnippetStyle(WORKSPACE_ATTR, snippet.id, css)
  }

  removeStaleSnippets(GLOBAL_ATTR, new Set(enabledGlobal.map((s) => s.id)))
  removeStaleSnippets(
    WORKSPACE_ATTR,
    new Set(enabledWorkspace.map((s) => s.id)),
  )

  return { globalSnippets, workspaceSnippets }
}
