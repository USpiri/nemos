import { Button } from "@/components/ui/button/Button";
import { isInsideNode } from "@/utils/editor";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Plus } from "lucide-react";
import { useCallback } from "react";

export const TableNodeView = ({ getPos, editor, node }: NodeViewProps) => {
  const addColumn = useCallback(() => {
    editor
      .chain()
      .focus(getPos() + node.nodeSize)
      .addColumnAfter()
      .goToNextCell()
      .run();
  }, [editor, getPos, node.nodeSize]);
  const addRow = useCallback(() => {
    editor
      .chain()
      .focus(getPos() + node.nodeSize - 1)
      .addRowAfter()
      .focus(getPos() + node.nodeSize - 1)
      .fixTables()
      .run();
  }, [editor, getPos, node.nodeSize]);

  return (
    <NodeViewWrapper className="relative">
      <NodeViewContent as="table" />
      {isInsideNode(
        editor.state.selection.from,
        editor.state.selection.to,
        getPos(),
        node.nodeSize,
      ) &&
        editor.isEditable && (
          <>
            <Button
              onClick={() => addRow()}
              className="absolute top-full z-10 mt-1 flex w-full justify-center p-0.5 text-foreground-faint"
              tabIndex={-1}
            >
              <Plus className="size-4" />
            </Button>
            <Button
              onClick={() => addColumn()}
              className="absolute bottom-0 left-full top-0 z-0 ml-1 p-0.5 text-foreground-faint"
              tabIndex={-1}
            >
              <Plus className="size-4" />
            </Button>
          </>
        )}
    </NodeViewWrapper>
  );
};
