import { Fragment, type Node as ProseMirrorNode } from '@tiptap/pm/model'
import {
  type EditorState,
  TextSelection,
  type Transaction,
} from '@tiptap/pm/state'
import { TableMap } from '@tiptap/pm/tables'

/** Resolves the `table` node at `tablePos` and its `TableMap`, or `null` if
 * `tablePos` isn't a table — the shared entry check every table-position
 * command starts from. */
export function resolveTable(
  state: EditorState,
  tablePos: number,
): { table: ProseMirrorNode; map: TableMap } | null {
  const table = state.doc.nodeAt(tablePos)
  if (!table || table.type.name !== 'table') return null

  return { table, map: TableMap.get(table) }
}

export type ResolvedCursorCell = {
  tablePos: number
  table: ProseMirrorNode
  map: TableMap
  rowIndex: number
  colIndex: number
  /** Position immediately before the cell node itself (not its content). */
  cellPos: number
}

/** Resolves the table/cell containing the current selection's `$from`, or
 * `null` if the selection isn't inside a table cell — used both by keyboard
 * shortcuts that act on "the row/column the cursor is currently in", and by
 * `moveRowAt`/`moveColumnAt` to re-locate the cursor's cell after rebuilding
 * the table around it. */
export function resolveCursorCell(
  state: EditorState,
): ResolvedCursorCell | null {
  const { $from } = state.selection

  let cellDepth = -1
  let tableDepth = -1
  for (let d = $from.depth; d > 0; d -= 1) {
    const node = $from.node(d)
    if (
      cellDepth === -1 &&
      (node.type.name === 'tableCell' || node.type.name === 'tableHeader')
    ) {
      cellDepth = d
    }
    if (node.type.name === 'table') {
      tableDepth = d
      break
    }
  }
  if (cellDepth === -1 || tableDepth === -1) return null

  const table = $from.node(tableDepth)
  const tablePos = $from.before(tableDepth)
  const cellPos = $from.before(cellDepth)
  const map = TableMap.get(table)
  const rect = map.findCell(cellPos - (tablePos + 1))

  return {
    tablePos,
    table,
    map,
    rowIndex: rect.top,
    colIndex: rect.left,
    cellPos,
  }
}

/** Maps an index through the same "remove at `from`, reinsert at `to`"
 * splice `moveRowAt`/`moveColumnAt` apply to the table's rows/columns — used
 * to follow the cursor's row/column to wherever it ends up after the move. */
function reindexAfterMove(index: number, from: number, to: number): number {
  if (index === from) return to
  const shifted = index < from ? index : index - 1
  return shifted >= to ? shifted + 1 : shifted
}

/** Replaces the whole table node with `children` as its new rows, in a
 * single dispatch — used by the move commands, which reorder by rebuilding
 * the table rather than patching individual cell positions.
 *
 * A wholesale `replaceWith` of the table gives ProseMirror nothing to map an
 * old in-table selection onto, so it collapses to just outside the table.
 * `preserveCursor`, when given, re-locates that cell (by its post-move row/
 * col) in the rebuilt table and restores the cursor there, at the same
 * offset within the cell's text it had before.
 */
function replaceTableRows(
  state: EditorState,
  dispatch: (tr: Transaction) => void,
  tablePos: number,
  table: ProseMirrorNode,
  children: ProseMirrorNode[],
  preserveCursor?: { row: number; col: number; offset: number } | null,
) {
  const newTable = table.copy(Fragment.fromArray(children))
  const tr = state.tr.replaceWith(tablePos, tablePos + table.nodeSize, newTable)

  if (preserveCursor) {
    const map = TableMap.get(newTable)
    if (preserveCursor.row < map.height && preserveCursor.col < map.width) {
      const cellRelPos = map.positionAt(
        preserveCursor.row,
        preserveCursor.col,
        newTable,
      )
      const cell = newTable.nodeAt(cellRelPos)!
      const contentSize = cell.firstChild?.content.size ?? 0
      const contentStart = tablePos + 1 + cellRelPos + 2
      const offset = Math.min(Math.max(preserveCursor.offset, 0), contentSize)
      tr.setSelection(TextSelection.near(tr.doc.resolve(contentStart + offset)))
    }
  }

  dispatch(tr)
}

