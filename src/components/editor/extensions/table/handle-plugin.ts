import type { Editor } from '@tiptap/core'
import { Plugin, PluginKey, type PluginView } from '@tiptap/pm/state'
import { TableMap } from '@tiptap/pm/tables'
import type { EditorView } from '@tiptap/pm/view'

export type TableHandleState = {
  tablePos: number
  rowIndex: number
  colIndex: number
  isHeaderRow: boolean
  tableRect: DOMRect
  cellRect: DOMRect
} | null

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

class TableHandleView implements PluginView {
  private frozen = false
  private hideTimer: number | undefined

  constructor(
    private readonly editor: Editor,
    private readonly view: EditorView,
    private readonly emit: (state: TableHandleState) => void,
  ) {
    window.addEventListener('mousemove', this.handleMouseMove)
  }

  setFrozen(frozen: boolean) {
    this.frozen = frozen
  }

  private handleMouseMove = (event: MouseEvent) => {
    if (this.frozen) return

    const target = event.target
    if (!(target instanceof Element)) return
    if (target.closest(`.${TABLE_HANDLE_OVERLAY_CLASS}`)) return

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

  private scheduleHide() {
    if (this.hideTimer !== undefined) return
    this.hideTimer = window.setTimeout(() => {
      this.hideTimer = undefined
      if (this.frozen) return
      this.emit(null)
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
      this.emit(null)
      return
    }

    this.emit(this.resolveCell(cell))
  }

  private resolveCell(cell: HTMLTableCellElement): TableHandleState {
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
      tableRect: tableElement.getBoundingClientRect(),
      cellRect: cell.getBoundingClientRect(),
    }
  }

  destroy() {
    window.removeEventListener('mousemove', this.handleMouseMove)
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
    view: view => {
      activeView = new TableHandleView(editor, view, emit)
      return activeView
    },
  })
}
