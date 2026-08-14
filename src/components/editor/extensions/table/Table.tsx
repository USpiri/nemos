import { TableMap } from '@tiptap/pm/tables'
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { Plus } from 'lucide-react'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TABLE_HANDLE_OVERLAY_CLASS } from './handle-plugin'
import { useTableHandleState } from './use-table-handle-state'

export default function TableNodeView({ editor, getPos }: NodeViewProps) {
  const tablePos = getPos()
  const handleState = useTableHandleState(editor)
  const isThisTableHovered =
    handleState !== null && handleState.tablePos === tablePos
  const showAddRow =
    isThisTableHovered && handleState.rowIndex === handleState.rowCount - 1
  const showAddColumn =
    isThisTableHovered && handleState.colIndex === handleState.colCount - 1

  // `addColumnAfter`/`addRowAfter` insert relative to the current selection,
  // not this table's own end — if the cursor is anywhere but the last row/
  // column when these are clicked, the new one lands there instead of at
  // the end. `insertRow`/`insertColumn` take an explicit index, so this
  // always targets the true end of this specific table.
  const addColumn = useCallback(() => {
    const pos = getPos()
    if (pos === undefined) return
    const table = editor.state.doc.nodeAt(pos)
    if (!table) return
    const map = TableMap.get(table)
    editor.chain().focus().insertColumn(pos, map.width).run()
  }, [editor, getPos])

  const addRow = useCallback(() => {
    const pos = getPos()
    if (pos === undefined) return
    const table = editor.state.doc.nodeAt(pos)
    if (!table) return
    const map = TableMap.get(table)
    editor.chain().focus().insertRow(pos, map.height).run()
  }, [editor, getPos])

  return (
    <NodeViewWrapper className="table-wrapper">
      <NodeViewContent />
      {showAddRow && (
        <Button
          onClick={addRow}
          variant="ghost"
          size="icon-xs"
          className={cn(
            TABLE_HANDLE_OVERLAY_CLASS,
            'absolute bottom-0 z-10 w-full translate-y-full text-muted-foreground',
          )}
          tabIndex={-1}
        >
          <Plus className="size-3" />
        </Button>
      )}
      {showAddColumn && (
        <Button
          onClick={addColumn}
          variant="ghost"
          size="icon-xs"
          className={cn(
            TABLE_HANDLE_OVERLAY_CLASS,
            'absolute top-0 left-full z-10 h-full text-muted-foreground',
          )}
          tabIndex={-1}
        >
          <Plus className="size-3" />
        </Button>
      )}
    </NodeViewWrapper>
  )
}
