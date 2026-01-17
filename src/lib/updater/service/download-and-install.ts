import { UpdaterError } from '../errors'
import type { DownloadProgressCallback, Updater } from '../updater.type'

/**
 * Downloads and installs an update
 * @param updater - The updater instance
 * @param onProgress - Optional callback for download progress updates
 * @throws UpdaterError with code DOWNLOAD_AND_INSTALL_FAILED
 */
export const downloadAndInstall = async (
  updater: Updater,
  onProgress?: DownloadProgressCallback,
): Promise<void> => {
  let contentLength: number | undefined
  let downloaded = 0

  try {
    await updater.downloadAndInstall((event) => {
      switch (event.event) {
        case 'Started':
          contentLength = event.data.contentLength
          onProgress?.({
            status: 'started',
            downloaded: 0,
            contentLength,
            percentage: 0,
          })
          break

        case 'Progress': {
          downloaded += event.data.chunkLength
          const percentage = contentLength
            ? Math.floor((downloaded / contentLength) * 100)
            : 0
          onProgress?.({
            status: 'progress',
            downloaded,
            contentLength,
            percentage,
          })
          break
        }

        case 'Finished':
          onProgress?.({
            status: 'finished',
            downloaded: contentLength || downloaded,
            contentLength,
            percentage: 100,
          })
          break
      }
    })
  } catch (error) {
    throw new UpdaterError(
      'DOWNLOAD_AND_INSTALL_FAILED',
      `Failed to download and install update\n` +
        `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
