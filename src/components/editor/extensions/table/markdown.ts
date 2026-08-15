import type {
  JSONContent,
  MarkdownParseHelpers,
  MarkdownRendererHelpers,
  MarkdownToken,
} from '@tiptap/core'
import type { TableAlign } from './align'

type MarkdownTableToken = {
  align?: TableAlign[]
  header?: { tokens: MarkdownToken[] }[]
  rows?: { tokens: MarkdownToken[] }[][]
} & MarkdownToken

export function parseTableMarkdown(
  token: MarkdownTableToken,
  h: MarkdownParseHelpers,
): JSONContent {
  const align = token.align ?? []
  const rows: JSONContent[] = []

  if (token.header) {
    const headerCells = token.header.map((cell, i) =>
      h.createNode('tableHeader', { align: align[i] ?? null }, [
        { type: 'paragraph', content: h.parseInline(cell.tokens) },
      ]),
    )
    rows.push(h.createNode('tableRow', {}, headerCells))
  }

  if (token.rows) {
    token.rows.forEach((row) => {
      const bodyCells = row.map((cell, i) =>
        h.createNode('tableCell', { align: align[i] ?? null }, [
          { type: 'paragraph', content: h.parseInline(cell.tokens) },
        ]),
      )
      rows.push(h.createNode('tableRow', {}, bodyCells))
    })
  }

  return h.createNode('table', undefined, rows)
}

function collapseWhitespace(s: string) {
  return (s || '').replace(/\s+/g, ' ').trim()
}

function delimiterFor(align: TableAlign, width: number) {
  switch (align) {
    case 'left':
      return `:${'-'.repeat(width - 1)}`
    case 'right':
      return `${'-'.repeat(width - 1)}:`
    case 'center':
      return `:${'-'.repeat(width - 2)}:`
    default:
      return '-'.repeat(width)
  }
}

function minWidthFor(align: TableAlign) {
  if (align === 'center') return 5
  if (align === 'left' || align === 'right') return 4
  return 3
}

export function renderTableToMarkdown(
  node: JSONContent,
  h: MarkdownRendererHelpers,
): string {
  if (!node.content || node.content.length === 0) {
    return ''
  }

  const rows = node.content.map((rowNode) =>
    (rowNode.content ?? []).map((cellNode) => ({
      text: collapseWhitespace(
        cellNode.content
          ? h.renderChildren(cellNode.content as JSONContent[])
          : '',
      ),
      align: (cellNode.attrs?.align ?? null) as TableAlign,
    })),
  )

  const columnCount = rows.reduce((max, r) => Math.max(max, r.length), 0)

  if (columnCount === 0) {
    return ''
  }

  const [headerRow, ...bodyRows] = rows

  const colWidths = new Array(columnCount).fill(3)
  rows.forEach((r) => {
    for (let i = 0; i < columnCount; i += 1) {
      colWidths[i] = Math.max(colWidths[i], r[i]?.text.length ?? 0)
    }
  })
  headerRow.forEach((cell, i) => {
    colWidths[i] = Math.max(colWidths[i], minWidthFor(cell.align))
  })

  const pad = (s: string, width: number) =>
    s + ' '.repeat(Math.max(0, width - s.length))

  let out = '\n'

  out += `| ${new Array(columnCount)
    .fill(0)
    .map((_, i) => pad(headerRow[i]?.text ?? '', colWidths[i]))
    .join(' | ')} |\n`

  out += `| ${new Array(columnCount)
    .fill(0)
    .map((_, i) =>
      pad(
        delimiterFor(headerRow[i]?.align ?? null, colWidths[i]),
        colWidths[i],
      ),
    )
    .join(' | ')} |\n`

  bodyRows.forEach((r) => {
    out += `| ${new Array(columnCount)
      .fill(0)
      .map((_, i) => pad(r[i]?.text ?? '', colWidths[i]))
      .join(' | ')} |\n`
  })

  return out
}
