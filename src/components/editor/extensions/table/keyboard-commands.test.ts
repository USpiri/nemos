import { Editor } from '@tiptap/core'
import { CellSelection, TableMap } from '@tiptap/pm/tables'
import { describe, expect, it } from 'vitest'
import { Extensions } from '@/components/editor/extensions'
import {
  deleteColumnAtCursor,
  deleteEmptyRowOnBackspace,
  deleteEmptyTableOnBackspace,
  deleteRowAtCursor,
  duplicateColumnAtCursor,
  duplicateRowAtCursor,
  exitTableOnTab,
  goToAdjacentRow,
  insertColumnAtCursor,
  insertRowAtCursor,
  moveColumnAtCursor,
  moveRowAtCursor,
  selectColumnAtCursor,
  selectRowAtCursor,
} from './keyboard-commands'

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

/** Resolves the position right at the very start of the given text's cell
 * (i.e. right before the first character). */
function findCellStart(editor: Editor, text: string): number {
  return findTextPos(editor, text) - 1
}

/** Resolves the content-start position of the (only) table's cell at
 * (row, col), wherever that table sits in the document. */
function findCellContentStart(
  editor: Editor,
  row: number,
  col: number,
): number {
  let tablePos: number | null = null
  editor.state.doc.descendants((node, pos) => {
    if (tablePos !== null) return false
    if (node.type.name === 'table') {
      tablePos = pos
      return false
    }
    return true
  })
  if (tablePos === null) throw new Error('No table found in document')

  const table = editor.state.doc.nodeAt(tablePos)!
  const map = TableMap.get(table)
  const cellPos = tablePos + 1 + map.positionAt(row, col, table)
  return cellPos + 2
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

const EMPTY_TABLE = `
|  |  |
| - | - |
|  |  |
`

describe('deleteEmptyTableOnBackspace', () => {
  it('replaces the table with an empty paragraph when it is the only document content', () => {
    const editor = createEditor(EMPTY_TABLE)
    editor.commands.setTextSelection(findCellContentStart(editor, 0, 0))

    const result = deleteEmptyTableOnBackspace(
      editor.state,
      editor.view.dispatch,
    )

    expect(result).toBe(true)
    expect(editor.state.doc.childCount).toBe(1)
    expect(editor.state.doc.firstChild!.type.name).toBe('paragraph')
    expect(editor.state.selection.$from.parent.type.name).toBe('paragraph')
    editor.destroy()
  })

  it('deletes the table outright and lands the cursor nearby when other content exists', () => {
    const editor = createEditor(`
Some text

|  |  |
| - | - |
|  |  |
`)
    editor.commands.setTextSelection(findCellContentStart(editor, 0, 0))

    const result = deleteEmptyTableOnBackspace(
      editor.state,
      editor.view.dispatch,
    )

    expect(result).toBe(true)
    expect(editor.state.doc.childCount).toBe(1)
    expect(editor.state.doc.firstChild!.textContent).toBe('Some text')
    editor.destroy()
  })

  it('is a no-op when some cell in the table has content', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findCellStart(editor, 'A'))
    const before = editor.state.doc.toJSON()

    const result = deleteEmptyTableOnBackspace(
      editor.state,
      editor.view.dispatch,
    )

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('is a no-op when the cursor is not in the first header cell', () => {
    const editor = createEditor(EMPTY_TABLE)
    editor.commands.setTextSelection(findCellContentStart(editor, 0, 1))
    const before = editor.state.doc.toJSON()

    const result = deleteEmptyTableOnBackspace(
      editor.state,
      editor.view.dispatch,
    )

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})

describe('deleteEmptyRowOnBackspace', () => {
  it('deletes an all-empty non-header row and places the cursor at the end of the previous row', () => {
    const editor = createEditor(TABLE)
    // Append an empty row after the existing two body rows.
    const cursorInLastCell = findTextPos(editor, '4')
    editor.commands.setTextSelection(cursorInLastCell)
    insertRowAtCursor(editor.state, editor.view.dispatch, 1)

    expect(editor.state.doc.firstChild!.childCount).toBe(4)

    // Move cursor to the very start of the new empty row (row index 3, col 0).
    editor.commands.setTextSelection(findCellContentStart(editor, 3, 0))

    const result = deleteEmptyRowOnBackspace(editor.state, editor.view.dispatch)

    expect(result).toBe(true)
    expect(editor.state.doc.firstChild!.childCount).toBe(3)
    expect(editor.state.selection.$from.pos).toBe(findTextPos(editor, '4'))
    editor.destroy()
  })

  it('is a no-op on the header row', () => {
    const editor = createEditor(TABLE)
    const before = editor.state.doc.toJSON()
    editor.commands.setTextSelection(findCellStart(editor, 'A'))

    const result = deleteEmptyRowOnBackspace(editor.state, editor.view.dispatch)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it("is a no-op when it's the table's only remaining body row", () => {
    const editor = createEditor(SINGLE_BODY_ROW_TABLE)
    editor.commands.setTextSelection(findCellStart(editor, '1'))
    const before = editor.state.doc.toJSON()

    const result = deleteEmptyRowOnBackspace(editor.state, editor.view.dispatch)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('is a no-op when the row is not empty', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findCellStart(editor, '1'))
    const before = editor.state.doc.toJSON()

    const result = deleteEmptyRowOnBackspace(editor.state, editor.view.dispatch)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('is a no-op when the cursor is not at the very start of the row', () => {
    const editor = createEditor(TABLE)
    // End of the cell's content, not its start.
    editor.commands.setTextSelection(findTextPos(editor, '1'))
    const before = editor.state.doc.toJSON()

    const result = deleteEmptyRowOnBackspace(editor.state, editor.view.dispatch)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})

describe('exitTableOnTab', () => {
  it('exits to a new paragraph after the table when the last row is entirely empty', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, '4'))
    insertRowAtCursor(editor.state, editor.view.dispatch, 1)

    // Move cursor into the last cell (row index 3, col 1) of the new empty row.
    editor.commands.setTextSelection(findCellContentStart(editor, 3, 1))

    const tablePos = 0
    const tableNodeSize = editor.state.doc.firstChild!.nodeSize
    const result = exitTableOnTab(editor.state, editor.view.dispatch)

    expect(result).toBe(true)
    const afterTable = editor.state.doc.nodeAt(tablePos + tableNodeSize)
    expect(afterTable?.type.name).toBe('paragraph')
    expect(editor.state.selection.$from.parent.type.name).toBe('paragraph')
    editor.destroy()
  })

  it('is a no-op when the last row is not empty', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, '4'))
    const before = editor.state.doc.toJSON()

    const result = exitTableOnTab(editor.state, editor.view.dispatch)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('is a no-op when the cursor is not in the last cell', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, '1'))
    const before = editor.state.doc.toJSON()

    const result = exitTableOnTab(editor.state, editor.view.dispatch)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})

describe('goToAdjacentRow', () => {
  it('moves the cursor to the same column in the next row on Enter (direction 1)', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, '1'))

    const result = goToAdjacentRow(editor.state, editor.view.dispatch, 1)

    expect(result).toBe(true)
    expect(editor.state.selection.$from.parent.textContent).toBe('3')
    editor.destroy()
  })

  it('moves the cursor to the same column in the previous row on Shift-Enter (direction -1)', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, '3'))

    const result = goToAdjacentRow(editor.state, editor.view.dispatch, -1)

    expect(result).toBe(true)
    expect(editor.state.selection.$from.parent.textContent).toBe('1')
    editor.destroy()
  })

  it('is a no-op past the last row', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, '3'))
    const before = editor.state.doc.toJSON()

    const result = goToAdjacentRow(editor.state, editor.view.dispatch, 1)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('is a no-op above the header row', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, 'A'))
    const before = editor.state.doc.toJSON()

    const result = goToAdjacentRow(editor.state, editor.view.dispatch, -1)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })
})

