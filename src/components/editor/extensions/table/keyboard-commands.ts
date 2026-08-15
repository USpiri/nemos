import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import {
  type EditorState,
  Selection,
  TextSelection,
  type Transaction,
} from '@tiptap/pm/state'
import { CellSelection } from '@tiptap/pm/tables'
import {
  deleteColumnAt,
  deleteRowAt,
  duplicateColumnAt,
  duplicateRowAt,
  insertColumnAt,
  insertRowAt,
  moveColumnAt,
  moveRowAt,
  resolveCursorCell,
} from './handle-commands'

/** A row counts as empty when every one of its cells' single paragraph has
 * no content — used by the Backspace/Tab keyboard behaviors, which only
 * kick in for rows the user hasn't actually typed anything into yet. */
function isRowEmpty(row: ProseMirrorNode): boolean {
  let empty = true
  row.forEach((cell) => {
    const paragraph = cell.firstChild
    if (paragraph && paragraph.content.size > 0) empty = false
  })
  return empty
}

/** A table counts as empty when every one of its rows is empty (header
 * included) — used by the Backspace-deletes-the-whole-table behavior. */
function isTableEmpty(table: ProseMirrorNode): boolean {
  let empty = true
  table.forEach((row) => {
    if (!isRowEmpty(row)) empty = false
  })
  return empty
}

/**
 * Backspace at the very start of the header's first cell, when every cell in
 * the entire table is empty, deletes the whole table — there's nothing in it
 * to lose. Takes priority over `deleteEmptyRowOnBackspace`, which otherwise
 * always leaves the header row alone regardless of size.
 */
export function deleteEmptyTableOnBackspace(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
): boolean {
  if (!state.selection.empty) return false

  const resolved = resolveCursorCell(state)
  if (!resolved) return false

  const { tablePos, table, rowIndex, colIndex, cellPos } = resolved
  if (rowIndex !== 0 || colIndex !== 0) return false
  if (state.selection.$from.pos !== cellPos + 2) return false
  if (!isTableEmpty(table)) return false

  if (dispatch) {
    const tr = state.tr
    const isOnlyDocContent = table.nodeSize === state.doc.content.size

    if (isOnlyDocContent) {
      // Deleting the table outright would leave the doc without its
      // required block content — replace it with an empty paragraph
      // instead, mirroring what backspacing an empty first paragraph does.
      const paragraph = state.schema.nodes.paragraph.createAndFill()!
      tr.replaceWith(tablePos, tablePos + table.nodeSize, paragraph)
      tr.setSelection(TextSelection.near(tr.doc.resolve(tablePos + 1)))
    } else {
      tr.delete(tablePos, tablePos + table.nodeSize)
      tr.setSelection(Selection.near(tr.doc.resolve(tablePos), -1))
    }

    dispatch(tr)
  }

  return true
}

/**
 * Backspace at the very start of an all-empty, non-header row (and not the
 * table's only remaining body row) deletes that row and places the cursor
 * at the end of the previous row — the same "back out of an empty line"
 * feeling as Backspace on an empty list item.
 */
export function deleteEmptyRowOnBackspace(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
): boolean {
  if (!state.selection.empty) return false

  const resolved = resolveCursorCell(state)
  if (!resolved) return false

  const { tablePos, table, map, rowIndex, colIndex, cellPos } = resolved
  if (rowIndex === 0 || map.height <= 2) return false
  if (colIndex !== 0) return false
  if (state.selection.$from.pos !== cellPos + 2) return false
  if (!isRowEmpty(table.child(rowIndex))) return false

  if (dispatch) {
    const tableStart = tablePos + 1
    const prevCellRelPos = map.positionAt(rowIndex - 1, map.width - 1, table)
    const prevCell = table.nodeAt(prevCellRelPos)!
    const prevCellEnd =
      tableStart + prevCellRelPos + 2 + (prevCell.firstChild?.content.size ?? 0)

    let rowStart = tableStart
    for (let i = 0; i < rowIndex; i += 1) rowStart += table.child(i).nodeSize
    const rowEnd = rowStart + table.child(rowIndex).nodeSize

    const tr = state.tr
    tr.delete(rowStart, rowEnd)
    tr.setSelection(TextSelection.near(tr.doc.resolve(prevCellEnd)))
    dispatch(tr)
  }

  return true
}

/**
 * Tab in the last cell of the last row, when that row is entirely empty,
 * exits the table to a new paragraph immediately after it instead of the
 * base extension's default of inserting yet another row.
 */
export function exitTableOnTab(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
): boolean {
  if (!state.selection.empty) return false

  const resolved = resolveCursorCell(state)
  if (!resolved) return false

  const { tablePos, table, map, rowIndex, colIndex } = resolved
  const isLastCell = rowIndex === map.height - 1 && colIndex === map.width - 1
  if (!isLastCell) return false
  if (!isRowEmpty(table.child(rowIndex))) return false

  if (dispatch) {
    const afterTable = tablePos + table.nodeSize
    const paragraph = state.schema.nodes.paragraph.createAndFill()!

    const tr = state.tr
    tr.insert(afterTable, paragraph)
    tr.setSelection(TextSelection.near(tr.doc.resolve(afterTable + 1)))
    dispatch(tr)
  }

  return true
}

