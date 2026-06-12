import { THEMES_DIR, WORKSPACE_THEMES_DIR } from '@/config/constants'
import { exists, existsAppData, read, readAppData } from '@/lib/fs'

export const readThemeCss = async (
  themeId: string,
  workspaceFsPath: string | null,
): Promise<string | null> => {
  if (workspaceFsPath) {
    const wsPath = `${workspaceFsPath}/${WORKSPACE_THEMES_DIR}/${themeId}/theme.css`
    try {
      if (await exists(wsPath)) return await read(wsPath)
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