describe('insertRowAtCursor / insertColumnAtCursor', () => {
  it('inserts a row above the cursor row', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, '1'))

    const result = insertRowAtCursor(editor.state, editor.view.dispatch, 0)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.childCount).toBe(4)
    expect(table.child(1).child(0).textContent).toBe('')
    expect(table.child(2).child(0).textContent).toBe('1')
    editor.destroy()
  })

  it('inserts a row below the cursor row', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, '1'))

    const result = insertRowAtCursor(editor.state, editor.view.dispatch, 1)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.child(1).child(0).textContent).toBe('1')
    expect(table.child(2).child(0).textContent).toBe('')
    editor.destroy()
  })

  it('rejects inserting above the header row', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, 'A'))
    const before = editor.state.doc.toJSON()

    const result = insertRowAtCursor(editor.state, editor.view.dispatch, 0)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('inserts a column left/right of the cursor column', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, 'B'))

    const result = insertColumnAtCursor(editor.state, editor.view.dispatch, 0)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.child(0).childCount).toBe(3)
    expect(table.child(0).child(1).textContent).toBe('')
    expect(table.child(0).child(2).textContent).toBe('B')
    editor.destroy()
  })
})

describe('moveRowAtCursor / moveColumnAtCursor', () => {
  it('moves the cursor row down, keeping the cursor in its own cell', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, '1'))

    const result = moveRowAtCursor(editor.state, editor.view.dispatch, 1)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.child(1).child(0).textContent).toBe('3')
    expect(table.child(2).child(0).textContent).toBe('1')
    // The cursor followed its own cell to row index 2, not out of the table.
    expect(editor.state.selection.$from.parent.textContent).toBe('1')
    editor.destroy()
  })

  it('rejects moving the header row', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, 'A'))
    const before = editor.state.doc.toJSON()

    const result = moveRowAtCursor(editor.state, editor.view.dispatch, 1)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('rejects moving a body row above the header', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, '1'))
    const before = editor.state.doc.toJSON()

    const result = moveRowAtCursor(editor.state, editor.view.dispatch, -1)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('moves the cursor column right, keeping the cursor in its own cell', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, 'A'))

    const result = moveColumnAtCursor(editor.state, editor.view.dispatch, 1)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.child(0).child(0).textContent).toBe('B')
    expect(table.child(0).child(1).textContent).toBe('A')
    // The cursor followed its own cell to column index 1, not out of the table.
    expect(editor.state.selection.$from.parent.textContent).toBe('A')
    editor.destroy()
  })
})

