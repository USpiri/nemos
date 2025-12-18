import { CopyButton } from "@/components/ui/copy-button";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useCallback } from "react";
import { LanguageSelector } from "./LanguageSelector";

export const CodeBlock = ({ node, updateAttributes }: NodeViewProps) => {
  const handleLanguageChange = useCallback(
    (value: string) => {
      updateAttributes({ language: value });
    },
    [updateAttributes],
  );

  return (
    <NodeViewWrapper>
      <div className="codeblock relative">
        <pre>
          <code className={`language-${node.attrs.language}`}>
            <NodeViewContent />
          </code>
        </pre>
        <div className="absolute right-2 bottom-2 flex flex-row items-center gap-2">
          <CopyButton content={node.textContent} variant="ghost" />
          <LanguageSelector
            value={node.attrs.language}
            onChange={handleLanguageChange}
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
};
