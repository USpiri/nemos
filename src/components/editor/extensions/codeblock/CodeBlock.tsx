import { Button } from "@/components/ui/button/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { supportedLanguages } from "@/config/code-languages";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export const CodeBlock = ({
  editor,
  node,
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
      <div className="absolute bottom-2 right-2 flex flex-row items-center">
        <Button
          className="z-40 p-1 text-sm text-foreground-faint transition-colors hover:bg-transparent hover:text-foreground-muted"
          onClick={onCopy}
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
        {editor.isEditable && (
          <Select defaultValue={currentLanguage?.id} onValueChange={onChange}>
            <SelectTrigger className="languages w-auto min-w-32 px-2 py-1 transition-colors hover:text-foreground-muted">
              {currentLanguage?.name}
            </SelectTrigger>
            <SelectContent>
              {supportedLanguages.map((lang) => (
                <SelectItem
                  key={lang.id}
                  value={lang.id}
                  className="languages-options py-1 pl-1.5"
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