/**
 * Enter/Shift-Enter move the cursor to the same column in the next/previous
 * row, selecting that cell's content (mirroring Tab/Shift-Tab's cell-to-cell
 * navigation), instead of attempting a paragraph split the single-paragraph
 * cell content model would reject anyway.
 */
export function goToAdjacentRow(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  direction: 1 | -1,
): boolean {
  const resolved = resolveCursorCell(state)
  if (!resolved) return false

  const { tablePos, table, map, rowIndex, colIndex } = resolved
  const targetRow = rowIndex + direction
  if (targetRow < 0 || targetRow >= map.height) return false

  if (dispatch) {
    const tableStart = tablePos + 1
    const cellRelPos = map.positionAt(targetRow, colIndex, table)
    const cell = table.nodeAt(cellRelPos)!
    const cellStart = tableStart + cellRelPos + 2
    const cellEnd = cellStart + (cell.firstChild?.content.size ?? 0)

    const tr = state.tr
    tr.setSelection(
      TextSelection.between(tr.doc.resolve(cellStart), tr.doc.resolve(cellEnd)),
    )
    dispatch(tr)
  }

  return true
}

/** Inserts a row above (`offset: 0`) or below (`offset: 1`) the row the
 * cursor is currently in — the keyboard counterpart to the handle menu's
 * "Insert row above/below", reusing the same header/bounds guards. */
export function insertRowAtCursor(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  offset: 0 | 1,
): boolean {
  const resolved = resolveCursorCell(state)
  if (!resolved) return false
  return insertRowAt(
    state,
    dispatch,
    resolved.tablePos,
    resolved.rowIndex + offset,
  )
}

/** Inserts a column left (`offset: 0`) or right (`offset: 1`) of the column
 * the cursor is currently in. */
export function insertColumnAtCursor(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  offset: 0 | 1,
): boolean {
  const resolved = resolveCursorCell(state)
  if (!resolved) return false
  return insertColumnAt(
    state,
    dispatch,
    resolved.tablePos,
    resolved.colIndex + offset,
  )
}

/** Moves the row the cursor is currently in up (`-1`) or down (`1`). */
export function moveRowAtCursor(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  direction: -1 | 1,
): boolean {
  const resolved = resolveCursorCell(state)
  if (!resolved) return false
  return moveRowAt(
    state,
    dispatch,
    resolved.tablePos,
    resolved.rowIndex,
    resolved.rowIndex + direction,
  )
}

/** Moves the column the cursor is currently in left (`-1`) or right (`1`). */
export function moveColumnAtCursor(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  direction: -1 | 1,
): boolean {
  const resolved = resolveCursorCell(state)
  if (!resolved) return false
  return moveColumnAt(
    state,
    dispatch,
    resolved.tablePos,
    resolved.colIndex,
    resolved.colIndex + direction,
  )
}

/** Deletes the row the cursor is currently in. */
export function deleteRowAtCursor(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
): boolean {
  const resolved = resolveCursorCell(state)
  if (!resolved) return false
  return deleteRowAt(state, dispatch, resolved.tablePos, resolved.rowIndex)
}

/** Deletes the column the cursor is currently in. */
export function deleteColumnAtCursor(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
): boolean {
  const resolved = resolveCursorCell(state)
  if (!resolved) return false
  return deleteColumnAt(state, dispatch, resolved.tablePos, resolved.colIndex)
}

/** Duplicates the row the cursor is currently in. */
export function duplicateRowAtCursor(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
): boolean {
  const resolved = resolveCursorCell(state)
  if (!resolved) return false
  return duplicateRowAt(state, dispatch, resolved.tablePos, resolved.rowIndex)
}

/** Duplicates the column the cursor is currently in. */
export function duplicateColumnAtCursor(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
): boolean {
  const resolved = resolveCursorCell(state)
  if (!resolved) return false
  return duplicateColumnAt(
    state,
    dispatch,
    resolved.tablePos,
    resolved.colIndex,
  )
}

/** Selects every cell in the row the cursor is currently in, mirroring what
 * clicking a Row Handle already visually confirms via `selectDragSource`. */
export function selectRowAtCursor(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
): boolean {
  const resolved = resolveCursorCell(state)
  if (!resolved) return false

  const { tablePos, table, map, rowIndex } = resolved
  if (dispatch) {
    const tableStart = tablePos + 1
    const $from = state.doc.resolve(
      tableStart + map.positionAt(rowIndex, 0, table),
    )
    const $to = state.doc.resolve(
      tableStart + map.positionAt(rowIndex, map.width - 1, table),
    )
    dispatch(state.tr.setSelection(CellSelection.rowSelection($from, $to)))
  }

  return true
}

/** Selects every cell in the column the cursor is currently in. */
export function selectColumnAtCursor(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
): boolean {
  const resolved = resolveCursorCell(state)
  if (!resolved) return false

  const { tablePos, table, map, colIndex } = resolved
  if (dispatch) {
    const tableStart = tablePos + 1
    const $from = state.doc.resolve(
      tableStart + map.positionAt(0, colIndex, table),
    )
    const $to = state.doc.resolve(
      tableStart + map.positionAt(map.height - 1, colIndex, table),
    )
    dispatch(state.tr.setSelection(CellSelection.colSelection($from, $to)))
  }

  return true
}
