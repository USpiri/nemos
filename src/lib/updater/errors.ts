export type UpdaterErrorCode =
  | 'CHECK_FAILED'
  | 'DOWNLOAD_FAILED'
  | 'INSTALL_FAILED'
  | 'RELAUNCH_FAILED'
  | 'DOWNLOAD_AND_INSTALL_FAILED'
  | 'CLOSE_FAILED'

export class UpdaterError extends Error {
  readonly code: UpdaterErrorCode

  constructor(code: UpdaterErrorCode, message?: string) {
    super(message)
    this.code = code
  }
}
