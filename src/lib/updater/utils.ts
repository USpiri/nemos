import { DownloadProgress } from './updater.type'

export const initialProgress: DownloadProgress = {
  status: null,
  downloaded: 0,
  contentLength: undefined,
  percentage: 0,
}
