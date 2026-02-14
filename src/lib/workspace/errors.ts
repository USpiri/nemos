export type WorkspaceErrorCode =
  | 'ALREADY_EXISTS'
  | 'INVALID_NAME'
  | 'CREATE_FAILED'
  | 'GET_WORKSPACES_FAILED'
  | 'GET_WORKSPACE_TREE_FAILED'

export class WorkspaceError extends Error {
  readonly code: WorkspaceErrorCode

  constructor(code: WorkspaceErrorCode, message?: string) {
    super(message)
    this.code = code
  }
}