/** Resolves the current cursor's cell in `table` at `tablePos`, for commands
 * that need to restore the cursor after rebuilding the table around it. */
function resolveCursorForMove(state: EditorState, tablePos: number) {
  const cursor = resolveCursorCell(state)
  if (!cursor || cursor.tablePos !== tablePos) return null
  return {
    row: cursor.rowIndex,
    col: cursor.colIndex,
    offset: state.selection.$from.pos - (cursor.cellPos + 2),
  }
}

/**
 * Inserts a new body row at `row` (existing rows at and after that index
 * shift down). Row 0 is always the header row — never a valid insertion
 * point, since a new row there would displace it.
 */
export function insertRowAt(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  tablePos: number,
  row: number,
): boolean {
  const resolved = resolveTable(state, tablePos)
  if (!resolved) return false

  const { table, map } = resolved
  if (row < 1 || row > map.height) return false

  if (dispatch) {
    const tableStart = tablePos + 1
    const { schema } = state
    const cells = Array.from(
      { length: map.width },
      () => schema.nodes.tableCell.createAndFill()!,
    )
    const newRow = schema.nodes.tableRow.create(null, cells)

    let rowPos = tableStart
    for (let i = 0; i < row; i += 1) {
      rowPos += table.child(i).nodeSize
    }

    dispatch(state.tr.insert(rowPos, newRow))
  }

  return true
}

/**
 * Inserts a new column at `col` (existing columns at and after that index
 * shift right). The new cell in row 0 is a header cell, matching every
 * other cell in that row; every other row gets a body cell.
 */
export function insertColumnAt(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  tablePos: number,
  col: number,
): boolean {
  const resolved = resolveTable(state, tablePos)
  if (!resolved) return false

  const { table, map } = resolved
  if (col < 0 || col > map.width) return false

  if (dispatch) {
    const tableStart = tablePos + 1
    const { schema } = state
    const tr = state.tr

    for (let row = 0; row < map.height; row += 1) {
      const cellType =
        row === 0 ? schema.nodes.tableHeader : schema.nodes.tableCell
      const pos = map.positionAt(row, col, table)
      tr.insert(tr.mapping.map(tableStart + pos), cellType.createAndFill()!)
    }

    dispatch(tr)
  }

  return true
}

/**
 * Deletes the body row at `row`. Row 0 is the header row and can never be
 * deleted; the last remaining body row can't be deleted either, since a
 * table always needs at least one.
 */
export function deleteRowAt(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  tablePos: number,
  row: number,
): boolean {
  const resolved = resolveTable(state, tablePos)
  if (!resolved) return false

  const { table, map } = resolved
  if (row < 1 || row >= map.height || map.height <= 2) return false

  if (dispatch) {
    const tableStart = tablePos + 1
    let rowPos = tableStart
    for (let i = 0; i < row; i += 1) {
      rowPos += table.child(i).nodeSize
    }

    dispatch(state.tr.delete(rowPos, rowPos + table.child(row).nodeSize))
  }

  return true
}

/**
 * Deletes the column at `col`. The last remaining column can't be deleted,
 * since a table always needs at least one.
 */
export function deleteColumnAt(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  tablePos: number,
  col: number,
): boolean {
  const resolved = resolveTable(state, tablePos)
  if (!resolved) return false

  const { table, map } = resolved
  if (col < 0 || col >= map.width || map.width <= 1) return false

  if (dispatch) {
    const tableStart = tablePos + 1
    const tr = state.tr

    for (let row = 0; row < map.height; row += 1) {
      const pos = map.positionAt(row, col, table)
      const cell = table.nodeAt(pos)!
      const from = tr.mapping.map(tableStart + pos)
      const to = tr.mapping.map(tableStart + pos + cell.nodeSize)
      tr.delete(from, to)
    }

    dispatch(tr)
  }

  return true
}

