import cn from "@/utils/cn";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { isInsideNode, hiddenStyle } from "@/utils/editor";
import { useEffect } from "react";
import { apply } from "@ibm-materials/ts-smiles-drawer";

const options = {
  explicitHydrogens: true,
  terminalCarbons: true,
  width: 500,
  height: 300,
};

// TODO:
//- inprove performance
// using parse() instead of apply() should be better

export const Smiles = ({ node, getPos, editor }: NodeViewProps) => {
  useEffect(() => {
    // prevents apply() to log into the console
    const originalLog = console.log;
    console.log = () => {};
    apply(options, undefined, "dark");
    console.log = originalLog;
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
        className={cn("smiles-render select-none transition-all")}
        contentEditable={false}
      >
        <canvas data-smiles={node.textContent.trim()} className="mx-auto" />
      </div>
    </NodeViewWrapper>
  );
};
