import { Editor } from '@tiptap/core'
import { TableMap } from '@tiptap/pm/tables'
import { describe, expect, it } from 'vitest'
import { Extensions } from '@/components/editor/extensions'
import {
  clearColumnAt,
  clearRowAt,
  deleteColumnAt,
  deleteRowAt,
  duplicateColumnAt,
  duplicateRowAt,
  insertColumnAt,
  insertRowAt,
  moveColumnAt,
  moveRowAt,
  sortRowsByColumn,
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

const THREE_BODY_ROW_TABLE = `
| A | B |
| - | - |
| 1 | 2 |
| 3 | 4 |
| 5 | 6 |
`

const THREE_COLUMN_TABLE = `
| A | B | C |
| - | - | - |
| 1 | 2 | 3 |
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

describe('moveRowAt', () => {
  it('rejects moving the header row', () => {
    const editor = createEditor(THREE_BODY_ROW_TABLE)
    const before = editor.state.doc.toJSON()

    const result = moveRowAt(editor.state, editor.view.dispatch, 0, 0, 1)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects moving a row into the header position', () => {
    const editor = createEditor(THREE_BODY_ROW_TABLE)
    const before = editor.state.doc.toJSON()

    const result = moveRowAt(editor.state, editor.view.dispatch, 0, 1, 0)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects moving a row to its own index', () => {
    const editor = createEditor(THREE_BODY_ROW_TABLE)
    const before = editor.state.doc.toJSON()

    const result = moveRowAt(editor.state, editor.view.dispatch, 0, 1, 1)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('moves a body row down, shifting the rows in between up', () => {
    const editor = createEditor(THREE_BODY_ROW_TABLE)

    const result = moveRowAt(editor.state, editor.view.dispatch, 0, 1, 3)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.child(0).child(0).textContent).toBe('A')
    expect(table.child(1).child(0).textContent).toBe('3')
    expect(table.child(2).child(0).textContent).toBe('5')
    expect(table.child(3).child(0).textContent).toBe('1')
    editor.destroy()
  })

  it('moves a body row up, shifting the rows in between down', () => {
    const editor = createEditor(THREE_BODY_ROW_TABLE)

    const result = moveRowAt(editor.state, editor.view.dispatch, 0, 3, 1)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.child(0).child(0).textContent).toBe('A')
    expect(table.child(1).child(0).textContent).toBe('5')
    expect(table.child(2).child(0).textContent).toBe('1')
    expect(table.child(3).child(0).textContent).toBe('3')
    editor.destroy()
  })

  it('rejects an out-of-bounds row index', () => {
    const editor = createEditor(THREE_BODY_ROW_TABLE)
    const map = TableMap.get(editor.state.doc.firstChild!)
    const before = editor.state.doc.toJSON()

    const result = moveRowAt(
      editor.state,
      editor.view.dispatch,
      0,
      1,
      map.height,
    )

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects a position that is not a table', () => {
    const editor = createEditor('just a paragraph')

    const result = moveRowAt(editor.state, editor.view.dispatch, 0, 1, 2)

    expect(result).toBe(false)
    editor.destroy()
  })

  it('is a no-op in dry-run mode (dispatch undefined) but still reports success', () => {
    const editor = createEditor(THREE_BODY_ROW_TABLE)
    const before = editor.state.doc.toJSON()

    const result = moveRowAt(editor.state, undefined, 0, 1, 2)

    expect(result).toBe(true)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})

describe('moveColumnAt', () => {
  it('moves a column right, preserving header/body cell typing and attrs', () => {
    const editor = createEditor(THREE_COLUMN_TABLE)
    const table = editor.state.doc.firstChild!
    const map = TableMap.get(table)
    const cellStart = 1 + map.positionAt(0, 0, table)
    editor.commands.setTextSelection(cellStart + 2)
    editor.commands.setColumnAlign('right')

    const result = moveColumnAt(editor.state, editor.view.dispatch, 0, 0, 2)

    expect(result).toBe(true)
    const resultTable = editor.state.doc.firstChild!
    const headerRow = resultTable.child(0)
    const bodyRow = resultTable.child(1)

    expect(headerRow.childCount).toBe(3)
    expect([0, 1, 2].map((i) => headerRow.child(i).textContent)).toEqual([
      'B',
      'C',
      'A',
    ])
    expect([0, 1, 2].map((i) => bodyRow.child(i).textContent)).toEqual([
      '2',
      '3',
      '1',
    ])
    expect(headerRow.child(2).type.name).toBe('tableHeader')
    expect(bodyRow.child(2).type.name).toBe('tableCell')

    // The moved column's alignment (set on the original 'A' column) travels
    // with it to its new index; the others stay unaligned.
    expect(headerRow.child(2).attrs.align).toBe('right')
    expect(bodyRow.child(2).attrs.align).toBe('right')
    expect(headerRow.child(0).attrs.align).toBeNull()
    expect(headerRow.child(1).attrs.align).toBeNull()
    editor.destroy()
  })

  it('moves a column left', () => {
    const editor = createEditor(THREE_COLUMN_TABLE)

    const result = moveColumnAt(editor.state, editor.view.dispatch, 0, 2, 0)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.child(0).child(0).textContent).toBe('C')
    expect(table.child(0).child(1).textContent).toBe('A')
    expect(table.child(0).child(2).textContent).toBe('B')
    editor.destroy()
  })

  it('rejects moving a column to its own index', () => {
    const editor = createEditor(THREE_COLUMN_TABLE)
    const before = editor.state.doc.toJSON()

    const result = moveColumnAt(editor.state, editor.view.dispatch, 0, 1, 1)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects an out-of-bounds column index', () => {
    const editor = createEditor(THREE_COLUMN_TABLE)
    const map = TableMap.get(editor.state.doc.firstChild!)
    const before = editor.state.doc.toJSON()

    const result = moveColumnAt(
      editor.state,
      editor.view.dispatch,
      0,
      0,
      map.width,
    )

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects a position that is not a table', () => {
    const editor = createEditor('just a paragraph')

    const result = moveColumnAt(editor.state, editor.view.dispatch, 0, 0, 1)

    expect(result).toBe(false)
    editor.destroy()
  })

  it('is a no-op in dry-run mode (dispatch undefined) but still reports success', () => {
    const editor = createEditor(THREE_COLUMN_TABLE)
    const before = editor.state.doc.toJSON()

    const result = moveColumnAt(editor.state, undefined, 0, 0, 1)

    expect(result).toBe(true)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})

describe('clearRowAt', () => {
  it('empties every cell in the row, leaving the row and its alignment in place', () => {
    const editor = createEditor(TABLE)
    const table = editor.state.doc.firstChild!
    const map = TableMap.get(table)
    const cellStart = 1 + map.positionAt(0, 0, table)
    editor.commands.setTextSelection(cellStart + 2)
    editor.commands.setColumnAlign('right')

    const result = clearRowAt(editor.state, editor.view.dispatch, 0, 1)

    expect(result).toBe(true)
    const resultTable = editor.state.doc.firstChild!
    expect(resultTable.childCount).toBe(3)
    const clearedRow = resultTable.child(1)
    clearedRow.forEach((cell) => expect(cell.textContent).toBe(''))
    expect(clearedRow.child(0).attrs.align).toBe('right')
    // Other rows untouched.
    expect(resultTable.child(0).child(0).textContent).toBe('A')
    expect(resultTable.child(2).child(0).textContent).toBe('3')
    editor.destroy()
  })

  it('clears the header row when hovered, leaving it as the header row', () => {
    const editor = createEditor(TABLE)

    const result = clearRowAt(editor.state, editor.view.dispatch, 0, 0)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    const headerRow = table.child(0)
    headerRow.forEach((cell) => {
      expect(cell.textContent).toBe('')
      expect(cell.type.name).toBe('tableHeader')
    })
    editor.destroy()
  })

  it('is a no-op when the row is already empty', () => {
    const editor = createEditor(TABLE)
    clearRowAt(editor.state, editor.view.dispatch, 0, 1)
    const before = editor.state.doc.toJSON()

    const result = clearRowAt(editor.state, editor.view.dispatch, 0, 1)

    expect(result).toBe(true)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects an out-of-bounds row index', () => {
    const editor = createEditor(TABLE)
    const map = TableMap.get(editor.state.doc.firstChild!)
    const before = editor.state.doc.toJSON()

    const result = clearRowAt(editor.state, editor.view.dispatch, 0, map.height)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects a position that is not a table', () => {
    const editor = createEditor('just a paragraph')

    const result = clearRowAt(editor.state, editor.view.dispatch, 0, 0)

    expect(result).toBe(false)
    editor.destroy()
  })

  it('is a no-op in dry-run mode (dispatch undefined) but still reports success', () => {
    const editor = createEditor(TABLE)
    const before = editor.state.doc.toJSON()

    const result = clearRowAt(editor.state, undefined, 0, 1)

    expect(result).toBe(true)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})

describe('clearColumnAt', () => {
  it('empties every cell in the column, including the header, leaving alignment in place', () => {
    const editor = createEditor(TABLE)
    const table = editor.state.doc.firstChild!
    const map = TableMap.get(table)
    const cellStart = 1 + map.positionAt(0, 0, table)
    editor.commands.setTextSelection(cellStart + 2)
    editor.commands.setColumnAlign('center')

    const result = clearColumnAt(editor.state, editor.view.dispatch, 0, 0)

    expect(result).toBe(true)
    const resultTable = editor.state.doc.firstChild!
    resultTable.forEach((row) => {
      expect(row.child(0).textContent).toBe('')
      expect(row.child(0).attrs.align).toBe('center')
    })
    // Other column untouched.
    expect(resultTable.child(0).child(1).textContent).toBe('B')
    expect(resultTable.child(1).child(1).textContent).toBe('2')
    editor.destroy()
  })

  it('rejects an out-of-bounds column index', () => {
    const editor = createEditor(TABLE)
    const map = TableMap.get(editor.state.doc.firstChild!)
    const before = editor.state.doc.toJSON()

    const result = clearColumnAt(
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

    const result = clearColumnAt(editor.state, editor.view.dispatch, 0, 0)

    expect(result).toBe(false)
    editor.destroy()
  })

  it('is a no-op in dry-run mode (dispatch undefined) but still reports success', () => {
    const editor = createEditor(TABLE)
    const before = editor.state.doc.toJSON()

    const result = clearColumnAt(editor.state, undefined, 0, 0)

    expect(result).toBe(true)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})

const SORT_TABLE = `
| Name | Score |
| - | - |
| banana | 2 |
| Apple | 3 |
|  | 4 |
| cherry | 1 |
`

describe('sortRowsByColumn', () => {
  it('sorts body rows ascending by column text, case-insensitively, header fixed', () => {
    const editor = createEditor(SORT_TABLE)

    const result = sortRowsByColumn(
      editor.state,
      editor.view.dispatch,
      0,
      0,
      'asc',
    )

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.child(0).child(0).textContent).toBe('Name')
    const names = [1, 2, 3, 4].map((i) => table.child(i).child(0).textContent)
    expect(names).toEqual(['Apple', 'banana', 'cherry', ''])
    editor.destroy()
  })

  it('sorts body rows descending, still leaving empty cells last', () => {
    const editor = createEditor(SORT_TABLE)

    const result = sortRowsByColumn(
      editor.state,
      editor.view.dispatch,
      0,
      0,
      'desc',
    )

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.child(0).child(0).textContent).toBe('Name')
    const names = [1, 2, 3, 4].map((i) => table.child(i).child(0).textContent)
    expect(names).toEqual(['cherry', 'banana', 'Apple', ''])
    editor.destroy()
  })

  it('sorts by the score column, carrying each row along with it', () => {
    const editor = createEditor(SORT_TABLE)

    const result = sortRowsByColumn(
      editor.state,
      editor.view.dispatch,
      0,
      1,
      'asc',
    )

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    const rows = [1, 2, 3, 4].map((i) => [
      table.child(i).child(0).textContent,
      table.child(i).child(1).textContent,
    ])
    expect(rows).toEqual([
      ['cherry', '1'],
      ['banana', '2'],
      ['Apple', '3'],
      ['', '4'],
    ])
    editor.destroy()
  })

  it('rejects an out-of-bounds column index', () => {
    const editor = createEditor(TABLE)
    const map = TableMap.get(editor.state.doc.firstChild!)
    const before = editor.state.doc.toJSON()

    const result = sortRowsByColumn(
      editor.state,
      editor.view.dispatch,
      0,
      map.width,
      'asc',
    )

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects a position that is not a table', () => {
    const editor = createEditor('just a paragraph')

    const result = sortRowsByColumn(
      editor.state,
      editor.view.dispatch,
      0,
      0,
      'asc',
    )

    expect(result).toBe(false)
    editor.destroy()
  })

  it('is a no-op in dry-run mode (dispatch undefined) but still reports success', () => {
    const editor = createEditor(SORT_TABLE)
    const before = editor.state.doc.toJSON()

    const result = sortRowsByColumn(editor.state, undefined, 0, 0, 'asc')

    expect(result).toBe(true)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})
