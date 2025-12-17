import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { useMemo } from "react";
import { StarterKit } from "@tiptap/starter-kit";
import { DragHandle } from "@tiptap/extension-drag-handle-react";
import { Selection, Focus, Placeholder } from "@tiptap/extensions";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Button } from "../ui/button";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

import "./editor.css";

interface Props {
  content?: string;
  className?: string;
  onUpdate?: (content: string) => void;
}

export const Editor = ({ content, className, onUpdate }: Props) => {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          dropcursor: { class: "dropcursor" },
        }),
        Selection,
        Focus,
        Placeholder,
        TaskList,
        TaskItem,
      ],
      content: `<ul data-type="taskList">
        <li data-type="taskItem" data-checked="true">flour</li>
        <li data-type="taskItem" data-checked="true">baking powder</li>
        <li data-type="taskItem" data-checked="true">salt</li>
        <li data-type="taskItem" data-checked="false">sugar</li>
        <li data-type="taskItem" data-checked="false">milk</li>
        <li data-type="taskItem" data-checked="false">eggs</li>
        <li data-type="taskItem" data-checked="false">butter</li>
      </ul>`,
      injectCSS: false,
      autofocus: true,
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
