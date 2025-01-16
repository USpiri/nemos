import cn from "@/utils/cn";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import mermaid, { RenderResult } from "mermaid";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import "./mermaid.css";

// TODO:
// - implement haskell syntax higlight

mermaid.initialize({
  startOnLoad: false,
  suppressErrorRendering: true,
  theme: "base",
  securityLevel: "loose",
});

const isSelected = (from: number, to: number, pos: any, nodeSize: number) =>
  from > pos && to < pos + nodeSize + 1;

const hiddenStyle = {
  opacity: 0,
  overflow: "hidden",
  position: "absolute",
  width: "0px",
  height: "0px",
} as CSSProperties;

export const Mermaid = ({ node, getPos, editor }: NodeViewProps) => {
  const [render_result, setRenderResult] = useState<RenderResult>();
  const [element, setElement] = useState<HTMLDivElement>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = `mermaid_${uuid().replace(/-/g, "")}`;

  useEffect(() => {
    if (!node.textContent.trim() && node.textContent.trim().length === 0)
      return;
    mermaid
      .render(id, node.textContent, element)
      .then((result) => {
        setError(null);
        if (render_result?.svg !== result.svg) {
          setRenderResult(result);
        }
      })
      .catch((e) => {
        console.log(e);
        setError(`Error rendering diagram:\n${e}`);
      })
      .finally(() => setLoading(false));
  }, [node.textContent.trim()]);

  useEffect(() => {
    if (!element) return;
    if (!render_result) return;
    element.innerHTML = render_result.svg;
    render_result.bindFunctions?.(element);
  }, [element, render_result]);

  const updateDiagramRef = useCallback((elem: HTMLDivElement) => {
    if (!elem) return;
    setElement(elem);
  }, []);

  return (
    <NodeViewWrapper className="mermaid">
      <pre
        style={
          !isSelected(
            editor.state.selection.from,
            editor.state.selection.to,
            getPos(),
            node.nodeSize,
          )
            ? hiddenStyle
            : undefined
        }
      >
        <NodeViewContent className="mermaid-source" as="code" />
      </pre>
      <div
        className={cn(
          "mermaid-render transition-all",
          error && "h-0 opacity-0",
        )}
        contentEditable={false}
        ref={updateDiagramRef}
      />
      {error && !loading && (
        <pre
          className="not-prose text-sm text-rose-600"
          contentEditable={false}
        >
          {error}
        </pre>
      )}
      {loading && node.textContent.trim().length !== 0 && (
        <div contentEditable={false}>Loading...</div>
      )}
      {!node.textContent.trim().length && (
        <div contentEditable={false}>Empty diagram</div>
      )}
    </NodeViewWrapper>
  );
};
