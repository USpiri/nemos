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
    const cells = Array.from({ length: map.width }, () => schema.nodes.tableCell.createAndFill()!)
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
      const cellType = row === 0 ? schema.nodes.tableHeader : schema.nodes.tableCell
      const pos = map.positionAt(row, col, table)
      tr.insert(tr.mapping.map(tableStart + pos), cellType.createAndFill()!)
    }

    dispatch(tr)
  }

  return true
}
