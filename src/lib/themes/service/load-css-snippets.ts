import { SNIPPETS_DIR, WORKSPACE_SNIPPETS_DIR } from '@/config/constants'
import { readDir, readDirAppData } from '@/lib/fs'
import type { SnippetDescriptor } from '../theme.types'
import { toDisplayName } from '../utils'

const loadGlobalSnippets = async (): Promise<SnippetDescriptor[]> => {
  let entries: Awaited<ReturnType<typeof readDirAppData>>
  try {
    entries = await readDirAppData(SNIPPETS_DIR)
  } catch {
    return []
  }
  return entries
    .filter((e) => e.isFile && e.name?.endsWith('.css'))
    .map((e) => {
      const id = e.name!.replace(/\.css$/, '')
      return { id, displayName: toDisplayName(id) } satisfies SnippetDescriptor
    })
}

const loadWorkspaceSnippets = async (
  workspaceFsPath: string,
): Promise<SnippetDescriptor[]> => {
  const snippetsPath = `${workspaceFsPath}/${WORKSPACE_SNIPPETS_DIR}`
  let entries: Awaited<ReturnType<typeof readDir>>
  try {
    entries = await readDir(snippetsPath)
  } catch {
    return []
  }
  return entries
    .filter((e) => e.isFile && e.name?.endsWith('.css'))
    .map((e) => {
      const id = e.name!.replace(/\.css$/, '')
      return { id, displayName: toDisplayName(id) } satisfies SnippetDescriptor
    })
}

export const loadCssSnippets = async (
  workspaceFsPath: string,
): Promise<{
  globalSnippets: SnippetDescriptor[]
  workspaceSnippets: SnippetDescriptor[]
}> => {
  const [globalSnippets, workspaceSnippets] = await Promise.all([
    loadGlobalSnippets(),
    loadWorkspaceSnippets(workspaceFsPath),
  ])
  return { globalSnippets, workspaceSnippets }
}
