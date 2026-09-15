import { readNote } from '@/lib/notes'

const HEADING_LINE_REGEX = /^(#{1,6})\s+(.+?)\s*#*$/
const FENCE_REGEX = /^\s*(```|~~~)/

async function readHeadings(fsPath: string): Promise<string[]> {
  try {
    const { content } = await readNote(fsPath)
    const headings: string[] = []
    let inFence = false

    for (const line of content.split('\n')) {
      if (FENCE_REGEX.test(line)) {
        inFence = !inFence
        continue
      }
      if (inFence) continue

      const match = line.match(HEADING_LINE_REGEX)
      if (match) headings.push(match[2].trim())
    }

    return headings
  } catch {
    return []
  }
}

// Every Note+Anchor link into the same target Note (there can be several in
// one document, each its own LinkView instance) would otherwise re-read that
// file independently. This coalesces concurrent calls for the same path
// into a single read — the entry is dropped the moment it settles, so this
// is request de-duplication, not a long-lived cache: a later call re-reads
// fresh rather than risking a stale answer once the target Note is edited.
const inFlight = new Map<string, Promise<string[]>>()

/**
 * Best-effort heading extraction from another Note's raw markdown, for
 * styling a Note+Anchor link that points at a Note other than the one
 * currently open (whose headings we can otherwise only get by walking its
 * live ProseMirror document, see get-document-headings.ts). Not
 * unit-tested — cosmetic-only wiring, same as the click-to-create
 * composition (see docs/adr/0011).
 */
export async function getNoteHeadings(fsPath: string): Promise<string[]> {
  const existing = inFlight.get(fsPath)
  if (existing) return existing

  const promise = readHeadings(fsPath).finally(() => {
    inFlight.delete(fsPath)
  })
  inFlight.set(fsPath, promise)
  return promise
}
