import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Focus, Placeholder, Selection } from '@tiptap/extensions'
import { Markdown } from '@tiptap/markdown'
import { StarterKit } from '@tiptap/starter-kit'
import { suggestionItems } from '@/config/suggestion-menu'
import { CodeBlock } from './codeblock'
import { filterCommandItems, SlashCommands } from './commands'
import { FileHandler } from './file-handler'
import { Image } from './image'
import { Link } from './link'
import { MathExtension } from './math'
import { Table } from './table'
import { Underline } from './underline'

export const Extensions = [
  StarterKit.configure({
    codeBlock: false,
    link: false,
    underline: false,
    dropcursor: { class: 'dropcursor' },
  }),
  Underline,
  Selection,
  Focus,
  FileHandler,
  SlashCommands.configure({
    commandItems: suggestionItems,
    suggestion: {
      items: ({ query }: { query: string }) =>
        filterCommandItems(query, suggestionItems),
    },
  }),
  Placeholder.configure({
    placeholder: 'Write something or type "/" for commands...',
  }),
  TaskList,
  TaskItem,
  CodeBlock,
  MathExtension,
  Image,
  Link,
  Table,
  Markdown,
]
