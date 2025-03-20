import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { isInsideNode, hiddenStyle } from "@/utils/editor";
import { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import { draw } from "@/utils/smiles";

export const Smiles = ({ node, getPos, editor }: NodeViewProps) => {
  const elementRef = useRef<SVGSVGElement>(null);
  const id = `smiles_${uuid().replace(/-/g, "")}`;

  useEffect(() => {
    if (!elementRef.current) return;
    draw(node.textContent.trim(), elementRef.current);
  }, [node.textContent]);

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
        className="smiles-render transition-all select-none"
        contentEditable={false}
      >
        <svg id={id} ref={elementRef} className="mx-auto max-w-sm" />
      </div>
    </NodeViewWrapper>
  );
};
