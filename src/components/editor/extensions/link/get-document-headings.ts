import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import type { LinkNavigationOptions } from './link-options'
import { resolveLink } from './resolve-link'

export interface DocumentHeading {
  text: string
  pos: number
  nodeSize: number
}

/**
 * Walks the current ProseMirror document collecting heading text in
 * document order, for feeding into `resolveLink`'s anchor matching.
 */
export function getDocumentHeadings(doc: ProseMirrorNode): DocumentHeading[] {
  const headings: DocumentHeading[] = []

  doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      headings.push({ text: node.textContent, pos, nodeSize: node.nodeSize })
    }
  })

  return headings
}

/**
 * `resolveLink` stays free of any ProseMirror dependency (ADR-0011); this is
 * the one place both the click handler (link/index.ts) and the styling view
 * (LinkView.tsx) get from a live document to a resolution, so the "get this
 * document's headings, then resolve" shape only lives once.
 */
export function resolveLinkFromDoc(
  doc: ProseMirrorNode,
  target: string,
  options: Pick<LinkNavigationOptions, 'currentNotePath' | 'noteExists'>,
) {
  const headings = getDocumentHeadings(doc).map((h) => h.text)
  return resolveLink(
    target,
    options.currentNotePath,
    headings,
    options.noteExists,
  )
}
