import { createAppDataDir, createDir } from './create'
import { exists, existsAppData } from './exists'

export const ensureDir = async (
  path: string,
  options?: { recursive?: boolean },
) => {
  if (await exists(path)) return
  return await createDir(path, options)
}

export const ensureDirAppData = async (
  path: string,
  options?: { recursive?: boolean },
) => {
  if (await existsAppData(path)) return
  return await createAppDataDir(path, options)
}
