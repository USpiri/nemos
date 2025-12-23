import { DirEntry } from "@tauri-apps/plugin-fs";

export type Workspace = DirEntry & {
  path: string;
};
