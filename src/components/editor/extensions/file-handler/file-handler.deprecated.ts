import { PluginKey } from "@tiptap/pm/state";
import { Editor, Extension } from "@tiptap/react";
import { createFileHandlerPlugin } from "./file-handler-plugin.deprecated";

export interface FileHandlerOptions {
  onPaste?: (editor: Editor, files: File[], htmlData: string) => void;
  onDrop?: (editor: Editor, files: File[], position: number) => void;
  allowedMimeTypes?: string[];
}

export const FileHandlerExtension = Extension.create<FileHandlerOptions>({
  name: "fileHandler",
  addOptions: () => ({
    onPaste: undefined,
    onDrop: undefined,
    allowedMimeTypes: undefined,
  }),
  addProseMirrorPlugins() {
    return [
      createFileHandlerPlugin({
        key: new PluginKey(this.name),
        editor: this.editor,
        allowedMimeTypes: this.options.allowedMimeTypes,
        onDrop: this.options.onDrop,
        onPaste: this.options.onPaste,
      }),
    ];
  },
});
