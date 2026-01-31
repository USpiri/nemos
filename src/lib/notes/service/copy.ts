import { copy, getUniquePath } from '@/lib/fs'
import { NoteError } from '../errors'
import { getNotePath } from './path'

interface Props {
  workspace: string
  path: string
}

export const copyNote = async ({ workspace, path }: Props) => {
  if (!path) {
    throw new NoteError('COPY_FAILED', 'Note path is required')
  }

  const notePath = getNotePath(`${workspace}/${path}`)

  try {
    const uniquePath = await getUniquePath(notePath)

    await copy(notePath, uniquePath)
    return uniquePath
  } catch {
    throw new NoteError('COPY_FAILED', `Failed to copy note: ${notePath}`)
  }
}
