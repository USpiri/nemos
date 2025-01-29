import cn from "@/utils/cn";
import { Editor as EditorI, EditorContent, useEditor } from "@tiptap/react";
import { Extensions } from "./extensions";

import "./editor.css";
import "@/styles/editor-higlights.css";
import "katex/dist/katex.min.css";

interface Props {
  className?: string;
  onChange?: (editor: EditorI) => void;
  content?: string;
  readonly?: boolean;
}

const baseClasses =
  "editor focus:outline-none prose prose-theme max-w-[unset] print:prose-neutral print:prose-sm";

// TODO:
// - Enable spellcheck and allow different languages

export const Editor = ({
  className,
  onChange,
  content = "",
  readonly = false,
}: Props) => {
  const editor = useEditor(
    {
      extensions: [...Extensions],
      editorProps: {
        attributes: {
          class: cn(baseClasses, className),
          spellcheck: "false",
        },
      },
      content,
      editable: !readonly,
      onUpdate: ({ editor }) => {
        if (onChange) onChange(editor);
      },
    },
    [content, readonly],
  );

  if (!editor) return null;

  return <EditorContent editor={editor} />;
};