describe('deleteRowAtCursor / deleteColumnAtCursor', () => {
  it('deletes the cursor row', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, '1'))

    const result = deleteRowAtCursor(editor.state, editor.view.dispatch)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.childCount).toBe(2)
    expect(table.child(1).child(0).textContent).toBe('3')
    editor.destroy()
  })

  it('rejects deleting the header row', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, 'A'))
    const before = editor.state.doc.toJSON()

    const result = deleteRowAtCursor(editor.state, editor.view.dispatch)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it("rejects deleting the table's only remaining body row", () => {
    const editor = createEditor(SINGLE_BODY_ROW_TABLE)
    editor.commands.setTextSelection(findTextPos(editor, '1'))
    const before = editor.state.doc.toJSON()

    const result = deleteRowAtCursor(editor.state, editor.view.dispatch)

    expect(result).toBe(false)
    expect(editor.state.doc.toJSON()).toEqual(before)
    editor.destroy()
  })

  it('deletes the cursor column', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, 'A'))

    const result = deleteColumnAtCursor(editor.state, editor.view.dispatch)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.child(0).childCount).toBe(1)
    expect(table.child(0).child(0).textContent).toBe('B')
    editor.destroy()
  })
})

describe('duplicateRowAtCursor / duplicateColumnAtCursor', () => {
  it('duplicates the cursor row immediately after it', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, '1'))

    const result = duplicateRowAtCursor(editor.state, editor.view.dispatch)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.childCount).toBe(4)
    expect(table.child(1).child(0).textContent).toBe('1')
    expect(table.child(2).child(0).textContent).toBe('1')
    editor.destroy()
  })

  it('duplicating the header row demotes the copy to a body row', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, 'A'))

    const result = duplicateRowAtCursor(editor.state, editor.view.dispatch)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.child(0).child(0).type.name).toBe('tableHeader')
    expect(table.child(1).child(0).type.name).toBe('tableCell')
    expect(table.child(1).child(0).textContent).toBe('A')
    editor.destroy()
  })

  it('duplicates the cursor column immediately after it', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, 'A'))

    const result = duplicateColumnAtCursor(editor.state, editor.view.dispatch)

    expect(result).toBe(true)
    const table = editor.state.doc.firstChild!
    expect(table.child(0).childCount).toBe(3)
    expect(table.child(0).child(1).textContent).toBe('A')
    expect(table.child(0).child(2).textContent).toBe('B')
    editor.destroy()
  })
})

describe('selectRowAtCursor / selectColumnAtCursor', () => {
  it('selects every cell in the cursor row', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, '1'))

    const result = selectRowAtCursor(editor.state, editor.view.dispatch)

    expect(result).toBe(true)
    expect(editor.state.selection).toBeInstanceOf(CellSelection)
    const selection = editor.state.selection as CellSelection
    expect(selection.$anchorCell.parent.childCount).toBeGreaterThanOrEqual(2)
    editor.destroy()
  })

  it('selects every cell in the cursor column', () => {
    const editor = createEditor(TABLE)
    editor.commands.setTextSelection(findTextPos(editor, 'A'))

    const result = selectColumnAtCursor(editor.state, editor.view.dispatch)

    expect(result).toBe(true)
    expect(editor.state.selection).toBeInstanceOf(CellSelection)
    editor.destroy()
  })
})
