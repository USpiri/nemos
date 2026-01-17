import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { Plus } from 'lucide-react'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { isInsideNode } from '@/lib/editor/utils'

// TODO: Reimplement this
export const TableNodeView = ({ getPos, editor, node }: NodeViewProps) => {
  const addColumn = useCallback(() => {
    editor
      .chain()
      .focus((getPos() ?? 0) + node.nodeSize)
      .addColumnAfter()
      .goToNextCell()
      .run()
  }, [editor, getPos, node.nodeSize])
  const addRow = useCallback(() => {
    editor
      .chain()
      .focus(getPos() ?? 0 + node.nodeSize - 1)
      .addRowAfter()
      .fixTables()
      .focus(getPos() ?? 0 + node.nodeSize - 1)
      .run()
  }, [editor, getPos, node.nodeSize])

  return (
    <NodeViewWrapper className="relative">
      <NodeViewContent />
      {isInsideNode(
        editor.state.selection.from,
        editor.state.selection.to,
        getPos() ?? 0,
        node.nodeSize,
      ) &&
        editor.isEditable && (
          <>
            <Button
              onClick={() => addRow()}
              className="text-foreground-faint absolute top-full z-10 mt-1 flex w-full justify-center p-0.5"
              tabIndex={-1}
            >
              <Plus className="size-4" />
            </Button>
            <Button
              onClick={() => addColumn()}
              className="text-foreground-faint absolute top-0 bottom-0 left-full z-0 ml-1 p-0.5"
              tabIndex={-1}
            >
              <Plus className="size-4" />
            </Button>
          </>
        )}
    </NodeViewWrapper>
  )
}
