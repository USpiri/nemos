import {
  TableCell,
  Table as TableExtension,
  TableHeader,
  TableKitOptions,
  TableRow,
} from '@tiptap/extension-table'
import { Extension, ReactNodeViewRenderer } from '@tiptap/react'
import TableNodeView from './Table'

// TODO:
// - Delete column/row by pressing backspace when empty row/column is selected
// - Escape from table by pressing tab on empty row
// - Add table node view

// export const Table = TableKit.configure({
//   table: {
//     allowTableNodeSelection: true,
//     renderWrapper: true,
//   },
// }).extend({

//   addKeyboardShortcuts() {
//     return {
//       ...this.parent?.(),
//       'Shift-Control-Enter': () => this.editor.commands.addRowBefore(),
//       'Control-Enter': () => this.editor.commands.addRowAfter(),
//       'Shift-Control-Tab': () =>
//         this.editor.chain().addColumnBefore().goToPreviousCell().run(),
//       'Control-Tab': () => {
//         return this.editor.chain().addColumnAfter().goToNextCell().run()
//       },
//     }
//   },
//   onUpdate() {
//     this.editor.commands.fixTables()
//   },
// })

export const Table = Extension.create<TableKitOptions>({
  name: 'tableKit',
  addExtensions() {
    const extensions = []
    if (this.options.table !== false) {
      extensions.push(
        TableExtension.configure({
          allowTableNodeSelection: true,
          // renderWrapper: true,
        }).extend({
          addNodeView() {
            return ReactNodeViewRenderer(TableNodeView, {
              // as: 'table',
              contentDOMElementTag: 'table',
            })
          },
        }),
      )
    }
    if (this.options.tableCell !== false) {
      extensions.push(TableCell.configure(this.options.tableCell))
    }
    if (this.options.tableHeader !== false) {
      extensions.push(TableHeader.configure(this.options.tableHeader))
    }
    if (this.options.tableRow !== false) {
      extensions.push(TableRow.configure(this.options.tableRow))
    }
    return extensions
  },
})
