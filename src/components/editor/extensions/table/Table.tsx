import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { Plus } from 'lucide-react'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { isInsideNode } from '@/lib/editor/utils'

export default function TableNodeView({ node, editor, getPos }: NodeViewProps) {
  const addColumn = useCallback(
    () => editor.chain().focus().addColumnAfter().run(),
    [editor],
  )
  const addRow = useCallback(
    () => editor.chain().focus().addRowAfter().run(),
    [editor],
  )

  return (
    <NodeViewWrapper className="tableWrapper">
      <NodeViewContent />
      {isInsideNode(
        editor.state.selection.from,
        editor.state.selection.to,
        getPos() ?? 0,
        node.nodeSize,
      ) && (
        <>
          <Button
            onClick={addRow}
            variant="ghost"
            size="icon-xs"
            className="absolute bottom-0 z-10 w-full translate-y-full"
            tabIndex={-1}
          >
            <Plus className="size-4" />
          </Button>
          <Button
            onClick={addColumn}
            variant="ghost"
            size="icon-xs"
            className="absolute top-0 left-full z-10 h-full"
            tabIndex={-1}
          >
            <Plus className="size-4" />
          </Button>
        </>
      )}
    </NodeViewWrapper>
  )
}
