export type AppErrorCode = 'RELAUNCH_FAILED' | 'INIT_FAILED'

export class AppError extends Error {
  readonly code: AppErrorCode

  constructor(code: AppErrorCode, message?: string) {
    super(message)
    this.code = code
  }
}
