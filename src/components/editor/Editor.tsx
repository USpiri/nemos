import cn from "@/utils/cn";
import { EditorContent, useEditor } from "@tiptap/react";
import { Extensions } from "./extensions";

interface Props {
  className?: string;
}

const baseClasses =
  "focus:outline-none prose prose-theme max-w-[unset] print:prose-neutral";

export const Editor = ({ className }: Props) => {
  const editor = useEditor({
    extensions: [...Extensions],
    editorProps: {
      attributes: {
        class: cn(baseClasses, className),
      },
    },
    content:
      '<h1>Hola</h1><p>¿Cómo estas? <strong>Negrita</strong></p><ul><li><p>asdasd</p></li></ul><hr><ol><li><p>1</p></li><li><p>2</p></li></ol><blockquote><p>Quote</p></blockquote><pre><code>const hola = "Hello world!"</code></pre><p>Inline code: <code>const hola = "Hello world!"</code></p>',
  });

  if (!editor) return null;

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
};
