import { ROOT_THEMES_DIR, THEMES_DIR } from '@/config/constants'
import { exists, existsAppData, read, readAppData } from '@/lib/fs'

export const readThemeCss = async (
  themeId: string,
  rootFsPath: string | null,
): Promise<string | null> => {
  if (rootFsPath) {
    const rootPath = `${rootFsPath}/${ROOT_THEMES_DIR}/${themeId}/theme.css`
    try {
      if (await exists(rootPath)) return await read(rootPath)
    } catch {
      // Ignore errors and fallback to global themes
    }
  }
  const globalPath = `${THEMES_DIR}/${themeId}/theme.css`
  try {
    if (await existsAppData(globalPath)) return await readAppData(globalPath)
  } catch {
    // Ignore errors and return null
  }
  return null
}
