export type WorkspaceErrorCode = 'GET_WORKSPACES_FAILED' | 'ALREADY_PINNED'

export class WorkspaceError extends Error {
  readonly code: WorkspaceErrorCode

  constructor(code: WorkspaceErrorCode, message?: string) {
    super(message)
    this.code = code
  }
}

export type RootErrorCode = 'GET_ROOT_TREE_FAILED'

export class RootError extends Error {
  readonly code: RootErrorCode

  constructor(code: RootErrorCode, message?: string) {
    super(message)
    this.code = code
  }
}