/**
 * Duplicates the row at `row`, inserting the copy immediately after it.
 * Duplicating the header row (row 0) is the one special case: the copy
 * lands as a normal body row (tableCell-typed) at index 1, since exactly
 * one Header Row is an invariant of the table model.
 */
export function duplicateRowAt(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  tablePos: number,
  row: number,
): boolean {
  const resolved = resolveTable(state, tablePos)
  if (!resolved) return false

  const { table, map } = resolved
  if (row < 0 || row >= map.height) return false

  if (dispatch) {
    const tableStart = tablePos + 1
    const { schema } = state
    const sourceRow = table.child(row)
    const isHeaderRow = row === 0

    let newRow
    if (isHeaderRow) {
      const cells: ProseMirrorNode[] = []
      sourceRow.forEach((cell) => {
        cells.push(schema.nodes.tableCell.create(cell.attrs, cell.content))
      })
      newRow = schema.nodes.tableRow.create(null, cells)
    } else {
      newRow = sourceRow.copy(sourceRow.content)
    }

    const insertIndex = isHeaderRow ? 1 : row + 1
    let rowPos = tableStart
    for (let i = 0; i < insertIndex; i += 1) {
      rowPos += table.child(i).nodeSize
    }

    dispatch(state.tr.insert(rowPos, newRow))
  }

  return true
}

/**
 * Duplicates the column at `col`, inserting the copy immediately after it
 * with the same content and attributes (including the header cell's type
 * in row 0).
 */
export function duplicateColumnAt(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  tablePos: number,
  col: number,
): boolean {
  const resolved = resolveTable(state, tablePos)
  if (!resolved) return false

  const { table, map } = resolved
  if (col < 0 || col >= map.width) return false

  if (dispatch) {
    const tableStart = tablePos + 1
    const tr = state.tr

    for (let row = 0; row < map.height; row += 1) {
      const cellPos = map.positionAt(row, col, table)
      const cell = table.nodeAt(cellPos)!
      const insertPos = map.positionAt(row, col + 1, table)
      tr.insert(tr.mapping.map(tableStart + insertPos), cell.copy(cell.content))
    }

    dispatch(tr)
  }

  return true
}

/** Empties a cell's single paragraph of its inline content, leaving the
 * paragraph (and the cell's own type/attrs, e.g. `align`) in place. */
function clearCellAt(tr: Transaction, cellPos: number) {
  const cell = tr.doc.nodeAt(cellPos)
  if (!cell) return

  const paragraph = cell.firstChild
  if (!paragraph || paragraph.content.size === 0) return

  const from = cellPos + 2
  tr.delete(from, from + paragraph.content.size)
}

/** Empties every cell in the row at `row` (header row included), leaving the
 * row itself, its cell count, and every cell's `align` attribute in place. */
export function clearRowAt(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  tablePos: number,
  row: number,
): boolean {
  const resolved = resolveTable(state, tablePos)
  if (!resolved) return false

  const { table, map } = resolved
  if (row < 0 || row >= map.height) return false

  if (dispatch) {
    const tableStart = tablePos + 1
    const tr = state.tr

    for (let col = 0; col < map.width; col += 1) {
      const pos = map.positionAt(row, col, table)
      clearCellAt(tr, tr.mapping.map(tableStart + pos))
    }

    dispatch(tr)
  }

  return true
}

/** Empties every cell in the column at `col` (header cell included), leaving
 * the column itself and every cell's `align` attribute in place. */
export function clearColumnAt(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  tablePos: number,
  col: number,
): boolean {
  const resolved = resolveTable(state, tablePos)
  if (!resolved) return false

  const { table, map } = resolved
  if (col < 0 || col >= map.width) return false

  if (dispatch) {
    const tableStart = tablePos + 1
    const tr = state.tr

    for (let row = 0; row < map.height; row += 1) {
      const pos = map.positionAt(row, col, table)
      clearCellAt(tr, tr.mapping.map(tableStart + pos))
    }

    dispatch(tr)
  }

  return true
}

