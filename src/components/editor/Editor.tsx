import cn from "@/lib/utils/cn";
import { EditorContent, Editor as EditorI, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { Extensions } from "./extensions";

import "@/styles/editor-higlights.css";
import "katex/dist/katex.min.css";
import "./editor.css";

interface Props {
  className?: string;
  onChange?: (editor: EditorI) => void;
  content?: string;
  readonly?: boolean;
}

const baseClasses =
  "editor focus:outline-hidden prose prose-theme max-w-[unset] print:prose-neutral print:prose-sm";

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
      injectCSS: false,
      onUpdate: ({ editor }) => {
        if (onChange) onChange(editor);
      },
    },
    [content],
  );

  //Keeps content unchanged and prevents reloading
  //the editor
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readonly);
    }
  }, [readonly, editor]);

  if (!editor) return null;

  return <EditorContent editor={editor} />;
};
