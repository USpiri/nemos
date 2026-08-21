import { Editor } from '@tiptap/core'
import matter from 'gray-matter'
import { Extensions } from '@/components/editor/extensions'
import { exists, read, readDirRecursive, removeFile, write } from '@/lib/fs'
import { toFsPath } from '@/lib/paths'

interface LegacyNote {
  content: string
  readonly?: boolean
}

export interface MigrateResult {
  total: number
  succeeded: number
  failed: string[]
}

/** Scan a workspace for unmigrated .note files */
export const findLegacyNotes = async (workspaceId: string): Promise<string[]> => {
  let entries: { path: string; name: string; isFile: boolean }[] = []
  try {
    entries = await readDirRecursive(toFsPath(workspaceId))
  } catch {
    return []
  }
  const results = await Promise.all(
    entries.map(async (e) => {
      const existsMdFile = await exists(e.path.replace(/\.note$/, '.md'))
      return {
        path: e.path,
        keep: e.isFile && e.name.endsWith('.note') && !existsMdFile,
      }
    }),
  )

  return results.filter((r) => r.keep).map((r) => r.path)
}

/** Convert a single .note file to .md; optionally delete the source */
export const migrateSingleNote = async (
  notePath: string,
  deleteAfter = false,
): Promise<void> => {
  const raw = await read(notePath)
  let legacy: LegacyNote

  try {
    legacy = JSON.parse(raw) as LegacyNote
  } catch {
    throw new Error(`Cannot parse JSON in ${notePath}`)
  }

  const editor = new Editor({
    extensions: [...Extensions],
    content: legacy.content || '',
  })

  const markdown = editor.getMarkdown()
  editor.destroy()

  const frontmatter: Record<string, unknown> = {}
  if (legacy.readonly !== undefined) frontmatter.readonly = legacy.readonly

  const mdPath = notePath.replace(/\.note$/, '.md')
  const fileContent = matter.stringify(markdown, frontmatter)
  const existsFile = await exists(mdPath)
  if (!existsFile) {
    await write(mdPath, fileContent)
  }

  if (deleteAfter) {
    await removeFile(notePath)
  }
}

/** Migrate all .note files in a workspace; returns progress stats */
export const migrateAllNotes = async (
  workspaceId: string,
  options: {
    deleteAfter?: boolean
    onProgress?: (done: number, total: number) => void
  } = {},
): Promise<MigrateResult> => {
  const { deleteAfter = false, onProgress } = options
  const paths = await findLegacyNotes(workspaceId)
  const result: MigrateResult = {
    total: paths.length,
    succeeded: 0,
    failed: [],
  }

  for (let i = 0; i < paths.length; i++) {
    try {
      await migrateSingleNote(paths[i], deleteAfter)
      result.succeeded++
    } catch (err) {
      console.error(`Migration failed for ${paths[i]}:`, err)
      result.failed.push(paths[i])
    }
    onProgress?.(i + 1, paths.length)
  }

  return result
}
