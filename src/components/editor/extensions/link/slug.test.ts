import { describe, expect, it } from 'vitest'
import { slugify, slugifyHeadings } from './slug'

describe('slugify', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugify('Some Heading')).toBe('some-heading')
  })

  it('strips punctuation', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
  })

  it('is case- and punctuation-insensitive for equivalent headings', () => {
    expect(slugify('Hello, World!')).toBe(slugify('hello world'))
  })

  it('keeps unicode letters', () => {
    expect(slugify('Café Résumé')).toBe('café-résumé')
  })
})

describe('slugifyHeadings', () => {
  it('de-duplicates repeated heading text with -1, -2 suffixes', () => {
    expect(slugifyHeadings(['Summary', 'Summary', 'Summary'])).toEqual([
      'summary',
      'summary-1',
      'summary-2',
    ])
  })

  it('keeps distinct headings independent', () => {
    expect(slugifyHeadings(['Intro', 'Summary', 'Intro'])).toEqual([
      'intro',
      'summary',
      'intro-1',
    ])
  })
})
