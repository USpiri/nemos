export type WorkspaceErrorCode =
  | 'GET_WORKSPACES_FAILED'
  | 'GET_ROOT_TREE_FAILED'
  | 'ALREADY_PINNED'

export class WorkspaceError extends Error {
  readonly code: WorkspaceErrorCode

  constructor(code: WorkspaceErrorCode, message?: string) {
    super(message)
    this.code = code
  }
}
