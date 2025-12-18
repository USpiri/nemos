import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import mermaid from "mermaid";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { hiddenStyle, isInsideNode } from "@/utils/editor";
import { LoaderCircle } from "lucide-react";

mermaid.initialize({
  startOnLoad: false,
  suppressErrorRendering: true,
  theme: "default",
  securityLevel: "loose",
});

export const Mermaid = ({ node, getPos, editor }: NodeViewProps) => {
  const renderRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const renderDiagram = useCallback(async () => {
    const source = node.textContent.trim();

    if (!source || !renderRef.current) {
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const id = `mermaid-${Math.random().toString(36).slice(2)}`;

      const { svg } = await mermaid.render(id, source);
      renderRef.current.innerHTML = svg;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to render diagram");
      renderRef.current.innerHTML = "";
    } finally {
      setLoading(false);
    }
  }, [node.textContent]);

  // Re-render on content change
  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  return (
    <NodeViewWrapper className="mermaid relative">
      <pre
        style={
          !isInsideNode(
            editor.state.selection.from,
            editor.state.selection.to,
            getPos() ?? 0,
            node.nodeSize,
          )
            ? hiddenStyle
            : undefined
        }
      >
        <NodeViewContent className="mermaid-source" />
      </pre>
      <div
        className={cn(
          "mermaid-render transition-all select-none",
          error && "h-0 opacity-0",
        )}
        contentEditable={false}
        ref={renderRef}
      />
      {error && !loading && (
        <pre className="mermaid-error" contentEditable={false}>
          {error}
        </pre>
      )}
      {loading && node.textContent.trim().length !== 0 && (
        <div className="mermaid-loading" contentEditable={false}>
          <LoaderCircle className="text-muted-foreground absolute top-2 right-2 size-4 animate-spin" />
        </div>
      )}
      {!node.textContent.trim().length && (
        <div className="mermaid-empty" contentEditable={false}>
          Empty diagram
        </div>
      )}
    </NodeViewWrapper>
  );
};
