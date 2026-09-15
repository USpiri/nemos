import { MarkViewContent, type MarkViewProps } from '@tiptap/react'
import { useEffect, useMemo, useState } from 'react'
import { toFsPath } from '@/lib/paths'
import { cn } from '@/lib/utils'
import { resolveLinkFromDoc } from './get-document-headings'
import { getNoteHeadings } from './get-note-headings'
import { defaultLinkNavigationOptions } from './link-options'
import { isLinkBroken } from './resolve-link'
import { slugifyHeadings } from './slug'

export const LinkView = ({ mark, editor, extension }: MarkViewProps) => {
  const { href, target, rel, class: className, title } = mark.attrs
  const options = useMemo(
    () => ({ ...defaultLinkNavigationOptions, ...extension.options }),
    [extension.options],
  )

  const resolution = useMemo(
    () => resolveLinkFromDoc(editor.state.doc, href ?? '', options),
    [href, editor.state.doc, options],
  )

  // `resolveLink` can only say 'unknown' for a Note+Anchor's anchor half
  // when the target is a different Note (see resolve-link.ts) — isLinkBroken
  // treats that as "not broken" by default, so this only needs to check the
  // real thing when there's an unknown to resolve.
  const [broken, setBroken] = useState(() => isLinkBroken(resolution))

  useEffect(() => {
    setBroken(isLinkBroken(resolution))

    if (
      resolution.kind !== 'noteAnchor' ||
      resolution.anchorResolved !== 'unknown' ||
      !resolution.noteResolved
    ) {
      return
    }

    let cancelled = false
    const fsPath = toFsPath(options.rootPath, resolution.path)
    getNoteHeadings(fsPath).then((headings) => {
      if (cancelled) return
      setBroken(!slugifyHeadings(headings).includes(resolution.slug))
    })

    return () => {
      cancelled = true
    }
  }, [resolution, options.rootPath])

  return (
    <MarkViewContent
      as="a"
      href={href}
      target={target ?? undefined}
      rel={rel ?? undefined}
      title={title ?? undefined}
      className={cn(className, broken && 'link-broken')}
    />
  )
}
