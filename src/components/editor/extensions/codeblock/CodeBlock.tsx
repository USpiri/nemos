import { CopyButton } from "@/components/ui/copy-button";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";

export const CodeBlock = ({ node }: NodeViewProps) => {
  return (
    <NodeViewWrapper>
      <div className="codeblock relative">
        <pre>
          <code className={`language-${node.attrs.language}`}>
            <NodeViewContent />
          </code>
        </pre>
        <CopyButton
          content={node.textContent}
          className="absolute right-2 bottom-2"
          variant="ghost"
        />
      </div>
    </NodeViewWrapper>
  );
};
