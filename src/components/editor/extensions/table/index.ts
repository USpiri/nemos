import TipTapTable from "@tiptap/extension-table";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { TableNodeView } from "./TableNodeView";

// TODO:
// - Delete column/row by pressing backspace when empty row/column is selected
// - Escape from table by pressing tab on empty row

export const Table = TipTapTable.configure({
  allowTableNodeSelection: true,
}).extend({
  addNodeView() {
    return ReactNodeViewRenderer(TableNodeView, {
      contentDOMElementTag: "tbody",
    });
  },
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      "Shift-Control-Enter": () => this.editor.commands.addRowBefore(),
      "Control-Enter": () => this.editor.commands.addRowAfter(),
      "Shift-Control-Tab": () =>
        this.editor.chain().addColumnBefore().goToPreviousCell().run(),
      "Control-Tab": () => {
        return this.editor.chain().addColumnAfter().goToNextCell().run();
      },
    };
  },
  onUpdate() {
    this.editor.commands.fixTables();
  },
});
