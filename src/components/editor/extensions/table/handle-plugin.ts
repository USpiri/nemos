import type { Editor } from '@tiptap/core'
import {
  Plugin,
  PluginKey,
  type PluginView,
  TextSelection,
} from '@tiptap/pm/state'
import { CellSelection, TableMap } from '@tiptap/pm/tables'
import type { EditorView } from '@tiptap/pm/view'

/** Present only while a Row/Column Handle drag is in progress, so the React
 * layer can render drag-specific chrome (a drop-target indicator) that a
 * plain hover never needs. */
export type TableDragInfo = {
  orientation: 'row' | 'col'
  fromIndex: number
}

type ResolvedCell = {
  tablePos: number
  rowIndex: number
  colIndex: number
  isHeaderRow: boolean
  rowCount: number
  colCount: number
  tableRect: DOMRect
  cellRect: DOMRect
}

export type TableHandleState =
  | (ResolvedCell & { drag: TableDragInfo | null })
  | null

/**
 * CSS marker applied to the row/column handle buttons and their menus, so
 * the plugin can tell "mouse left the table, but only to reach the handle
 * rendered outside it" apart from "mouse actually left the table".
 */
export const TABLE_HANDLE_OVERLAY_CLASS = 'table-handle-overlay'

/** Grace period before hiding, so moving the pointer from a cell to its
 * (out-of-table) handle doesn't hide the handle before it can be reached. */
const HIDE_DELAY_MS = 150

export const tableHandlePluginKey = new PluginKey('tableHandle')

function findCellElement(target: Element): HTMLTableCellElement | null {
  const cell = target.closest('td, th')
  return cell instanceof HTMLTableCellElement ? cell : null
}

/** The single live plugin view, so `setTableHandleFrozen` (called from the
 * React menu, outside the plugin) can reach it without going through PM
 * transaction state. */
let activeView: TableHandleView | null = null

export function setTableHandleFrozen(frozen: boolean) {
  activeView?.setFrozen(frozen)
}

/** Starts tracking a native HTML5 drag of the row/column handle at `index`,
 * so a subsequent drop over another row/column reorders it there. */
export function beginTableDrag(
  orientation: 'row' | 'col',
  tablePos: number,
  index: number,
) {
  activeView?.beginDrag(orientation, tablePos, index)
}

/** Clears drag-tracking state once the native drag ends, dropped or not. */
export function endTableDrag() {
  activeView?.endDrag()
}

class TableHandleView implements PluginView {
  private frozen = false
  private hideTimer: number | undefined
  private lastState: TableHandleState = null
  private drag: {
    orientation: 'row' | 'col'
    tablePos: number
    fromIndex: number
  } | null = null

  constructor(
    private readonly editor: Editor,
    private readonly view: EditorView,
    private readonly emit: (state: TableHandleState) => void,
  ) {
    window.addEventListener('mousemove', this.handleMouseMove)
    // Listened on `document` (not `view.dom`) and hit-tested by cursor
    // coordinates (not `event.target`) so this doesn't depend on the drag
    // event's target resolving cleanly through the editor's DOM subtree.
    document.addEventListener('dragover', this.handleDragOver)
    document.addEventListener('drop', this.handleDrop)
  }

  setFrozen(frozen: boolean) {
    this.frozen = frozen
  }

  beginDrag(orientation: 'row' | 'col', tablePos: number, index: number) {
    this.drag = { orientation, tablePos, fromIndex: index }
    // Highlights the whole row/column being dragged, mirroring how opening
    // the handle menu already selects it — visual confirmation of what's
    // about to move, not just a bare cursor-follow.
    this.selectDragSource(orientation, tablePos, index)
  }

  endDrag() {
    const tablePos = this.drag?.tablePos
    this.drag = null
    if (tablePos !== undefined) this.clearDragSourceSelection(tablePos)
    // Nothing else re-emits after this — a plain hover only fires on the
    // next `mousemove`, which may be a while after the pointer stops — so
    // without this, the floating handles and drop-target line from the last
    // `dragover` stay stuck on screen (at now-stale positions) once the drag
    // ends, whether it dropped successfully or was cancelled.
    this.emitState(null)
  }

  private handleDragOver = (event: DragEvent) => {
    if (!this.drag) return

    event.preventDefault()
    event.stopPropagation()

    const cell = this.cellFromPoint(event.clientX, event.clientY)
    if (!cell) return

    const resolved = this.resolveCell(cell)
    // The header row is fixed at row 0 — dropping a dragged row onto it is
    // never valid, so it gets no-drop cursor feedback and the handle stays
    // put rather than jumping there, instead of only rejecting the move
    // silently once dropped.
    const invalidRowDrop =
      this.drag.orientation === 'row' && resolved?.isHeaderRow === true

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = invalidRowDrop ? 'none' : 'move'
    }
    if (invalidRowDrop) return

