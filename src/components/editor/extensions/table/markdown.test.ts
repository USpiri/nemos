import type {
  JSONContent,
  MarkdownParseHelpers,
  MarkdownRendererHelpers,
} from '@tiptap/core'
import { describe, expect, it } from 'vitest'
import type { TableAlign } from './align'
import { parseTableMarkdown, renderTableToMarkdown } from './markdown'

const parseHelpers: MarkdownParseHelpers = {
  parseInline: (tokens) =>
    tokens.map((t) => ({ type: 'text', text: t.text ?? '' })),
  parseChildren: () => [],
  createTextNode: (text, marks) => ({ type: 'text', text, marks }),
  createNode: (type, attrs, content) => ({ type, attrs, content }),
  applyMark: (markType, content, attrs) => ({ mark: markType, content, attrs }),
}

const renderHelpers: MarkdownRendererHelpers = {
  renderChildren: (nodes) =>
    (Array.isArray(nodes) ? nodes : [nodes])
      .map(
        (n) =>
          (n as JSONContent).content?.map((c) => c.text ?? '').join('') ?? '',
      )
      .join(''),
  wrapInBlock: (_prefix, content) => content,
  indent: (content) => content,
}

describe('parseTableMarkdown', () => {
  it('stamps each column align onto every header and body cell', () => {
    const token = {
      type: 'table',
      raw: '',
      align: ['left', 'center', null] as TableAlign[],
      header: [
        { tokens: [{ text: 'A' }] },
        { tokens: [{ text: 'B' }] },
        { tokens: [{ text: 'C' }] },
      ],
      rows: [
        [
          { tokens: [{ text: '1' }] },
          { tokens: [{ text: '2' }] },
          { tokens: [{ text: '3' }] },
        ],
      ],
    }

    const result = parseTableMarkdown(token, parseHelpers) as JSONContent
    const [headerRow, bodyRow] = result.content!

    expect(headerRow.content!.map((c) => c.attrs?.align)).toEqual([
      'left',
      'center',
      null,
    ])
    expect(bodyRow.content!.map((c) => c.attrs?.align)).toEqual([
      'left',
      'center',
      null,
    ])
  })

  it('defaults align to null when the token has no align array', () => {
    const token = {
      type: 'table',
      raw: '',
      header: [{ tokens: [{ text: 'A' }] }],
      rows: [[{ tokens: [{ text: '1' }] }]],
    }

    const result = parseTableMarkdown(token, parseHelpers) as JSONContent
    expect(result.content![0].content![0].attrs?.align).toBeNull()
  })
})

describe('renderTableToMarkdown', () => {
  function cell(
    type: string,
    text: string,
    align: string | null = null,
  ): JSONContent {
    return {
      type,
      attrs: { align },
      content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
    }
  }

  it('emits the correct GFM delimiter syntax per column alignment', () => {
    const node: JSONContent = {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            cell('tableHeader', 'Left', 'left'),
            cell('tableHeader', 'Center', 'center'),
            cell('tableHeader', 'Right', 'right'),
            cell('tableHeader', 'None', null),
          ],
        },
        {
          type: 'tableRow',
          content: [
            cell('tableCell', 'a'),
            cell('tableCell', 'b'),
            cell('tableCell', 'c'),
            cell('tableCell', 'd'),
          ],
        },
      ],
    }

    const markdown = renderTableToMarkdown(node, renderHelpers)
    const lines = markdown.split('\n').filter(Boolean)
    const delimiterCells = lines[1]
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean)

    expect(delimiterCells[0]).toMatch(/^:-+$/)
    expect(delimiterCells[1]).toMatch(/^:-+:$/)
    expect(delimiterCells[2]).toMatch(/^-+:$/)
    expect(delimiterCells[3]).toMatch(/^-+$/)
  })

  it('returns an empty string for a table with no rows', () => {
    expect(
      renderTableToMarkdown({ type: 'table', content: [] }, renderHelpers),
    ).toBe('')
  })
})
