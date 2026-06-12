import { createDir } from './create'
import { exists } from './exists'

export const ensureDir = async (
  path: string,
  options?: { recursive?: boolean },
) => {
  if (await exists(path)) return
  return await createDir(path, options)
}
