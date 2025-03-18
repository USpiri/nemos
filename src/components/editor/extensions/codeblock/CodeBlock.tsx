import { Button } from "@/components/ui/button/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { supportedLanguages } from "@/config/code-languages";
import { isInsideNode } from "@/utils/editor";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export const CodeBlock = ({
  editor,
  node,
  getPos,
  updateAttributes,
}: NodeViewProps) => {
  const [copied, setCopied] = useState(false);
  const currentLanguage = supportedLanguages.find((l) =>
    l.match.includes(node.attrs.language),
  );

  const onChange = (value: string) => {
    updateAttributes({
      language: value,
    });
  };

  const onCopy = async () => {
    const text = node.textContent;
    if (!text && !copied) return;

    await navigator.clipboard.writeText(node.textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <NodeViewWrapper as="div" className="codeblock">
      <pre className="codeblock">
        <NodeViewContent
          className={`language-${node.attrs.language}`}
          as="code"
        />
      </pre>
      <div
        className="absolute right-2 bottom-2 flex flex-row items-center select-none print:hidden"
        contentEditable={false}
      >
        <Button
          className="text-foreground-faint hover:text-foreground-muted z-40 p-1 text-sm transition-colors hover:bg-transparent"
          onClick={onCopy}
          tabIndex={-1}
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
        {editor.isEditable &&
          isInsideNode(
            editor.state.selection.from,
            editor.state.selection.to,
            getPos(),
            node.nodeSize,
          ) && (
            <Select defaultValue={currentLanguage?.id} onValueChange={onChange}>
              <SelectTrigger
                className="languages text-foreground-muted hover:text-foreground-faint w-auto min-w-32"
                tabIndex={-1}
                size="sm"
              >
                {currentLanguage?.name}
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {supportedLanguages.map((lang) => (
                  <SelectItem
                    key={lang.id}
                    value={lang.id}
                    className="languages-options py-1 pl-2.5"
                  >
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
      </div>
    </NodeViewWrapper>
  );
};
