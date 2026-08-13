import {
  TableCell,
  Table as TableExtension,
  TableHeader,
  TableKitOptions,
  TableRow,
} from '@tiptap/extension-table'
import { Extension, ReactNodeViewRenderer } from '@tiptap/react'
import { setColumnAlign, TableAlign } from './align'
import { parseTableMarkdown, renderTableToMarkdown } from './markdown'
import TableNodeView from './Table'

// TODO:
// - Delete column/row by pressing backspace when empty row/column is selected
// - Escape from table by pressing tab on empty row
// - Add table node view

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    tableAlign: {
      /** Sets the alignment of every cell (header included) in the current column. */
      setColumnAlign: (align: TableAlign) => ReturnType
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
