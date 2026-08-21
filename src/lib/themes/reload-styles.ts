import { loadCssSnippets } from './service/load-css-snippets'
import { readSnippetCss } from './service/read-snippet-css'
import { readThemeCss } from './service/read-theme-css'
import {
  applyThemeCSS,
  GLOBAL_ATTR,
  injectSnippetStyle,
  ROOT_ATTR,
  removeStaleSnippets,
} from './style-injectors'
import type { SnippetDescriptor } from './theme.types'
import { filterEnabled } from './utils'

interface ReloadStylesParams {
  activeTheme: string | null
  rootPath: string | null
  disabledGlobalSnippets: string[]
  disabledRootSnippets: string[]
}

interface ReloadStylesResult {
  globalSnippets: SnippetDescriptor[]
  rootSnippets: SnippetDescriptor[]
}

export async function reloadStyles({
  activeTheme,
  rootPath,
  disabledGlobalSnippets,
  disabledRootSnippets,
}: ReloadStylesParams): Promise<ReloadStylesResult> {
  if (activeTheme) {
    const css = await readThemeCss(activeTheme, rootPath)
    applyThemeCSS(css)
  } else {
    applyThemeCSS(null)
  }

  if (!rootPath) {
    return { globalSnippets: [], rootSnippets: [] }
  }

  let globalSnippets: SnippetDescriptor[] = []
  let rootSnippets: SnippetDescriptor[] = []

  try {
    ;({ globalSnippets, rootSnippets } = await loadCssSnippets(rootPath))
  } catch {
    return { globalSnippets: [], rootSnippets: [] }
  }

  const enabledGlobal = filterEnabled(globalSnippets, disabledGlobalSnippets)
  const enabledRoot = filterEnabled(rootSnippets, disabledRootSnippets)

  for (const snippet of enabledGlobal) {
    const css = await readSnippetCss('global', `${snippet.id}.css`, rootPath)
    if (css) injectSnippetStyle(GLOBAL_ATTR, snippet.id, css)
  }

  for (const snippet of enabledRoot) {
    const css = await readSnippetCss('root', `${snippet.id}.css`, rootPath)
    if (css) injectSnippetStyle(ROOT_ATTR, snippet.id, css)
  }

  removeStaleSnippets(GLOBAL_ATTR, new Set(enabledGlobal.map((s) => s.id)))
  removeStaleSnippets(ROOT_ATTR, new Set(enabledRoot.map((s) => s.id)))

  return { globalSnippets, rootSnippets }
}
