import { describe, expect, it } from 'vitest'
import { isLinkBroken, resolveLink } from './resolve-link'

const noNotes = () => false

describe('resolveLink', () => {
  it('passes an external target through unclassified', () => {
    expect(resolveLink('https://nemos.app', 'note.md', [], noNotes)).toEqual({
      kind: 'external',
    })
  })

  it('treats a protocol-relative target as external', () => {
    expect(resolveLink('//example.com', 'note.md', [], noNotes)).toEqual({
      kind: 'external',
    })
  })

  it('resolves a same-document anchor matching a heading', () => {
    const result = resolveLink(
      '#introduction',
      'note.md',
      ['Introduction'],
      noNotes,
    )
    expect(result).toEqual({
      kind: 'anchor',
      slug: 'introduction',
      resolved: true,
    })
  })

  it('marks a same-document anchor with no matching heading as broken', () => {
    const result = resolveLink('#missing', 'note.md', ['Introduction'], noNotes)
    expect(result).toEqual({ kind: 'anchor', slug: 'missing', resolved: false })
  })

  it('matches anchors case- and punctuation-insensitively per the GFM slug algorithm', () => {
    const result = resolveLink(
      '#Hello-World',
      'note.md',
      ['Hello, World!'],
      noNotes,
    )
    expect(result).toEqual({
      kind: 'anchor',
      slug: 'hello-world',
      resolved: true,
    })
  })

  it('gives duplicate heading text distinct de-duplicated slugs', () => {
    const headings = ['Summary', 'Summary']
    expect(resolveLink('#summary', 'note.md', headings, noNotes)).toEqual({
      kind: 'anchor',
      slug: 'summary',
      resolved: true,
    })
    expect(resolveLink('#summary-1', 'note.md', headings, noNotes)).toEqual({
      kind: 'anchor',
      slug: 'summary-1',
      resolved: true,
    })
  })

  it('resolves a Note-relative path to an existing file', () => {
    const exists = (path: string) => path === 'folder/other.md'
    const result = resolveLink('other.md', 'folder/current.md', [], exists)
    expect(result).toEqual({
      kind: 'note',
      path: 'folder/other.md',
      resolved: true,
    })
  })

  it('resolves a Note-relative path across folders (parent-relative)', () => {
    const exists = (path: string) => path === 'sibling/other.md'
    const result = resolveLink(
      '../sibling/other.md',
      'folder/current.md',
      [],
      exists,
    )
    expect(result).toEqual({
      kind: 'note',
      path: 'sibling/other.md',
      resolved: true,
    })
  })

  it('classifies a Note-relative path to a missing file as missing', () => {
    const result = resolveLink('other.md', 'folder/current.md', [], noNotes)
    expect(result).toEqual({
      kind: 'note',
      path: 'folder/other.md',
      resolved: false,
    })
  })

  it('classifies a target missing the .md extension as unresolved rather than guessed', () => {
    expect(resolveLink('image.png', 'note.md', [], () => true)).toEqual({
      kind: 'unresolved',
    })
  })

  it('classifies a relative target with no extension at all as unresolved', () => {
    expect(resolveLink('other-note', 'note.md', [], () => true)).toEqual({
      kind: 'unresolved',
    })
  })

  it('classifies an empty target as unresolved', () => {
    expect(resolveLink('', 'note.md', [], noNotes)).toEqual({
      kind: 'unresolved',
    })
  })

  it('classifies a target escaping above the Root as unresolved', () => {
    expect(resolveLink('../../other.md', 'note.md', [], () => true)).toEqual({
      kind: 'unresolved',
    })
  })

  it('composes a Note+Anchor target that fully resolves when it self-references the current Note', () => {
    // `headings` only ever describes the current document (`currentNotePath`)
    // — the anchor half can only be genuinely checked when the target Note
    // *is* that document, e.g. an explicit self-link.
    const exists = (path: string) => path === 'note.md'
    const result = resolveLink('note.md#intro', 'note.md', ['Intro'], exists)
    expect(result).toEqual({
      kind: 'noteAnchor',
      path: 'note.md',
      noteResolved: true,
      slug: 'intro',
      anchorResolved: true,
    })
  })

  it('classifies a self-referencing Note+Anchor target where the Note resolves but the anchor does not, distinctly from fully resolved and Note-missing', () => {
    const exists = (path: string) => path === 'note.md'

    const brokenAnchor = resolveLink(
      'note.md#missing',
      'note.md',
      ['Intro'],
      exists,
    )
    const fullyResolved = resolveLink(
      'note.md#intro',
      'note.md',
      ['Intro'],
      exists,
    )
    const noteMissing = resolveLink(
      'note.md#intro',
      'note.md',
      ['Intro'],
      noNotes,
    )

    expect(brokenAnchor).toEqual({
      kind: 'noteAnchor',
      path: 'note.md',
      noteResolved: true,
      slug: 'missing',
      anchorResolved: false,
    })
    expect(brokenAnchor).not.toEqual(fullyResolved)
    expect(brokenAnchor).not.toEqual(noteMissing)
  })

  it('classifies anchorResolved as "unknown" for a Note+Anchor pointing at a different Note', () => {
    // Resolving the Note half doesn't require its content — only this
    // function's caller (or its own caller) can inspect another Note's
    // real headings, since `headings` here is only ever this document's.
    const exists = (path: string) => path === 'other.md'
    const result = resolveLink('other.md#intro', 'note.md', ['Intro'], exists)
    expect(result).toEqual({
      kind: 'noteAnchor',
      path: 'other.md',
      noteResolved: true,
      slug: 'intro',
      anchorResolved: 'unknown',
    })
  })

  it('classifies a Note+Anchor target where the Note itself is missing, with an unknown anchor', () => {
    const result = resolveLink(
      'missing.md#intro',
      'note.md',
      ['Intro'],
      noNotes,
    )
    expect(result).toEqual({
      kind: 'noteAnchor',
      path: 'missing.md',
      noteResolved: false,
      slug: 'intro',
      anchorResolved: 'unknown',
    })
  })
})

describe('isLinkBroken', () => {
  it('is never broken for an external link', () => {
    expect(isLinkBroken({ kind: 'external' })).toBe(false)
  })

  it('is broken for a missing Note', () => {
    expect(isLinkBroken({ kind: 'note', path: 'x.md', resolved: false })).toBe(
      true,
    )
  })

  it('is not broken for a resolved Note', () => {
    expect(isLinkBroken({ kind: 'note', path: 'x.md', resolved: true })).toBe(
      false,
    )
  })

  it('is broken for a Note+Anchor whose anchor does not resolve, even if the Note does', () => {
    expect(
      isLinkBroken({
        kind: 'noteAnchor',
        path: 'x.md',
        noteResolved: true,
        slug: 's',
        anchorResolved: false,
      }),
    ).toBe(true)
  })

  it('is not broken for a Note+Anchor with an unknown anchor, as long as the Note resolves', () => {
    expect(
      isLinkBroken({
        kind: 'noteAnchor',
        path: 'x.md',
        noteResolved: true,
        slug: 's',
        anchorResolved: 'unknown',
      }),
    ).toBe(false)
  })

  it('is broken for an unresolved target', () => {
    expect(isLinkBroken({ kind: 'unresolved' })).toBe(true)
  })
})