export type SortDirection = 'asc' | 'desc'

/**
 * Reorders all body rows by the text content of their cell in column `col`
 * (case-insensitive locale comparison); the header row stays fixed at index
 * 0. A row with an empty cell in that column always sorts last, regardless
 * of direction.
 */
export function sortRowsByColumn(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  tablePos: number,
  col: number,
  direction: SortDirection,
): boolean {
  const resolved = resolveTable(state, tablePos)
  if (!resolved) return false

  const { table, map } = resolved
  if (col < 0 || col >= map.width) return false

  if (dispatch) {
    const headerRow = table.child(0)
    const bodyRows: ProseMirrorNode[] = []
    for (let row = 1; row < map.height; row += 1) {
      bodyRows.push(table.child(row))
    }

    const textAt = (row: ProseMirrorNode) => row.child(col).textContent

    const sorted = [...bodyRows].sort((a, b) => {
      const aText = textAt(a)
      const bText = textAt(b)
      const aEmpty = aText.length === 0
      const bEmpty = bText.length === 0

      if (aEmpty && bEmpty) return 0
      if (aEmpty) return 1
      if (bEmpty) return -1

      const comparison = aText.localeCompare(bText, undefined, {
        sensitivity: 'accent',
      })
      return direction === 'asc' ? comparison : -comparison
    })

    replaceTableRows(state, dispatch, tablePos, table, [headerRow, ...sorted])
  }

  return true
}

/**
 * Moves the body row at `from` to index `to`. Row 0 is the header row and
 * is never a valid `from` or `to` index — it stays fixed at row 0.
 */
export function moveRowAt(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  tablePos: number,
  from: number,
  to: number,
): boolean {
  const resolved = resolveTable(state, tablePos)
  if (!resolved) return false

  const { table, map } = resolved
  if (from < 1 || from >= map.height) return false
  if (to < 1 || to >= map.height) return false
  if (from === to) return false

  if (dispatch) {
    const rows: ProseMirrorNode[] = []
    table.forEach((row) => rows.push(row))

    const [moved] = rows.splice(from, 1)
    rows.splice(to, 0, moved)

    const cursor = resolveCursorForMove(state, tablePos)
    const preserveCursor = cursor && {
      ...cursor,
      row: reindexAfterMove(cursor.row, from, to),
    }

    replaceTableRows(state, dispatch, tablePos, table, rows, preserveCursor)
  }

  return true
}

/**
 * Moves the column at `from` to index `to`, keeping each row's cell for that
 * column together (so header/body cell typing per row is preserved).
 */
export function moveColumnAt(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  tablePos: number,
  from: number,
  to: number,
): boolean {
  const resolved = resolveTable(state, tablePos)
  if (!resolved) return false

  const { table, map } = resolved
  if (from < 0 || from >= map.width) return false
  if (to < 0 || to >= map.width) return false
  if (from === to) return false

  if (dispatch) {
    const newRows: ProseMirrorNode[] = []
    for (let row = 0; row < map.height; row += 1) {
      const rowNode = table.child(row)
      const cells: ProseMirrorNode[] = []
      for (let col = 0; col < map.width; col += 1) {
        cells.push(table.nodeAt(map.positionAt(row, col, table))!)
      }

      const [moved] = cells.splice(from, 1)
      cells.splice(to, 0, moved)
      newRows.push(rowNode.copy(Fragment.fromArray(cells)))
    }

    const cursor = resolveCursorForMove(state, tablePos)
    const preserveCursor = cursor && {
      ...cursor,
      col: reindexAfterMove(cursor.col, from, to),
    }

    replaceTableRows(state, dispatch, tablePos, table, newRows, preserveCursor)
  }

  return true
}
