import { Extension, ReactRenderer } from '@tiptap/react'
import { Suggestion, SuggestionProps } from '@tiptap/suggestion'
import { CommandItem } from '@/types'
import { CommandList } from './CommandList'
import { filterCommandItems, updatePosition } from './utils'

type SlashCommandsOptions = {
  commandItems: CommandItem[]
}

declare module '@tiptap/react' {
  interface ExtensionOptions {
    slashCommands: SlashCommandsOptions
  }
}

export const SlashCommands = Extension.create({
  name: 'slash-commands',

  addOptions() {
    return {
      commandItems: [] as CommandItem[],
      suggestion: {
        char: '/',
        command: (props: SuggestionProps<CommandItem>) => {
          props.command({ editor: props.editor, range: props.range })
        },

        items: ({ query }: { query: string }) => {
          return filterCommandItems(
            query || '',
            this.parent?.()?.commandItems || [],
          )
        },

        render: () => {
          let component: ReactRenderer<typeof CommandList> &
            ReactRenderer<CommandItem>
          return {
            onStart: (props: SuggestionProps<CommandItem>) => {
              component = new ReactRenderer(CommandList, {
                props: {
                  items: props.items,
                  editor: props.editor,
                  range: props.range,
                },
                editor: props.editor,
              })

              component.element.style.position = 'absolute'
              document.body.appendChild(component.element)

              updatePosition(props.editor, component.element)
            },

            onUpdate: (props: SuggestionProps<CommandItem>) => {
              component?.updateProps(props)
              updatePosition(props.editor, component?.element)
            },

            onKeyDown: (props: { event: KeyboardEvent }) => {
              if (props.event.key === 'Escape') {
                component?.destroy()
                component?.element.remove()
                return true
              }
              return false
            },

            onExit() {
              component?.destroy()
              component?.element.remove()
            },
          }
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        // Show suggestion only on the start of a paragraph node.
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from)
          const isRootDepth = $from.depth === 1
          const isParagraph = $from.parent.type.name === 'paragraph'
          const isStartOfLine =
            $from.parent.textContent.charAt(0) === this.options.suggestion.char

          const afterContent = $from.parent.textContent.substring(
            $from.parent.textContent.indexOf(this.options.suggestion.char),
          )
          const isValidAfterContent = !afterContent.endsWith('  ')

          return (
            isRootDepth && isParagraph && isStartOfLine && isValidAfterContent
          )
        },
      }),
    ]
  },
})
