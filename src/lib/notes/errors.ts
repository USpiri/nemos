export type NoteErrorCode =
  | "NOT_FOUND"
  | "INVALID_CONTENT"
  | "READ_FAILED"
  | "CREATE_FAILED";

export class NoteError extends Error {
  readonly code: NoteErrorCode;

  constructor(code: NoteErrorCode, message?: string) {
    super(message);
    this.code = code;
  }
}
