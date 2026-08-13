import { Editor } from '@tiptap/core'
import { TableMap } from '@tiptap/pm/tables'
import { describe, expect, it } from 'vitest'
import { Extensions } from '@/components/editor/extensions'
import { applyColumnAlign, setColumnAlign } from './align'

function createEditor(content: string) {
  return new Editor({
    extensions: Extensions,
    content,
    contentType: 'markdown',
  })
}

const TABLE = `
| A | B |
| - | - |
| 1 | 2 |
| 3 | 4 |
`

describe('applyColumnAlign', () => {
  it('sets align on every row of the given column and leaves others untouched', () => {
    const editor = createEditor(TABLE)
    const { state } = editor
    const table = state.doc.firstChild!
    const tableStart = 1
    const map = TableMap.get(table)

    const tr = applyColumnAlign(state.tr, map, tableStart, table, 0, 'right')
    const newTable = tr.doc.firstChild!

    const colAAligns: (string | null)[] = []
    const colBAligns: (string | null)[] = []
    newTable.forEach((row) => {
      colAAligns.push(row.child(0).attrs.align)
      colBAligns.push(row.child(1).attrs.align)
    })

    expect(colAAligns).toEqual(['right', 'right', 'right'])
    expect(colBAligns).toEqual([null, null, null])

    editor.destroy()
  })
})

describe('setColumnAlign', () => {
  it('returns false outside of a table', () => {
    const editor = createEditor('just a paragraph')
    const result = setColumnAlign(editor.state, undefined, 'center')
    expect(result).toBe(false)
    editor.destroy()
  })

  it('is a no-op in dry-run mode (dispatch undefined) but still reports success', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(3)
    const before = editor.state.doc.toJSON()

    const result = setColumnAlign(editor.state, undefined, 'center')

    expect(result).toBe(true)
    expect(editor.state.doc.toJSON()).toEqual(before)

    editor.destroy()
  })
})
