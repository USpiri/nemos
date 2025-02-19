import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { useEffect, useState } from "react";

export const useUpdate = () => {
  const [update, setUpdate] = useState<Update | null>(null);
  const [updateLength, setUpdateLength] = useState<number | undefined>(
    undefined,
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(0);

  useEffect(() => {
    check().then((data) => {
      if (data) {
        setUpdate(data);
      }
    });
  }, []);

  const onInstall = async () => {
    if (!update) return;
    setIsDownloading(true);

    await update
      .downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            setUpdateLength(event.data.contentLength);
            break;

          case "Progress":
            setDownloaded((prev) => prev + event.data.chunkLength);
            break;

          case "Finished":
            setIsDownloading(false);
            break;
        }
      })
      .then(async () => {
        setDownloaded(updateLength!);
        await relaunch();
      });
  };

  const close = () => setUpdate(null);

  return {
    available: !!update,
    update,
    ...update,
    updateLength,
    isDownloading,
    downloaded,
    percentage: updateLength
      ? Math.round((downloaded / updateLength) * 100)
      : 0,
    onInstall,
    close,
  };
};
