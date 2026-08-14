import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import type { EditorState, Transaction } from '@tiptap/pm/state'
import { isInTable, selectedRect, TableMap } from '@tiptap/pm/tables'

export type TableAlign = 'left' | 'center' | 'right' | null

/**
 * Stamps `align` onto every cell in column `col` (header included), so a
 * column's cells never disagree about alignment. Positions are re-resolved
 * through `tr.mapping` after each edit since `setNodeMarkup` shifts later
 * cells' positions within the same transaction.
 */
export function applyColumnAlign(
  tr: Transaction,
  map: TableMap,
  tableStart: number,
  table: ProseMirrorNode,
  col: number,
  align: TableAlign,
): Transaction {
  for (let row = 0; row < map.height; row += 1) {
    const pos = tr.mapping.map(tableStart + map.positionAt(row, col, table))
    const node = tr.doc.nodeAt(pos)

    if (node && node.attrs.align !== align) {
      tr.setNodeMarkup(pos, null, { ...node.attrs, align })
    }
  }

  return tr
}

/** Sets the alignment of the column containing the current cell selection. */
export function setColumnAlign(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  align: TableAlign,
) {
  if (!isInTable(state)) {
    return false
  }

  if (dispatch) {
    const rect = selectedRect(state)
    dispatch(
      applyColumnAlign(
        state.tr,
        rect.map,
        rect.tableStart,
        rect.table,
        rect.left,
        align,
      ),
    )
  }

  return true
}

/** Sets the alignment of column `col` in the table at `tablePos` — for
 * callers (e.g. the Column Handle menu) that know which column to align
 * without relying on where the current selection happens to be. */
export function setColumnAlignAt(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  tablePos: number,
  col: number,
  align: TableAlign,
): boolean {
  const table = state.doc.nodeAt(tablePos)
  if (!table || table.type.name !== 'table') return false

  const map = TableMap.get(table)
  if (col < 0 || col >= map.width) return false

  if (dispatch) {
    dispatch(applyColumnAlign(state.tr, map, tablePos + 1, table, col, align))
  }

  return true
}
