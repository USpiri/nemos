import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Editor } from "@tiptap/react";

interface FileHandlerPluginOptions {
  key: PluginKey;
  editor: Editor;
  onPaste?: (editor: Editor, files: File[], htmlData: string) => void;
  onDrop?: (editor: Editor, files: File[], position: number) => void;
  allowedMimeTypes?: string[];
}

export const createFileHandlerPlugin = ({
  key,
  editor,
  onPaste,
  onDrop,
  allowedMimeTypes,
}: FileHandlerPluginOptions) =>
  new Plugin({
    key: key,
    props: {
      handleDrop(view, event) {
        if (!onDrop) return false;
        if (!event.dataTransfer?.files.length) return false;

        const pos = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        let files = Array.from(event.dataTransfer.files);

        if (allowedMimeTypes)
          files = files.filter((file) => allowedMimeTypes.includes(file.type));
        if (files.length === 0) return false;

        event.stopPropagation();
        event.preventDefault();
        onDrop(editor, files, pos?.pos || 0);

        return true;
      },
      handlePaste(_, event) {
        if (!onPaste) return false;
        if (!event.clipboardData?.files.length) return false;

        let files = Array.from(event.clipboardData.files);
        const htmlData = event.clipboardData.getData("text/html");

        if (allowedMimeTypes)
          files = files.filter((file) => allowedMimeTypes.includes(file.type));
        if (files.length === 0) return false;

        event.preventDefault();
        event.stopPropagation();
        onPaste(editor, files, htmlData);

        return htmlData.length === 0;
      },
    },
  });
