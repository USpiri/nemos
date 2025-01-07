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
}

const baseClasses =
  "editor focus:outline-none prose prose-theme max-w-[unset] print:prose-neutral print:prose-sm";

// TODO:
// - Enable spellcheck and allow different languages
// - Change placeholder on new nodes and first nodes (Slash command)

export const Editor = ({ className, onChange, content = "" }: Props) => {
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
      onUpdate: ({ editor }) => {
        if (onChange) onChange(editor);
      },
    },
    [content],
  );

  if (!editor) return null;

  return <EditorContent editor={editor} />;
};
