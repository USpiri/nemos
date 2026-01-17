import { AppError } from './errors'
import { ensureRoot } from './service/ensure-root'

export const initialize = async () => {
  try {
    await ensureRoot()
  } catch (error) {
    throw new AppError(
      'INIT_FAILED',
      `Failed to initialize application\n` +
        `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