    this.cancelHide()
    this.emitState(
      resolved && {
        ...resolved,
        drag: {
          orientation: this.drag.orientation,
          fromIndex: this.drag.fromIndex,
        },
      },
    )
  }

  private handleDrop = (event: DragEvent) => {
    // Cleanup (clearing `this.drag`, the drag-source selection) happens in
    // `endDrag()`, driven by the native `dragend` that always follows this
    // event — not here, so it runs uniformly whether the drop lands on a
    // valid target or the drag gets cancelled instead.
    if (!this.drag) return
    event.preventDefault()
    event.stopPropagation()

    const { orientation, tablePos, fromIndex } = this.drag
    const target = this.lastState

    if (!target || target.tablePos !== tablePos) return

    const toIndex = orientation === 'row' ? target.rowIndex : target.colIndex
    if (orientation === 'row') {
      this.editor.commands.moveRow(tablePos, fromIndex, toIndex)
    } else {
      this.editor.commands.moveColumn(tablePos, fromIndex, toIndex)
    }
  }

  private handleMouseMove = (event: MouseEvent) => {
    if (this.frozen) return

    const target = event.target
    if (!(target instanceof Element)) return
    if (target.closest(`.${TABLE_HANDLE_OVERLAY_CLASS}`)) {
      // Hovering the handle/menu itself must cancel any hide already queued
      // from the brief moment the pointer crossed the gap to reach it —
      // otherwise that stale timer still fires and hides the handle out
      // from under a pointer that's actively sitting on it.
      this.cancelHide()
      return
    }

    if (!this.view.dom.contains(target)) {
      this.scheduleHide()
      return
    }

    const cell = findCellElement(target)
    if (!cell) {
      this.scheduleHide()
      return
    }

    this.show(cell)
  }

  /** Hit-tests by cursor coordinates rather than `event.target` — during a
   * native drag, the event's own target can resolve inconsistently (e.g.
   * once the floating handle repositions under the cursor to track the
   * hovered cell), so this mirrors elementsFromPoint-based resolution
   * instead of trusting the event's target chain. */
  private cellFromPoint(x: number, y: number): HTMLTableCellElement | null {
    for (const element of document.elementsFromPoint(x, y)) {
      if (element.closest(`.${TABLE_HANDLE_OVERLAY_CLASS}`)) continue
      const cell = findCellElement(element)
      if (cell) return cell
    }
    return null
  }

  private selectDragSource(
    orientation: 'row' | 'col',
    tablePos: number,
    index: number,
  ) {
    const table = this.view.state.doc.nodeAt(tablePos)
    if (!table || table.type.name !== 'table') return

    const map = TableMap.get(table)
    const tableStart = tablePos + 1
    const [fromOffset, toOffset] =
      orientation === 'row'
        ? [
            map.positionAt(index, 0, table),
            map.positionAt(index, map.width - 1, table),
          ]
        : [
            map.positionAt(0, index, table),
            map.positionAt(map.height - 1, index, table),
          ]

    const { doc } = this.view.state
    const $from = doc.resolve(tableStart + fromOffset)
    const $to = doc.resolve(tableStart + toOffset)
    const selection =
      orientation === 'row'
        ? CellSelection.rowSelection($from, $to)
        : CellSelection.colSelection($from, $to)

    this.view.dispatch(this.view.state.tr.setSelection(selection))
  }

  private clearDragSourceSelection(tablePos: number) {
    const { state } = this.view
    if (!(state.selection instanceof CellSelection)) return

    const $pos = state.doc.resolve(
      Math.min(tablePos + 1, state.doc.content.size),
    )
    this.view.dispatch(state.tr.setSelection(TextSelection.near($pos)))
  }

  private scheduleHide() {
    if (this.hideTimer !== undefined) return
    this.hideTimer = window.setTimeout(() => {
      this.hideTimer = undefined
      if (this.frozen) return
      this.emitState(null)
    }, HIDE_DELAY_MS)
  }

  private cancelHide() {
    if (this.hideTimer === undefined) return
    window.clearTimeout(this.hideTimer)
    this.hideTimer = undefined
  }

  private show(cell: HTMLTableCellElement) {
    this.cancelHide()

    if (!this.editor.isEditable) {
      this.emitState(null)
      return
    }

    const resolved = this.resolveCell(cell)
    this.emitState(resolved && { ...resolved, drag: null })
  }

  /** Records the latest resolved cell alongside emitting it, so a drop
   * handler (which fires from a native `drop` event, not a PM transaction)
   * can read the last-hovered row/column as its target. */
  private emitState(state: TableHandleState) {
    this.lastState = state
    this.emit(state)
  }

  private resolveCell(cell: HTMLTableCellElement): ResolvedCell | null {
    let pos: number
    try {
      pos = this.view.posAtDOM(cell, 0)
    } catch {
      return null
    }

    const $pos = this.view.state.doc.resolve(pos)
    let cellDepth = -1
    let tableDepth = -1
    for (let d = $pos.depth; d > 0; d -= 1) {
      const node = $pos.node(d)
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

    const tableNode = $pos.node(tableDepth)
    const tablePos = $pos.before(tableDepth)
    const cellPos = $pos.before(cellDepth)
    const map = TableMap.get(tableNode)
    const rect = map.findCell(cellPos - (tablePos + 1))

    const tableDOM = this.view.nodeDOM(tablePos)
    const tableElement =
      tableDOM instanceof HTMLElement
        ? (tableDOM.querySelector('table') ?? tableDOM)
        : null
    if (!tableElement) return null

    return {
      tablePos,
      rowIndex: rect.top,
      colIndex: rect.left,
      isHeaderRow: rect.top === 0,
      rowCount: map.height,
      colCount: map.width,
      tableRect: tableElement.getBoundingClientRect(),
      cellRect: cell.getBoundingClientRect(),
    }
  }

  destroy() {
    window.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('dragover', this.handleDragOver)
    document.removeEventListener('drop', this.handleDrop)
    this.cancelHide()
    if (activeView === this) activeView = null
  }
}

export function createTableHandlePlugin(
  editor: Editor,
  emit: (state: TableHandleState) => void,
) {
  return new Plugin({
    key: tableHandlePluginKey,
    view: (view) => {
      activeView = new TableHandleView(editor, view, emit)
      return activeView
    },
  })
}
