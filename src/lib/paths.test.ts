import { describe, expect, it } from 'vitest'
import { toFsPath, toRelativePath } from './paths'

describe('toFsPath', () => {
  it('returns the Root path unchanged when relativePath is omitted', () => {
    expect(toFsPath('C:/Users/x/Documents/nemos-app/personal')).toBe(
      'C:/Users/x/Documents/nemos-app/personal',
    )
  })

  it('joins the Root path with a relative path', () => {
    expect(
      toFsPath('C:/Users/x/Documents/nemos-app/personal', 'folder/note.md'),
    ).toBe('C:/Users/x/Documents/nemos-app/personal/folder/note.md')
  })

  it('works for a Root path outside the default nemos-app location', () => {
    expect(toFsPath('D:/projects/my-notes', 'note.md')).toBe(
      'D:/projects/my-notes/note.md',
    )
  })
})

describe('toRelativePath', () => {
  const root = 'C:/Users/x/Documents/nemos-app/personal'

  it('strips the Root prefix from a nested fsPath', () => {
    expect(toRelativePath(`${root}/folder/note.md`, root)).toBe(
      'folder/note.md',
    )
  })

  it('strips the Root prefix from a top-level fsPath', () => {
    expect(toRelativePath(`${root}/folder`, root)).toBe('folder')
  })

  it('returns an empty string for the Root path itself', () => {
    expect(toRelativePath(root, root)).toBe('')
  })

  it('works for an arbitrary Root path outside nemos-app', () => {
    const arbitraryRoot = 'D:/projects/my-notes'
    expect(toRelativePath(`${arbitraryRoot}/note.md`, arbitraryRoot)).toBe(
      'note.md',
    )
  })
})
