import { describe, expect, it } from 'vitest'
import { parseLinkSource, serializeLinkSource } from './grammar'

describe('parseLinkSource', () => {
  it('parses a label and href', () => {
    expect(parseLinkSource('[Nemos](https://nemos.app)')).toEqual({
      label: 'Nemos',
      href: 'https://nemos.app',
      title: null,
    })
  })

  it('parses an empty href', () => {
    expect(parseLinkSource('[Nemos]()')).toEqual({
      label: 'Nemos',
      href: '',
      title: null,
    })
  })

  it('parses a title', () => {
    expect(parseLinkSource('[Nemos](https://nemos.app "Homepage")')).toEqual({
      label: 'Nemos',
      href: 'https://nemos.app',
      title: 'Homepage',
    })
  })

  it('parses an empty label', () => {
    expect(parseLinkSource('[](https://nemos.app)')).toEqual({
      label: '',
      href: 'https://nemos.app',
      title: null,
    })
  })

  it('parses an autolink where label equals href', () => {
    expect(parseLinkSource('[https://nemos.app](https://nemos.app)')).toEqual({
      label: 'https://nemos.app',
      href: 'https://nemos.app',
      title: null,
    })
  })

  it('returns null for plain text with no brackets', () => {
    expect(parseLinkSource('just some text')).toBeNull()
  })

  it('returns null for an unclosed bracket', () => {
    expect(parseLinkSource('[Nemos(https://nemos.app)')).toBeNull()
  })

  it('returns null for a missing parenthesized href', () => {
    expect(parseLinkSource('[Nemos]')).toBeNull()
  })

  it('returns null when the href contains whitespace', () => {
    expect(parseLinkSource('[Nemos](https://nemos.app extra)')).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(parseLinkSource('')).toBeNull()
  })
})

describe('serializeLinkSource', () => {
  it('serializes label and href without a title', () => {
    expect(
      serializeLinkSource({
        label: 'Nemos',
        href: 'https://nemos.app',
        title: null,
      }),
    ).toBe('[Nemos](https://nemos.app)')
  })

  it('serializes a title in quotes', () => {
    expect(
      serializeLinkSource({
        label: 'Nemos',
        href: 'https://nemos.app',
        title: 'Homepage',
      }),
    ).toBe('[Nemos](https://nemos.app "Homepage")')
  })

  it('serializes an empty href as empty parens', () => {
    expect(serializeLinkSource({ label: 'Nemos', href: '', title: null })).toBe(
      '[Nemos]()',
    )
  })

  it('always uses the full bracket form even when label equals href', () => {
    expect(
      serializeLinkSource({
        label: 'https://nemos.app',
        href: 'https://nemos.app',
        title: null,
      }),
    ).toBe('[https://nemos.app](https://nemos.app)')
  })

  it('omits the title suffix when title is an empty string', () => {
    expect(
      serializeLinkSource({
        label: 'Nemos',
        href: 'https://nemos.app',
        title: '',
      }),
    ).toBe('[Nemos](https://nemos.app)')
  })
})

describe('parseLinkSource / serializeLinkSource round-trip', () => {
  it.each([
    { label: 'Nemos', href: 'https://nemos.app', title: null },
    { label: 'Nemos', href: 'https://nemos.app', title: 'Homepage' },
    { label: '', href: 'https://nemos.app', title: null },
    { label: 'Nemos', href: '', title: null },
  ])('round-trips %o', (source) => {
    expect(parseLinkSource(serializeLinkSource(source))).toEqual(source)
  })
})
