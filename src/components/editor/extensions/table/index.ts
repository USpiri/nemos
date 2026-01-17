import { TableKit } from '@tiptap/extension-table'

// TODO:
// - Delete column/row by pressing backspace when empty row/column is selected
// - Escape from table by pressing tab on empty row
// - Add table node view

export const Table = TableKit.configure({
  table: {
    allowTableNodeSelection: true,
    renderWrapper: true,
  },
}).extend({
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      'Shift-Control-Enter': () => this.editor.commands.addRowBefore(),
      'Control-Enter': () => this.editor.commands.addRowAfter(),
      'Shift-Control-Tab': () =>
        this.editor.chain().addColumnBefore().goToPreviousCell().run(),
      'Control-Tab': () => {
        return this.editor.chain().addColumnAfter().goToNextCell().run()
      },
    }
  },
  onUpdate() {
    this.editor.commands.fixTables()
  },
})
