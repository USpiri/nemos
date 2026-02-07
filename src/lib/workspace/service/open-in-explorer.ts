import { join } from '@tauri-apps/api/path'
import { ROOT } from '@/config/constants'
import { getNoteFolderPath } from '@/lib/notes'
import { openPath } from '@/lib/opener'

export const openInExplorer = async ({
  workspace,
  note,
}: {
  workspace: string
  note?: string
}): Promise<void> => {
  const parts = [ROOT, workspace, getNoteFolderPath(note ?? '')]
  const fullPath = await join(...parts)
  await openPath(fullPath)
}
