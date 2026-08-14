import {
  TableCell,
  Table as TableExtension,
  TableHeader,
  TableKitOptions,
  TableRow,
} from '@tiptap/extension-table'
import { Extension, ReactNodeViewRenderer } from '@tiptap/react'
import { setColumnAlign, setColumnAlignAt, TableAlign } from './align'
import {
  clearColumnAt,
  clearRowAt,
  deleteColumnAt,
  deleteRowAt,
  duplicateColumnAt,
  duplicateRowAt,
  insertColumnAt,
  insertRowAt,
  moveColumnAt,
  moveRowAt,
  SortDirection,
  sortRowsByColumn,
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
      /** Sets the alignment of every cell (header included) in column `col` of the table at `tablePos`. */
      setColumnAlignAt: (
        tablePos: number,
        col: number,
        align: TableAlign,
      ) => ReturnType
    }
    tableHandle: {
      /** Inserts a body row at `row` in the table at `tablePos` (existing rows shift down). */
      insertRow: (tablePos: number, row: number) => ReturnType
      /** Inserts a column at `col` in the table at `tablePos` (existing columns shift right). */
      insertColumn: (tablePos: number, col: number) => ReturnType
      /** Deletes the body row at `row` in the table at `tablePos`. */
      deleteRowAt: (tablePos: number, row: number) => ReturnType
      /** Deletes the column at `col` in the table at `tablePos`. */
      deleteColumnAt: (tablePos: number, col: number) => ReturnType
      /** Duplicates the row at `row` in the table at `tablePos`, inserting the copy after it. */
      duplicateRow: (tablePos: number, row: number) => ReturnType
      /** Duplicates the column at `col` in the table at `tablePos`, inserting the copy after it. */
      duplicateColumn: (tablePos: number, col: number) => ReturnType
      /** Moves the body row at `from` to `to` in the table at `tablePos`. */
      moveRow: (tablePos: number, from: number, to: number) => ReturnType
      /** Moves the column at `from` to `to` in the table at `tablePos`. */
      moveColumn: (tablePos: number, from: number, to: number) => ReturnType
      /** Empties every cell in the row at `row` in the table at `tablePos`. */
      clearRow: (tablePos: number, row: number) => ReturnType
      /** Empties every cell in the column at `col` in the table at `tablePos`. */
      clearColumn: (tablePos: number, col: number) => ReturnType
      /** Reorders body rows in the table at `tablePos` by the text content of column `col`. */
      sortRowsByColumn: (
        tablePos: number,
        col: number,
        direction: SortDirection,
      ) => ReturnType
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
      setColumnAlignAt:
        (tablePos: number, col: number, align: TableAlign) =>
        ({ state, dispatch }) =>
          setColumnAlignAt(state, dispatch, tablePos, col, align),
      insertRow:
        (tablePos: number, row: number) =>
        ({ state, dispatch }) =>
          insertRowAt(state, dispatch, tablePos, row),
      insertColumn:
        (tablePos: number, col: number) =>
        ({ state, dispatch }) =>
          insertColumnAt(state, dispatch, tablePos, col),
      deleteRowAt:
        (tablePos: number, row: number) =>
        ({ state, dispatch }) =>
          deleteRowAt(state, dispatch, tablePos, row),
      deleteColumnAt:
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
      moveRow:
        (tablePos: number, from: number, to: number) =>
        ({ state, dispatch }) =>
          moveRowAt(state, dispatch, tablePos, from, to),
      moveColumn:
        (tablePos: number, from: number, to: number) =>
        ({ state, dispatch }) =>
          moveColumnAt(state, dispatch, tablePos, from, to),
      clearRow:
        (tablePos: number, row: number) =>
        ({ state, dispatch }) =>
          clearRowAt(state, dispatch, tablePos, row),
      clearColumn:
        (tablePos: number, col: number) =>
        ({ state, dispatch }) =>
          clearColumnAt(state, dispatch, tablePos, col),
      sortRowsByColumn:
        (tablePos: number, col: number, direction: SortDirection) =>
        ({ state, dispatch }) =>
          sortRowsByColumn(state, dispatch, tablePos, col, direction),
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
