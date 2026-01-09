import type { Update } from "@tauri-apps/plugin-updater";

export type Updater = Update;

export interface UpdateInfo {
  updater: Updater;
  version: string;
  currentVersion: string;
  date?: string;
  body?: string;
}

export interface DownloadProgress {
  status: "started" | "progress" | "finished" | "error" | null;
  downloaded: number;
  contentLength?: number;
  percentage: number;
}

export type DownloadProgressCallback = (progress: DownloadProgress) => void;
