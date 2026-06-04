import { mergeAttributes, Node } from '@tiptap/react'
import MathNodeView from './math-nodeview'

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    mathDisplay: {
      toggleMathDisplay: () => ReturnType
      setMathDisplay: () => ReturnType
    }
  }
}

const name = 'math-inline'
const tag = 'math-inline'
const inputRule = /\$([^\s][^$]*)\$$/

export const MathInline = Node.create({
  name,
  group: 'inline math',
  content: 'text*',
  marks: '',
  inline: true,
  selectable: true,

  parseHTML() {
    return [{ tag }]
  },

  renderHTML({ HTMLAttributes }) {
    return [tag, mergeAttributes(HTMLAttributes), 0]
  },

  markdownTokenizer: {
    name,
    level: 'inline' as const,
    start: (src: string) => src.indexOf('$'),
    tokenize(src: string) {
      const match = src.match(/^\$([^$\n]+?)\$/)
      if (!match) return undefined
      return {
        type: name,
        raw: match[0],
        math: match[1],
      }
    },
  },

  // @ts-ignore – @tiptap/markdown augments the extension config at runtime
  parseMarkdown(
    token: { math: string },
    helpers: {
      createNode: (
        type: string,
        attrs?: Record<string, unknown>,
        content?: unknown[],
      ) => unknown
      createTextNode: (text: string) => unknown
    },
  ) {
    const expression = token.math ?? ''
    return helpers.createNode(
      name,
      undefined,
      expression ? [helpers.createTextNode(expression)] : [],
    )
  },

  // @ts-ignore – @tiptap/markdown augments the extension config at runtime
  renderMarkdown(
    node: { content?: Array<{ text?: string }> },
    helpers: { renderChildren: (nodes: unknown) => string },
  ) {
    const text = helpers.renderChildren(node.content ?? [])
    return `$${text}$`
  },

  addAttributes() {
    return {
      showSource: {
        default: false,
      },
    }
  },

  addInputRules() {
    return [
      {
        find: inputRule,
        type: this.type,
        undoable: false,
        handler({ range, match, chain, state }) {
          const start = range.from
          const end = range.to
          const text = state.schema.text(match[1])
          if (text) {
            chain()
              .command(({ tr }) => {
                // @ts-expect-error this.type
                tr.replaceRangeWith(start, end, this.type.create(null, text))
                return true
              })
              .run()
          }
        },
      },
    ]
  },

  addNodeView() {
    return (props) => new MathNodeView(props, true)
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          let isMath = false
          const { selection } = state
          const { empty, anchor } = selection
          if (!empty) {
            return false
          }
          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (
              node.type.name === this.name &&
              pos + node.nodeSize === anchor
            ) {
              isMath = true
              tr.insertText('$' + (node.textContent || '') + '$', pos, anchor)
            }
          })
          return isMath
        }),
    }
  },
})
