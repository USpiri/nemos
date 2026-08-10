import { openUrl } from '@tauri-apps/plugin-opener'
import { getMarkRange } from '@tiptap/core'
import { Link as LinkExtension, type LinkOptions } from '@tiptap/extension-link'
import type { MarkType } from '@tiptap/pm/model'
import {
  Plugin,
  PluginKey,
  TextSelection,
  type Transaction,
} from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { InputRule, markInputRule, ReactMarkViewRenderer } from '@tiptap/react'
import { parseLinkSource, serializeLinkSource } from './grammar'
import { LinkView } from './LinkView'

function linkInputRule(config: Parameters<typeof markInputRule>[0]) {
  const defaultMarkInputRule = markInputRule(config)

  return new InputRule({
    find: config.find,
    handler(props) {
      const { tr } = props.state

      defaultMarkInputRule.handler(props)
      tr.setMeta('preventAutolink', true)
    },
  })
}
const inputRegex = /(?:^|\s)\[([^\]]*)?\]\((\S+)(?: ["“](.+)["”])?\)$/i

interface MaterializedRange {
  from: number
  to: number
}

/*
 * Tracks the span of raw `[label](href)` source text currently materialized
 * for editing, so it can be re-parsed and re-marked once the cursor leaves it.
 * */
const materializeLinkKey = new PluginKey<MaterializedRange | null>(
  'linkMaterialize',
)

/*
 * Only the bracket/paren syntax around the label is inserted or removed —
 * the label's own text is never deleted-and-reinserted, so marks already on
 * it (bold, italic) survive materializing and committing.
 * */
function commitMaterializedRange(
  tr: Transaction,
  range: MaterializedRange,
  linkType: MarkType,
) {
  const raw = tr.doc.textBetween(range.from, range.to)
  const parsed = parseLinkSource(raw)

  if (parsed && parsed.href) {
    const labelStart = range.from + 1
    const labelEnd = labelStart + parsed.label.length
    tr.delete(labelEnd, range.to)
    tr.delete(range.from, labelStart)
    tr.addMark(
      range.from,
      range.from + parsed.label.length,
      linkType.create({ href: parsed.href, title: parsed.title }),
    )
  }

  tr.setMeta(materializeLinkKey, null)
}

function materializeMarkRange(
  tr: Transaction,
  range: MaterializedRange,
  linkType: MarkType,
) {
  const mark = tr.doc.nodeAt(range.from)?.marks.find((m) => m.type === linkType)
  if (!mark) return

  const wrapper = serializeLinkSource({
    label: '',
    href: mark.attrs.href ?? '',
    title: mark.attrs.title ?? null,
  })
  const prefix = wrapper.slice(0, 1)
  const suffix = wrapper.slice(1)

  const schema = tr.doc.type.schema
  tr.removeMark(range.from, range.to, linkType)
  // Plain `insertText` would inherit marks (e.g. bold, if inclusive) from
  // whatever sits at the exact insertion boundary — inserting bare text
  // nodes keeps the syntax characters unmarked regardless of what's next
  // to them.
  tr.insert(range.to, schema.text(suffix))
  tr.insert(range.from, schema.text(prefix))
  tr.setMeta(materializeLinkKey, {
    from: range.from,
    to: range.to + prefix.length + suffix.length,
  })
}

function materializeLinkPlugin(linkType: MarkType) {
  return new Plugin<MaterializedRange | null>({
    key: materializeLinkKey,
    state: {
      init: () => null,
      apply(tr, value) {
        const meta = tr.getMeta(materializeLinkKey)
        if (meta !== undefined) return meta
        if (value && tr.docChanged) {
          return {
            // `to` maps with a "before" bias so typing right at the end of
            // the raw source (e.g. a trailing space) lands outside the
            // range instead of silently extending it forever.
            from: tr.mapping.map(value.from),
            to: tr.mapping.map(value.to, -1),
          }
        }
        return value
      },
    },
    appendTransaction(transactions, _oldState, newState) {
      if (!transactions.some((t) => t.docChanged || t.selectionSet)) {
        return null
      }

      const tr = newState.tr
      let changed = false

      const active = materializeLinkKey.getState(newState)
      const { from, to, empty } = newState.selection
      // Strict `<` on the upper bound: a cursor sitting exactly at the end
      // boundary (e.g. clicking past a link that's the last thing in the
      // note) must count as "left the range", or it can never commit.
      const insideActive = !!active && from >= active.from && to < active.to

      if (active && !insideActive) {
        commitMaterializedRange(tr, active, linkType)
        changed = true
      }

      // Any transaction we ourselves dispatch always tags this same meta
      // key (see commitMaterializedRange/materializeMarkRange), so this
      // detects "is everything in this batch our own follow-up, or did a
      // real user action (click, arrow key) happen". Without this guard, a
      // link committed via blur maps the cursor right back inside the mark
      // it just created, and this same appendTransaction call — or
      // ProseMirror's own re-run of it after we return a tr — would
      // immediately re-materialize the link it just finished committing.
      const userDriven = transactions.some(
        (t) => t.getMeta(materializeLinkKey) === undefined,
      )

      if (userDriven && empty && (!active || !insideActive)) {
        const pos = changed ? tr.mapping.map(newState.selection.from) : from
        const range = getMarkRange(tr.doc.resolve(pos), linkType)
        if (range) {
          materializeMarkRange(tr, range, linkType)
          changed = true
        }
      }

      return changed ? tr : null
    },
    props: {
      decorations(state) {
        const active = materializeLinkKey.getState(state)
        if (!active) return null
        return DecorationSet.create(state.doc, [
          Decoration.inline(active.from, active.to, {
            class: 'link-raw-source',
          }),
        ])
      },
      handleDOMEvents: {
        // Losing focus entirely (switching apps, clicking outside the
        // editor) never produces a ProseMirror transaction on its own, so
        // appendTransaction never runs — without this, a link mid-edit
        // would stay stuck in Source Mode until the next selection change.
        blur(view) {
          const active = materializeLinkKey.getState(view.state)
          if (!active) return false

          const tr = view.state.tr
          commitMaterializedRange(tr, active, linkType)
          view.dispatch(tr)
          return false
        },
      },
    },
  })
}

