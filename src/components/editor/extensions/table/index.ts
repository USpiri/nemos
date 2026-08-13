import {
  TableCell,
  Table as TableExtension,
  TableHeader,
  TableKitOptions,
  TableRow,
} from '@tiptap/extension-table'
import { Extension, ReactNodeViewRenderer } from '@tiptap/react'
import { setColumnAlign, TableAlign } from './align'
import {
  deleteColumnAt,
  deleteRowAt,
  duplicateColumnAt,
  duplicateRowAt,
  insertColumnAt,
  insertRowAt,
} from './handle-commands'
import { TableHandle } from './handle-extension'
import { parseTableMarkdown, renderTableToMarkdown } from './markdown'
import TableNodeView from './Table'

// TODO:
// - Delete column/row by pressing backspace when empty row/column is selected
// - Escape from table by pressing tab on empty row

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    tableAlign: {
      /** Sets the alignment of every cell (header included) in the current column. */
      setColumnAlign: (align: TableAlign) => ReturnType
    }
    tableHandle: {
      /** Inserts a body row at `row` in the table at `tablePos` (existing rows shift down). */
      insertRow: (tablePos: number, row: number) => ReturnType
      /** Inserts a column at `col` in the table at `tablePos` (existing columns shift right). */
      insertColumn: (tablePos: number, col: number) => ReturnType
      /** Deletes the body row at `row` in the table at `tablePos`. */
      deleteRow: (tablePos: number, row: number) => ReturnType
      /** Deletes the column at `col` in the table at `tablePos`. */
      deleteColumn: (tablePos: number, col: number) => ReturnType
      /** Duplicates the row at `row` in the table at `tablePos`, inserting the copy after it. */
      duplicateRow: (tablePos: number, row: number) => ReturnType
      /** Duplicates the column at `col` in the table at `tablePos`, inserting the copy after it. */
      duplicateColumn: (tablePos: number, col: number) => ReturnType
    }
  }
}

const alignAttribute = {
  align: {
    default: null as TableAlign,
    parseHTML: (element: HTMLElement) => element.getAttribute('align') || null,
    renderHTML: (attributes: { align?: TableAlign }) =>
      attributes.align ? { align: attributes.align } : {},
  },
}

const AlignedTableCell = TableCell.extend({
  content: 'paragraph',
  addAttributes() {
    return {
      ...this.parent?.(),
      ...alignAttribute,
    }
  },
})

const AlignedTableHeader = TableHeader.extend({
  content: 'paragraph',
  addAttributes() {
    return {
      ...this.parent?.(),
      ...alignAttribute,
    }
  },
})

const AlignedTable = TableExtension.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TableNodeView, {
      contentDOMElementTag: 'table',
    })
  },
  parseMarkdown: parseTableMarkdown,
  renderMarkdown: renderTableToMarkdown,
  addCommands() {
    return {
      ...this.parent?.(),
      // GFM tables cannot represent merged cells — disabled so a table can
      // never be built that Markdown can't losslessly round-trip.
      mergeCells: () => () => false,
      splitCell: () => () => false,
      mergeOrSplit: () => () => false,
      setColumnAlign:
        (align: TableAlign) =>
        ({ state, dispatch }) =>
          setColumnAlign(state, dispatch, align),
      insertRow:
        (tablePos: number, row: number) =>
        ({ state, dispatch }) =>
          insertRowAt(state, dispatch, tablePos, row),
      insertColumn:
        (tablePos: number, col: number) =>
        ({ state, dispatch }) =>
          insertColumnAt(state, dispatch, tablePos, col),
      deleteRow:
        (tablePos: number, row: number) =>
        ({ state, dispatch }) =>
          deleteRowAt(state, dispatch, tablePos, row),
      deleteColumn:
        (tablePos: number, col: number) =>
        ({ state, dispatch }) =>
          deleteColumnAt(state, dispatch, tablePos, col),
      duplicateRow:
        (tablePos: number, row: number) =>
        ({ state, dispatch }) =>
          duplicateRowAt(state, dispatch, tablePos, row),
      duplicateColumn:
        (tablePos: number, col: number) =>
        ({ state, dispatch }) =>
          duplicateColumnAt(state, dispatch, tablePos, col),
    }
  },
})

export const Table = Extension.create<TableKitOptions>({
  name: 'tableKit',
  addExtensions() {
    const extensions = []
    if (this.options.table !== false) {
      extensions.push(
        AlignedTable.configure({
          allowTableNodeSelection: true,
        }),
        TableHandle,
      )
    }
    if (this.options.tableCell !== false) {
      extensions.push(AlignedTableCell.configure(this.options.tableCell))
    }
    if (this.options.tableHeader !== false) {
      extensions.push(AlignedTableHeader.configure(this.options.tableHeader))
    }
    if (this.options.tableRow !== false) {
      extensions.push(TableRow.configure(this.options.tableRow))
    }
    return extensions
  },
})
