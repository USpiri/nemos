import cn from "@/utils/cn";
import { EditorContent, useEditor } from "@tiptap/react";
import { Extensions } from "./extensions";
import { content } from "@/utils/fake-content";

interface Props {
  className?: string;
}

const baseClasses =
  "focus:outline-none prose prose-theme max-w-[unset] print:prose-neutral";

// TODO:
// - Enable spellcheck and allow different languages

export const Editor = ({ className }: Props) => {
  const editor = useEditor({
    extensions: [...Extensions],
    editorProps: {
      attributes: {
        class: cn(baseClasses, className),
        spellcheck: "false",
      },
    },
    content,
  });

  if (!editor) return null;

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
};