export const Link = LinkExtension.extend<LinkOptions>({
  inclusive: false,

  addOptions() {
    return {
      ...(this.parent?.() as LinkOptions),
      openOnClick: 'whenNotEditable',
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      title: {
        default: null,
      },
    }
  },

  addInputRules() {
    return [
      linkInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes(match) {
          return {
            title: match.pop()?.trim(),
            href: match.pop()?.trim(),
          }
        },
      }),
    ]
  },

  addKeyboardShortcuts() {
    return {
      /*
       * Create a link from the current selection and drop straight into its
       * editable raw-source state, caret positioned ready to type the href.
       * */
      'Mod-k': () =>
        this.editor.commands.command(({ tr, state }) => {
          const { from, to, empty } = state.selection
          if (empty) return false

          const label = state.doc.textBetween(from, to)
          if (!label.trim()) return false

          const prefix = '['
          const suffix = ']()'

          const schema = tr.doc.type.schema
          // Wrap the selection instead of replacing it, so marks already on
          // the selected text (bold, italic) survive; the syntax characters
          // are inserted as bare text nodes so they don't inherit them.
          tr.removeMark(from, to, this.type)
          tr.insert(to, schema.text(suffix))
          tr.insert(from, schema.text(prefix))
          tr.setSelection(
            TextSelection.create(
              tr.doc,
              from + prefix.length + label.length + 2,
            ),
          )
          tr.setMeta(materializeLinkKey, {
            from,
            to: from + prefix.length + label.length + suffix.length,
          })
          return true
        }),
    }
  },

  addMarkView() {
    return ReactMarkViewRenderer(LinkView)
  },

  addProseMirrorPlugins() {
    let hoveredElement: HTMLElement | null = null
    return [
      new Plugin({
        props: {
          /*
           * Ctrl + click to open on edit mode
           * Click to open on read-only mode
           *
           * Only guards against ProseMirror's own selection-placement
           * fallback here — the browser's native caret jump on mousedown
           * (which fires first and would otherwise trigger materialize
           * before this even runs) is blocked in handleDOMEvents.mousedown.
           * */
          handleClick(view, _pos, event) {
            if (!view.editable) return false
            if (!event.ctrlKey) return false

            const element = event.target as HTMLElement
            const target = (
              element.matches('a') ? event.target : element.parentElement
            ) as HTMLAnchorElement
            if (target.tagName !== 'A' && !target.hasAttribute('href'))
              return false

            return true
          },

          handleDOMEvents: {
            /*
             * Ctrl + mousedown on a link opens it and blocks the browser's
             * native caret placement, so the selection never moves into the
             * link (which would otherwise materialize it) on the way there.
             * */
            mousedown: (view, event) => {
              if (!view.editable) return false
              if (!event.ctrlKey) return false

              const element = event.target as HTMLElement
              const target = (
                element.matches('a') ? event.target : element.parentElement
              ) as HTMLAnchorElement
              if (target.tagName !== 'A' || !target.hasAttribute('href'))
                return false

              event.preventDefault()
              openUrl(target.href)
              return true
            },

            /*
             * Prevent default anchor behaviour
             * https://github.com/tauri-apps/tauri/issues/2791
             * */
            click: (view, event) => {
              if (!view.editable) return

              const element = event.target as HTMLElement
              const target = (
                element.matches('a') ? event.target : element.parentElement
              ) as HTMLAnchorElement
              if (target.tagName === 'A' && target.hasAttribute('href')) {
                event.preventDefault()
                event.stopPropagation()
              }
            },

            /*
             * cursor-pointer on ctrl + key + hover
             * */
            mouseover: (_, event) => {
              const element = event.target as HTMLElement
              const target = (
                element.matches('a') ? event.target : element.parentElement
              ) as HTMLAnchorElement
              if (target.tagName === 'A' && target.hasAttribute('href')) {
                hoveredElement = target
                if (event.ctrlKey) target.classList.add('cursor-pointer')
              }
            },
            mouseout: (_, event) => {
              const element = event.target as HTMLElement
              const target = (
                element.matches('a') ? event.target : element.parentElement
              ) as HTMLAnchorElement
              if (target.tagName === 'A' && target.hasAttribute('href')) {
                target.classList.remove('cursor-pointer')
                hoveredElement = null
              }
            },
            keydown: (_, event) => {
              if (event.key === 'Control' && hoveredElement) {
                hoveredElement.classList.add('cursor-pointer')
              }
            },
            keyup: (_, event) => {
              if (event.key === 'Control' && hoveredElement) {
                hoveredElement.classList.remove('cursor-pointer')
              }
            },
          },
        },
      }),
      materializeLinkPlugin(this.type),
    ]
  },
})
