import { ROOT_THEMES_DIR, THEMES_DIR } from '@/config/constants'
import { exists, existsAppData, readDir, readDirAppData } from '@/lib/fs'
import type { ThemeDescriptor } from '../theme.types'
import { mergeThemes, toDisplayName } from '../utils'

const loadGlobalThemes = async (): Promise<ThemeDescriptor[]> => {
  let entries: Awaited<ReturnType<typeof readDirAppData>>
  try {
    entries = await readDirAppData(THEMES_DIR)
  } catch {
    return []
  }
  const descriptors = await Promise.all(
    entries
      .filter((e) => e.isDirectory && e.name != null)
      .map(async (e) => {
        const hasCss = await existsAppData(`${THEMES_DIR}/${e.name}/theme.css`)
        if (!hasCss) return null
        return {
          id: e.name,
          displayName: toDisplayName(e.name),
        } satisfies ThemeDescriptor
      }),
  )
  return descriptors.filter((d): d is ThemeDescriptor => d !== null)
}

const loadRootThemes = async (
  rootFsPath: string,
): Promise<ThemeDescriptor[]> => {
  const themesPath = `${rootFsPath}/${ROOT_THEMES_DIR}`
  let entries: Awaited<ReturnType<typeof readDir>>
  try {
    entries = await readDir(themesPath)
  } catch {
    return []
  }
  const descriptors = await Promise.all(
    entries
      .filter((e) => e.isDirectory && e.name != null)
      .map(async (e) => {
        const hasCss = await exists(`${themesPath}/${e.name}/theme.css`)
        if (!hasCss) return null
        return {
          id: e.name,
          displayName: toDisplayName(e.name),
        } satisfies ThemeDescriptor
      }),
  )
  return descriptors.filter((d): d is ThemeDescriptor => d !== null)
}

export const loadThemes = async (
  rootFsPath: string,
): Promise<ThemeDescriptor[]> => {
  const [globalThemes, rootThemes] = await Promise.all([
    loadGlobalThemes(),
    loadRootThemes(rootFsPath),
  ])
  return mergeThemes(globalThemes, rootThemes)
}
