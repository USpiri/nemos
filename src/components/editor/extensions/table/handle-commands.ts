import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import type { EditorState, Transaction } from '@tiptap/pm/state'
import { TableMap } from '@tiptap/pm/tables'

function resolveTable(
  state: EditorState,
  tablePos: number,
): { table: ProseMirrorNode; map: TableMap } | null {
  const table = state.doc.nodeAt(tablePos)
  if (!table || table.type.name !== 'table') return null

  return { table, map: TableMap.get(table) }
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
