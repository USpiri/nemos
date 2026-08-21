import { ROOT_SNIPPETS_DIR, SNIPPETS_DIR } from '@/config/constants'
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

const loadRootSnippets = async (
  rootFsPath: string,
): Promise<SnippetDescriptor[]> => {
  const snippetsPath = `${rootFsPath}/${ROOT_SNIPPETS_DIR}`
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
  rootFsPath: string,
): Promise<{
  globalSnippets: SnippetDescriptor[]
  rootSnippets: SnippetDescriptor[]
}> => {
  const [globalSnippets, rootSnippets] = await Promise.all([
    loadGlobalSnippets(),
    loadRootSnippets(rootFsPath),
  ])
  return { globalSnippets, rootSnippets }
}
