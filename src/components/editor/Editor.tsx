import cn from "@/utils/cn";
import { Editor as EditorI, EditorContent, useEditor } from "@tiptap/react";
import { Extensions } from "./extensions";

import "@/styles/editor-higlights.css";

interface Props {
  className?: string;
  onChange?: (editor: EditorI) => void;
  content?: string;
}

const baseClasses =
  "focus:outline-none prose prose-theme max-w-[unset] print:prose-neutral";

// TODO:
// - Enable spellcheck and allow different languages

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

  return (
    <>
      <EditorContent editor={editor} />
      <details>
        <summary>
          <strong>HTML:</strong>
        </summary>
        <pre className="text-wrap text-sm">
          {JSON.stringify(editor.getHTML())}
        </pre>
      </details>
    </>
  );
};
