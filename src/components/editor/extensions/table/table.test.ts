import { Editor, type JSONContent } from '@tiptap/core'
import { describe, expect, it } from 'vitest'
import { Extensions } from '@/components/editor/extensions'

function createEditor(content: string) {
  return new Editor({
    extensions: Extensions,
    content,
    contentType: 'markdown',
  })
}

/** Resolves the doc position right after the given text's first character. */
function findTextPos(editor: Editor, text: string): number {
  let found: number | null = null

  editor.state.doc.descendants((node, pos) => {
    if (found !== null) return false
    if (node.isText && node.text === text) {
      found = pos + 1
    }
  })

  if (found === null) {
    throw new Error(`Text "${text}" not found in document`)
  }

  return found
}

const ALIGNED_TABLE = `
| Left | Center | Right | None |
| :--- | :----: | ----: | ---- |
| a    | b      | c     | d    |
`

describe('table markdown round-trip', () => {
  it('parses per-column alignment into cell attrs', () => {
    const editor = createEditor(ALIGNED_TABLE)
    const json = editor.getJSON() as JSONContent
    const table = json.content?.find(n => n.type === 'table')
    expect(table).toBeDefined()

    const [headerRow, bodyRow] = table!.content!
    const aligns = headerRow.content!.map(cell => cell.attrs?.align)
    expect(aligns).toEqual(['left', 'center', 'right', null])

    const bodyAligns = bodyRow.content!.map(cell => cell.attrs?.align)
    expect(bodyAligns).toEqual(['left', 'center', 'right', null])

    editor.destroy()
  })

  it('re-serializes the original alignment in the delimiter row', () => {
    const editor = createEditor(ALIGNED_TABLE)
    const markdown = editor.getMarkdown()
    const lines = markdown.split('\n').filter(Boolean)
    const delimiterLine = lines[1]

    const cells = delimiterLine
      .split('|')
      .map(s => s.trim())
      .filter(Boolean)

    expect(cells[0].startsWith(':')).toBe(true)
    expect(cells[0].endsWith(':')).toBe(false)

    expect(cells[1].startsWith(':')).toBe(true)
    expect(cells[1].endsWith(':')).toBe(true)

    expect(cells[2].startsWith(':')).toBe(false)
    expect(cells[2].endsWith(':')).toBe(true)

    expect(cells[3].startsWith(':')).toBe(false)
    expect(cells[3].endsWith(':')).toBe(false)

    editor.destroy()
  })

  it('round-trips a table with no alignment at all', () => {
    const plain = `
| A | B |
| - | - |
| 1 | 2 |
`
    const editor = createEditor(plain)
    const markdown = editor.getMarkdown()
    expect(markdown).toMatch(/\|\s*A\s*\|\s*B\s*\|/)
    expect(markdown).toMatch(/\|\s*-+\s*\|\s*-+\s*\|/)
    expect(markdown).toMatch(/\|\s*1\s*\|\s*2\s*\|/)
    editor.destroy()
  })

  it('preserves inline marks inside cells across the round-trip', () => {
    const withMarks = `
| Name |
| ---- |
| **bold** and _italic_ |
`
    const editor = createEditor(withMarks)
    const markdown = editor.getMarkdown()
    expect(markdown).toContain('**bold**')
    expect(markdown).toMatch(/_italic_|\*italic\*/)
    editor.destroy()
  })
})

describe('table cell content model', () => {
  it('restricts tableCell and tableHeader to a single mandatory paragraph', () => {
    const editor = createEditor(ALIGNED_TABLE)
    const { tableCell, tableHeader, paragraph, bulletList } = editor.schema.nodes

    const afterOneParagraph = tableCell.contentMatch.matchType(paragraph)
    expect(afterOneParagraph?.validEnd).toBe(true)
    expect(afterOneParagraph?.matchType(paragraph)).toBeNull()
    expect(tableCell.contentMatch.matchType(bulletList)).toBeNull()

    const headerAfterOneParagraph = tableHeader.contentMatch.matchType(paragraph)
    expect(headerAfterOneParagraph?.validEnd).toBe(true)
    expect(headerAfterOneParagraph?.matchType(paragraph)).toBeNull()
    expect(tableHeader.contentMatch.matchType(bulletList)).toBeNull()

    editor.destroy()
  })

  it('treats Enter inside a cell as a no-op', () => {
    const editor = createEditor(ALIGNED_TABLE)
    const pos = findTextPos(editor, 'a')
    editor.commands.setTextSelection(pos)

    const before = editor.state.doc.toJSON()
    const handled = editor.commands.first(({ commands }) => [
      () => commands.newlineInCode(),
      () => commands.createParagraphNear(),
      () => commands.liftEmptyBlock(),
      () => commands.splitBlock(),
    ])

    expect(handled).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)

    editor.destroy()
  })
})

describe('merge/split commands', () => {
  it('disables mergeCells, splitCell, and mergeOrSplit', () => {
    const editor = createEditor(ALIGNED_TABLE)

    expect(editor.commands.mergeCells()).toBe(false)
    expect(editor.commands.splitCell()).toBe(false)
    expect(editor.commands.mergeOrSplit()).toBe(false)

    editor.destroy()
  })
})

describe('setColumnAlign command', () => {
  it('applies alignment to every cell in the column, header included', () => {
    const plain = `
| A | B |
| - | - |
| 1 | 2 |
| 3 | 4 |
`
    const editor = createEditor(plain)
    const pos = findTextPos(editor, '1')
    editor.commands.setTextSelection(pos)

    const result = editor.commands.setColumnAlign('right')
    expect(result).toBe(true)

    const json = editor.getJSON() as JSONContent
    const table = json.content!.find(n => n.type === 'table')!
    const colAAligns = table.content!.map(row => row.content![0].attrs?.align)
    const colBAligns = table.content!.map(row => row.content![1].attrs?.align)

    expect(colAAligns).toEqual(['right', 'right', 'right'])
    expect(colBAligns).toEqual([null, null, null])

    editor.destroy()
  })
})
