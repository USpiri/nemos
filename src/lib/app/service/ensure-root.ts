import { ROOT } from '@/config/constants'
import { createDir, exists } from '../../fs'

export const ensureRoot = async () => {
  const check = await exists(ROOT)
  if (!check) return await createDir(ROOT)
}
