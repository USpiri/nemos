import { ROOT_SNIPPETS_DIR, SNIPPETS_DIR } from '@/config/constants'
import { exists, existsAppData, read, readAppData } from '@/lib/fs'

export const readSnippetCss = async (
  scope: 'global' | 'root',
  filename: string,
  rootFsPath: string | null,
): Promise<string | null> => {
  if (scope === 'global') {
    const path = `${SNIPPETS_DIR}/${filename}`
    try {
      if (await existsAppData(path)) return await readAppData(path)
    } catch {
      // ignore
    }
    return null
  }

  if (!rootFsPath) return null
  const path = `${rootFsPath}/${ROOT_SNIPPETS_DIR}/${filename}`
  try {
    if (await exists(path)) return await read(path)
  } catch {
    // ignore
  }
  return null
}
