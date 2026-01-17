import { UpdaterError } from '../errors'
import { DownloadProgressCallback, Updater } from '../updater.type'

export const download = async (
  updater: Updater,
  onProgress?: DownloadProgressCallback,
) => {
  let contentLength: number | undefined
  let downloaded = 0

  try {
    await updater.download((event) => {
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
      'DOWNLOAD_FAILED',
      `Failed to download update\n` +
        `Cause: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
