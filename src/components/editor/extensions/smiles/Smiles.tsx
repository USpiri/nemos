import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { isInsideNode, hiddenStyle } from "@/utils/editor";
import { useEffect } from "react";
import { v4 as uuid } from "uuid";
import { draw } from "@/utils/smiles";

export const Smiles = ({ node, getPos, editor }: NodeViewProps) => {
  const id = `smiles_${uuid().replace(/-/g, "")}`;

  useEffect(() => {
    draw(node.textContent.trim(), id);
  }, [node.textContent.trim()]);

  return (
    <NodeViewWrapper className="smiles">
      <pre
        style={
          !isInsideNode(
            editor.state.selection.from,
            editor.state.selection.to,
            getPos(),
            node.nodeSize,
          )
            ? hiddenStyle
            : undefined
        }
      >
        <NodeViewContent className="smiles-source language-smiles" as="code" />
      </pre>
      <div
        className="smiles-render select-none transition-all"
        contentEditable={false}
      >
        <svg id={id} className="mx-auto max-w-sm" />
      </div>
    </NodeViewWrapper>
  );
};
