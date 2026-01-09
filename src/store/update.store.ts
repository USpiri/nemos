import { create } from "zustand";
import {
  initialProgress,
  type UpdateInfo,
  type DownloadProgress,
} from "@/lib/updater";

interface UpdateStore {
  updateInfo: UpdateInfo | null;
  progress: DownloadProgress;
  isChecking: boolean;
  isDownloading: boolean;
  setUpdateInfo: (info: UpdateInfo | null) => void;
  setProgress: (progress: DownloadProgress) => void;
  setIsChecking: (isChecking: boolean) => void;
  setIsDownloading: (isDownloading: boolean) => void;
  reset: () => void;
}

/**
 * Store for managing update state across the application
 * Prevents redundant update checks and shares state between components
 */
export const useUpdateStore = create<UpdateStore>((set) => ({
  updateInfo: null,
  progress: initialProgress,
  isChecking: false,
  isDownloading: false,
  setUpdateInfo: (info) => set({ updateInfo: info }),
  setProgress: (progress) => set({ progress }),
  setIsChecking: (isChecking) => set({ isChecking }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  reset: () =>
    set({
      updateInfo: null,
      progress: initialProgress,
      isChecking: false,
      isDownloading: false,
    }),
}));
