import { Editor } from '@tiptap/core'
import { TableMap } from '@tiptap/pm/tables'
import { describe, expect, it } from 'vitest'
import { Extensions } from '@/components/editor/extensions'
import { insertColumnAt, insertRowAt } from './handle-commands'

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

describe('insertRowAt', () => {
  it('rejects inserting at index 0 (would displace the header row)', () => {
    const editor = createEditor(TABLE)
    const before = editor.state.doc.toJSON()

    const result = insertRowAt(editor.state, editor.view.dispatch, 0, 0)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('inserts a body row directly below the header', () => {
    const editor = createEditor(TABLE)

    const result = insertRowAt(editor.state, editor.view.dispatch, 0, 1)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.childCount).toBe(4)
    const insertedRow = table.child(1)
    expect(insertedRow.childCount).toBe(2)
    insertedRow.forEach(cell => {
      expect(cell.type.name).toBe('tableCell')
      expect(cell.textContent).toBe('')
    })
    // Original rows preserved on either side.
    expect(table.child(0).child(0).textContent).toBe('A')
    expect(table.child(2).child(0).textContent).toBe('1')
    editor.destroy()
  })

  it('appends a row at the end of the table', () => {
    const editor = createEditor(TABLE)
    const map = TableMap.get(editor.state.doc.firstChild!)

    const result = insertRowAt(editor.state, editor.view.dispatch, 0, map.height)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.childCount).toBe(4)
    expect(table.child(3).child(0).type.name).toBe('tableCell')
    editor.destroy()
  })

  it('rejects an out-of-bounds row index', () => {
    const editor = createEditor(TABLE)
    const map = TableMap.get(editor.state.doc.firstChild!)
    const before = editor.state.doc.toJSON()

    const result = insertRowAt(editor.state, editor.view.dispatch, 0, map.height + 1)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects a position that is not a table', () => {
    const editor = createEditor('just a paragraph')

    const result = insertRowAt(editor.state, editor.view.dispatch, 0, 1)

    expect(result).toBe(false)
    editor.destroy()
  })

  it('is a no-op in dry-run mode (dispatch undefined) but still reports success', () => {
    const editor = createEditor(TABLE)
    const before = editor.state.doc.toJSON()

    const result = insertRowAt(editor.state, undefined, 0, 1)

    expect(result).toBe(true)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})

describe('insertColumnAt', () => {
  it('inserts a column with header cell type in the header row and body cell type elsewhere', () => {
    const editor = createEditor(TABLE)

    const result = insertColumnAt(editor.state, editor.view.dispatch, 0, 1)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    table.forEach((row, _offset, index) => {
      expect(row.childCount).toBe(3)
      expect(row.child(1).textContent).toBe('')
      expect(row.child(1).type.name).toBe(index === 0 ? 'tableHeader' : 'tableCell')
    })
    // Original columns preserved on either side.
    expect(table.child(0).child(0).textContent).toBe('A')
    expect(table.child(0).child(2).textContent).toBe('B')
    editor.destroy()
  })

  it('inserts a column at the left edge', () => {
    const editor = createEditor(TABLE)

    const result = insertColumnAt(editor.state, editor.view.dispatch, 0, 0)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.child(0).childCount).toBe(3)
    expect(table.child(0).child(0).textContent).toBe('')
    expect(table.child(0).child(1).textContent).toBe('A')
    editor.destroy()
  })

  it('appends a column at the right edge', () => {
    const editor = createEditor(TABLE)
    const map = TableMap.get(editor.state.doc.firstChild!)

    const result = insertColumnAt(editor.state, editor.view.dispatch, 0, map.width)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.child(0).childCount).toBe(3)
    expect(table.child(0).child(2).textContent).toBe('')
    editor.destroy()
  })

  it('rejects an out-of-bounds column index', () => {
    const editor = createEditor(TABLE)
    const map = TableMap.get(editor.state.doc.firstChild!)
    const before = editor.state.doc.toJSON()

    const result = insertColumnAt(editor.state, editor.view.dispatch, 0, map.width + 1)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects a position that is not a table', () => {
    const editor = createEditor('just a paragraph')

    const result = insertColumnAt(editor.state, editor.view.dispatch, 0, 0)

    expect(result).toBe(false)
    editor.destroy()
  })

  it('is a no-op in dry-run mode (dispatch undefined) but still reports success', () => {
    const editor = createEditor(TABLE)
    const before = editor.state.doc.toJSON()

    const result = insertColumnAt(editor.state, undefined, 0, 1)

    expect(result).toBe(true)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})
