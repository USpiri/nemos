import { useCallback } from "react";
import { toast } from "sonner";
import {
  initialProgress,
  checkForUpdate,
  downloadAndInstall as downloadAndInstallFn,
  close as closeFn,
  install as installFn,
  download as downloadFn,
  type UpdateInfo,
  type DownloadProgress,
  type Updater,
} from "@/lib/updater";
import { useDialogStore, useUpdateStore } from "@/store";

interface UseUpdateReturn {
  available: boolean;
  updateInfo: UpdateInfo | null;
  updater: Updater | undefined;
  progress: DownloadProgress;
  isChecking: boolean;
  isDownloading: boolean;
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  check: () => Promise<void>;
  downloadAndInstall: () => Promise<void>;
  download: () => Promise<void>;
  install: () => Promise<void>;
  dismiss: () => Promise<void>;
  reset: () => void;
}

export const useUpdate = (): UseUpdateReturn => {
  const updateInfo = useUpdateStore((state) => state.updateInfo);
  const progress = useUpdateStore((state) => state.progress);
  const isChecking = useUpdateStore((state) => state.isChecking);
  const isDownloading = useUpdateStore((state) => state.isDownloading);
  const setUpdateInfo = useUpdateStore((state) => state.setUpdateInfo);
  const setProgress = useUpdateStore((state) => state.setProgress);
  const setIsChecking = useUpdateStore((state) => state.setIsChecking);
  const setIsDownloading = useUpdateStore((state) => state.setIsDownloading);
  const reset = useUpdateStore((state) => state.reset);

  const {
    open: openDialog,
    isOpen: isDialogOpen,
    close: closeDialog,
  } = useDialogStore();

  const check = useCallback(async () => {
    if (isChecking || updateInfo) return;

    setIsChecking(true);
    try {
      const update = await checkForUpdate();
      if (update) {
        setUpdateInfo(update);
        toast.success(`Update available: v${update.version}`, {
          action: {
            label: "Download & Install",
            onClick: () => downloadAndInstallFn(update.updater),
          },
          cancel: {
            label: "View Changes",
            onClick: () => {
              if (!isDialogOpen("update")) openDialog("update");
            },
          },
          className: "flex gap-4 flex-wrap",
          classNames: {
            icon: " mb-2",
            content: "w-10/12 mb-2",
            actionButton: "flex-1",
            cancelButton: "flex-1",
          },
        });
      }
    } catch (error) {
      // Don't show toast error, just log it
      console.error("Failed to check for updates", error);
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, updateInfo, setUpdateInfo, setIsChecking]);

  const downloadAndInstall = useCallback(async () => {
    if (!updateInfo?.updater || isDownloading) return;

    setIsDownloading(true);
    try {
      await downloadAndInstallFn(updateInfo.updater, setProgress);

      toast.success("Update downloaded successfully", {
        description:
          "The application will restart to complete the installation",
      });
    } catch (error) {
      setProgress({ ...initialProgress, status: "error" });
      toast.error("Failed to download and install update", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsDownloading(false);
    }
  }, [updateInfo, isDownloading, setProgress, setIsDownloading]);

  const download = useCallback(async () => {
    if (!updateInfo?.updater) return;

    setIsDownloading(true);
    try {
      await downloadFn(updateInfo.updater, (progress) => {
        console.log("download progress", progress);
        setProgress(progress);
      });
      toast.success("Update downloaded successfully", {
        description:
          "The application will restart to complete the installation",
      });
    } catch (error) {
      setProgress({ ...initialProgress, status: "error" });
      toast.error("Failed to download update", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsDownloading(false);
    }
  }, [updateInfo]);

  const install = useCallback(async () => {
    if (!updateInfo?.updater) return;
    try {
      await installFn(updateInfo.updater);
      toast.success("Update installed successfully", {
        description:
          "The application will restart to complete the installation",
      });
    } catch (error) {
      setProgress({ ...initialProgress, status: "error" });
      toast.error("Failed to install update", {
        description: error instanceof Error ? error.message : undefined,
      });
      console.error("Failed to install update", error);
    }
  }, [updateInfo]);

  const dismiss = useCallback(async () => {
    if (!updateInfo?.updater) return;
    try {
      await closeFn(updateInfo.updater);
      reset();
    } catch (error) {
      console.error("Failed to dismiss update", error);
    }
  }, [updateInfo]);

  return {
    available: !!updateInfo,
    updateInfo,
    updater: updateInfo?.updater,
    progress,
    isChecking,
    isDownloading,
    isDialogOpen: isDialogOpen("update"),
    openDialog: () => openDialog("update"),
    closeDialog: () => closeDialog(),
    check,
    downloadAndInstall,
    download,
    install,
    dismiss,
    reset,
  };
};
