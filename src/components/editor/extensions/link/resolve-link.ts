import { EXTENSION } from '@/config/constants'
import { getParentPath } from '@/lib/paths'
import { slugifyHeadings } from './slug'

export interface LinkResolutionExternal {
  kind: 'external'
}

export interface LinkResolutionNote {
  kind: 'note'
  path: string
  resolved: boolean
}

export interface LinkResolutionAnchor {
  kind: 'anchor'
  slug: string
  resolved: boolean
}

export interface LinkResolutionNoteAnchor {
  kind: 'noteAnchor'
  path: string
  noteResolved: boolean
  slug: string
  // `headings` only ever describes one document — the one currently open
  // (`currentNotePath`). When `path` resolves to that same document, the
  // anchor can genuinely be checked against `headings` and this is a real
  // boolean. When `path` is a *different* Note, `headings` says nothing
  // about it — 'unknown' says so explicitly, rather than silently checking
  // the anchor against the wrong document's headings. Callers that want a
  // real answer for that case have to inspect the target Note themselves
  // (see link/get-note-headings.ts, used by LinkView for styling).
  anchorResolved: boolean | 'unknown'
}

export interface LinkResolutionUnresolved {
  kind: 'unresolved'
}

export type LinkResolution =
  | LinkResolutionExternal
  | LinkResolutionNote
  | LinkResolutionAnchor
  | LinkResolutionNoteAnchor
  | LinkResolutionUnresolved

// A target with an explicit URI scheme (`https:`, `mailto:`, ...) or a
// protocol-relative `//host` form is an External Link — passed through
// unclassified, exactly as links behaved before ADR-0011.
const EXTERNAL_TARGET_REGEX = /^[a-z][a-z0-9+.-]*:/i

function isExternalTarget(target: string): boolean {
  return EXTERNAL_TARGET_REGEX.test(target) || target.startsWith('//')
}

const NOTE_SUFFIX = `.${EXTENSION}`

/**
 * Joins and normalizes `target` (a relative path, possibly with `.`/`..`
 * segments) onto `fromPath`'s own directory — per ADR-0011, a Note Link is
 * resolved relative to the *linking* Note's own folder, not the Root.
 * Returns null if the target would escape above the Root, since nothing can
 * exist there.
 */
function resolveRelativePath(fromPath: string, target: string): string | null {
  const segments = getParentPath(fromPath).split('/').filter(Boolean)

  for (const part of target.split('/')) {
    if (part === '' || part === '.') continue
    if (part === '..') {
      if (segments.length === 0) return null
      segments.pop()
      continue
    }
    segments.push(part)
  }

  return segments.join('/')
}

/**
 * Pure link-target resolution (ADR-0011). No ProseMirror/DOM dependency —
 * `headings` is the *current* document's heading text (in document order),
 * the only document this function ever sees.
 */
export function resolveLink(
  target: string,
  currentNotePath: string,
  headings: string[],
  noteExists: (relativePath: string) => boolean,
): LinkResolution {
  const trimmed = target.trim()
  if (!trimmed) return { kind: 'unresolved' }

  if (isExternalTarget(trimmed)) return { kind: 'external' }

  if (trimmed.startsWith('#')) {
    const slug = trimmed.slice(1).toLowerCase()
    const resolved = slugifyHeadings(headings).includes(slug)
    return { kind: 'anchor', slug, resolved }
  }

  const hashIndex = trimmed.indexOf('#')
  const notePart = hashIndex === -1 ? trimmed : trimmed.slice(0, hashIndex)
  const anchorPart = hashIndex === -1 ? null : trimmed.slice(hashIndex + 1)

  // The `.md` extension is required explicitly (ADR-0011) — no
  // extension-inference fallback, so a link to an image or other
  // non-Markdown file sharing the folder isn't mistaken for a Note Link.
  if (!notePart.endsWith(NOTE_SUFFIX)) return { kind: 'unresolved' }

  const resolvedPath = resolveRelativePath(currentNotePath, notePart)
  if (resolvedPath === null) return { kind: 'unresolved' }

  const noteResolved = noteExists(resolvedPath)

  if (!anchorPart)
    return { kind: 'note', path: resolvedPath, resolved: noteResolved }

  const slug = anchorPart.toLowerCase()
  const anchorResolved =
    resolvedPath === currentNotePath
      ? slugifyHeadings(headings).includes(slug)
      : 'unknown'

  return {
    kind: 'noteAnchor',
    path: resolvedPath,
    noteResolved,
    slug,
    anchorResolved,
  }
}

export function isLinkBroken(resolution: LinkResolution): boolean {
  switch (resolution.kind) {
    case 'external':
      return false
    case 'note':
      return !resolution.resolved
    case 'anchor':
      return !resolution.resolved
    case 'noteAnchor':
      return !resolution.noteResolved || resolution.anchorResolved === false
    case 'unresolved':
      return true
  }
}
