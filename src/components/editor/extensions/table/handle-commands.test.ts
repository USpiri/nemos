import { Editor } from '@tiptap/core'
import { TableMap } from '@tiptap/pm/tables'
import { describe, expect, it } from 'vitest'
import { Extensions } from '@/components/editor/extensions'
import {
  deleteColumnAt,
  deleteRowAt,
  duplicateColumnAt,
  duplicateRowAt,
  insertColumnAt,
  insertRowAt,
} from './handle-commands'

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

const SINGLE_BODY_ROW_TABLE = `
| A | B |
| - | - |
| 1 | 2 |
`

const SINGLE_COLUMN_TABLE = `
| A |
| - |
| 1 |
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
    insertedRow.forEach((cell) => {
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

    const result = insertRowAt(
      editor.state,
      editor.view.dispatch,
      0,
      map.height,
    )

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

    const result = insertRowAt(
      editor.state,
      editor.view.dispatch,
      0,
      map.height + 1,
    )

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
      expect(row.child(1).type.name).toBe(
        index === 0 ? 'tableHeader' : 'tableCell',
      )
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

    const result = insertColumnAt(
      editor.state,
      editor.view.dispatch,
      0,
      map.width,
    )

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

    const result = insertColumnAt(
      editor.state,
      editor.view.dispatch,
      0,
      map.width + 1,
    )

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

describe('deleteRowAt', () => {
  it('rejects deleting the header row', () => {
    const editor = createEditor(TABLE)
    const before = editor.state.doc.toJSON()

    const result = deleteRowAt(editor.state, editor.view.dispatch, 0, 0)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects deleting the only remaining body row', () => {
    const editor = createEditor(SINGLE_BODY_ROW_TABLE)
    const before = editor.state.doc.toJSON()

    const result = deleteRowAt(editor.state, editor.view.dispatch, 0, 1)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('deletes a body row when another body row remains', () => {
    const editor = createEditor(TABLE)

    const result = deleteRowAt(editor.state, editor.view.dispatch, 0, 1)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.childCount).toBe(2)
    expect(table.child(0).child(0).textContent).toBe('A')
    expect(table.child(1).child(0).textContent).toBe('3')
    editor.destroy()
  })

  it('rejects an out-of-bounds row index', () => {
    const editor = createEditor(TABLE)
    const map = TableMap.get(editor.state.doc.firstChild!)
    const before = editor.state.doc.toJSON()

    const result = deleteRowAt(
      editor.state,
      editor.view.dispatch,
      0,
      map.height,
    )

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects a position that is not a table', () => {
    const editor = createEditor('just a paragraph')

    const result = deleteRowAt(editor.state, editor.view.dispatch, 0, 1)

    expect(result).toBe(false)
    editor.destroy()
  })

  it('is a no-op in dry-run mode (dispatch undefined) but still reports success', () => {
    const editor = createEditor(TABLE)
    const before = editor.state.doc.toJSON()

    const result = deleteRowAt(editor.state, undefined, 0, 1)

    expect(result).toBe(true)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})

describe('deleteColumnAt', () => {
  it('rejects deleting the only remaining column', () => {
    const editor = createEditor(SINGLE_COLUMN_TABLE)
    const before = editor.state.doc.toJSON()

    const result = deleteColumnAt(editor.state, editor.view.dispatch, 0, 0)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('deletes a column when another column remains', () => {
    const editor = createEditor(TABLE)

    const result = deleteColumnAt(editor.state, editor.view.dispatch, 0, 0)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    table.forEach((row) => {
      expect(row.childCount).toBe(1)
    })
    expect(table.child(0).child(0).textContent).toBe('B')
    expect(table.child(1).child(0).textContent).toBe('2')
    expect(table.child(2).child(0).textContent).toBe('4')
    editor.destroy()
  })

  it('rejects an out-of-bounds column index', () => {
    const editor = createEditor(TABLE)
    const map = TableMap.get(editor.state.doc.firstChild!)
    const before = editor.state.doc.toJSON()

    const result = deleteColumnAt(
      editor.state,
      editor.view.dispatch,
      0,
      map.width,
    )

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects a position that is not a table', () => {
    const editor = createEditor('just a paragraph')

    const result = deleteColumnAt(editor.state, editor.view.dispatch, 0, 0)

    expect(result).toBe(false)
    editor.destroy()
  })

  it('is a no-op in dry-run mode (dispatch undefined) but still reports success', () => {
    const editor = createEditor(TABLE)
    const before = editor.state.doc.toJSON()

    const result = deleteColumnAt(editor.state, undefined, 0, 0)

    expect(result).toBe(true)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})

describe('duplicateRowAt', () => {
  it('inserts a copy of a body row immediately after it', () => {
    const editor = createEditor(TABLE)

    const result = duplicateRowAt(editor.state, editor.view.dispatch, 0, 1)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.childCount).toBe(4)
    expect(table.child(1).child(0).textContent).toBe('1')
    expect(table.child(2).child(0).textContent).toBe('1')
    expect(table.child(2).child(0).type.name).toBe('tableCell')
    expect(table.child(3).child(0).textContent).toBe('3')
    editor.destroy()
  })

  it('duplicating the header row inserts a body row (not a second header) at index 1', () => {
    const editor = createEditor(TABLE)

    const result = duplicateRowAt(editor.state, editor.view.dispatch, 0, 0)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.childCount).toBe(4)
    expect(table.child(0).child(0).type.name).toBe('tableHeader')
    expect(table.child(0).child(0).textContent).toBe('A')
    expect(table.child(1).child(0).type.name).toBe('tableCell')
    expect(table.child(1).child(0).textContent).toBe('A')
    expect(table.child(1).child(1).type.name).toBe('tableCell')
    expect(table.child(1).child(1).textContent).toBe('B')
    // Original first body row shifted down, untouched.
    expect(table.child(2).child(0).textContent).toBe('1')
    editor.destroy()
  })

  it('rejects an out-of-bounds row index', () => {
    const editor = createEditor(TABLE)
    const map = TableMap.get(editor.state.doc.firstChild!)
    const before = editor.state.doc.toJSON()

    const result = duplicateRowAt(
      editor.state,
      editor.view.dispatch,
      0,
      map.height,
    )

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects a position that is not a table', () => {
    const editor = createEditor('just a paragraph')

    const result = duplicateRowAt(editor.state, editor.view.dispatch, 0, 1)

    expect(result).toBe(false)
    editor.destroy()
  })

  it('is a no-op in dry-run mode (dispatch undefined) but still reports success', () => {
    const editor = createEditor(TABLE)
    const before = editor.state.doc.toJSON()

    const result = duplicateRowAt(editor.state, undefined, 0, 1)

    expect(result).toBe(true)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})

describe('duplicateColumnAt', () => {
  it('inserts a copy of a column immediately after it, preserving content and attributes', () => {
    const editor = createEditor(TABLE)
    const table = editor.state.doc.firstChild!
    const map = TableMap.get(table)
    const cellStart = 1 + map.positionAt(0, 0, table)
    editor.commands.setTextSelection(cellStart + 2)
    editor.commands.setColumnAlign('right')

    const result = duplicateColumnAt(editor.state, editor.view.dispatch, 0, 0)

    expect(result).toBe(true)
    const resultTable = editor.state.doc.firstChild!
    resultTable.forEach((row, _offset, index) => {
      expect(row.childCount).toBe(3)
      expect(row.child(1).textContent).toBe(row.child(0).textContent)
      expect(row.child(1).attrs.align).toBe(row.child(0).attrs.align)
      expect(row.child(1).type.name).toBe(
        index === 0 ? 'tableHeader' : 'tableCell',
      )
    })
    expect(resultTable.child(0).child(2).textContent).toBe('B')
    editor.destroy()
  })

  it('rejects an out-of-bounds column index', () => {
    const editor = createEditor(TABLE)
    const map = TableMap.get(editor.state.doc.firstChild!)
    const before = editor.state.doc.toJSON()

    const result = duplicateColumnAt(
      editor.state,
      editor.view.dispatch,
      0,
      map.width,
    )

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects a position that is not a table', () => {
    const editor = createEditor('just a paragraph')

    const result = duplicateColumnAt(editor.state, editor.view.dispatch, 0, 0)

    expect(result).toBe(false)
    editor.destroy()
  })

  it('is a no-op in dry-run mode (dispatch undefined) but still reports success', () => {
    const editor = createEditor(TABLE)
    const before = editor.state.doc.toJSON()

    const result = duplicateColumnAt(editor.state, undefined, 0, 0)

    expect(result).toBe(true)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})
