import { openUrl as openUrlFn } from '@tauri-apps/plugin-opener'

export const openUrl = async (url: string): Promise<void> => {
  await openUrlFn(url)
}
