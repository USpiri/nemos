import { DirEntry } from "@tauri-apps/plugin-fs";

export type WorkspaceEntry = DirEntry & {
  path: string;
};

export type DetailedWorkspaceEntry = WorkspaceEntry & {
  modified?: Date | null;
};
