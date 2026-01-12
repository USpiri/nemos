import { cn } from "@/lib/utils";
import { DragHandle } from "@tiptap/extension-drag-handle-react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { GripVertical } from "lucide-react";
import { useMemo } from "react";
import { Button } from "../ui/button";
import { Extensions } from "./extensions";

import "./editor.css";
import "./extensions/higlights.css";
import "./extensions/mermaid.css";
import "katex/dist/katex.min.css";

interface Props {
  content?: string;
  className?: string;
  onUpdate?: (content: string) => void;
  editable?: boolean;
}

export const Editor = ({
  content,
  className,
  onUpdate,
  editable = true,
}: Props) => {
  const editor = useEditor(
    {
      extensions: Extensions,
      content,
      injectCSS: false,
      autofocus: true,
      editable,
      editorProps: {
        attributes: {
          class: cn("typography focus:outline-none relative", className),
          spellcheck: "false",
        },
      },
      onUpdate: ({ editor }) => {
        onUpdate?.(editor.getHTML());
      },
    },
    [content],
  );

  const providerValue = useMemo(() => ({ editor }), [editor]);
  if (!editor) return null;

  return (
    <>
      <EditorContext.Provider value={providerValue}>
        <DragHandle editor={editor}>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground cursor-grab"
          >
            <GripVertical className="size-4" />
          </Button>
        </DragHandle>
        <EditorContent editor={editor} />
      </EditorContext.Provider>
    </>
  );
};
