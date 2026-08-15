import { Editor } from '@tiptap/core'
import { TableMap } from '@tiptap/pm/tables'
import { describe, expect, it } from 'vitest'
import { Extensions } from '@/components/editor/extensions'
import { applyColumnAlign, setColumnAlign, setColumnAlignAt } from './align'

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

describe('setColumnAlignAt', () => {
  it('aligns every cell in the given column (header included) regardless of selection', () => {
    const editor = createEditor(TABLE)

    const result = setColumnAlignAt(
      editor.state,
      editor.view.dispatch,
      0,
      1,
      'right',
    )

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    const colBAligns: (string | null)[] = []
    const colAAligns: (string | null)[] = []
    table.forEach((row) => {
      colAAligns.push(row.child(0).attrs.align)
      colBAligns.push(row.child(1).attrs.align)
    })

    expect(colBAligns).toEqual(['right', 'right', 'right'])
    expect(colAAligns).toEqual([null, null, null])
    editor.destroy()
  })

  it('rejects an out-of-bounds column index', () => {
    const editor = createEditor(TABLE)
    const map = TableMap.get(editor.state.doc.firstChild!)
    const before = editor.state.doc.toJSON()

    const result = setColumnAlignAt(
      editor.state,
      editor.view.dispatch,
      0,
      map.width,
      'center',
    )

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects a position that is not a table', () => {
    const editor = createEditor('just a paragraph')

    const result = setColumnAlignAt(
      editor.state,
      editor.view.dispatch,
      0,
      0,
      'center',
    )

    expect(result).toBe(false)
    editor.destroy()
  })

  it('is a no-op in dry-run mode (dispatch undefined) but still reports success', () => {
    const editor = createEditor(TABLE)
    const before = editor.state.doc.toJSON()

    const result = setColumnAlignAt(editor.state, undefined, 0, 0, 'center')

    expect(result).toBe(true)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})
