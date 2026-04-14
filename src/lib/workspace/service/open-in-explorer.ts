import { openPath } from '@/lib/opener'
import { getContainerPath, toFsPath } from '@/lib/paths'

/**
 * Can be:
 * - a note
 * - a folder
 * - a workspace
 *
 * If it's a note, we need to get the folder path and open it.
 * If it's a folder, we need to open it.
 * If it's a workspace, we need to open the workspace folder.
 *
 * We need to use the `getContainerPath` function to get the folder path.
 * We need to use the `toFsPath` function to get the fs path.
 */
export const openInExplorer = async ({
  workspace,
  note,
}: {
  workspace: string
  note?: string
}): Promise<void> => {
  const relativePath = note ? getContainerPath(note) : ''
  const fsPath = relativePath
    ? toFsPath(workspace, relativePath)
    : toFsPath(workspace)
  await openPath(fsPath)
}
