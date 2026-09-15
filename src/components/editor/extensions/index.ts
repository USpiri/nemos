import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Focus, Placeholder, Selection } from '@tiptap/extensions'
import { Markdown } from '@tiptap/markdown'
import { StarterKit } from '@tiptap/starter-kit'
import { suggestionItems } from '@/config/suggestion-menu'
import { CodeBlock } from './codeblock'
import { filterCommandItems, SlashCommands } from './commands'
import { FileHandler } from './file-handler'
import { HeadingAnchors } from './heading-anchors'
import { Image } from './image'
import { Link } from './link'
import {
  defaultLinkNavigationOptions,
  type LinkNavigationOptions,
} from './link/link-options'
import { MathExtension } from './math'
import { Table } from './table'
import { Underline } from './underline'

/**
 * Built fresh per Editor instance (see components/editor/Editor.tsx) so
 * Link can be configured with the currently open Note's own resolution
 * context (ADR-0011) — everything else is shared, static configuration.
 */
export const createExtensions = (linkOptions: LinkNavigationOptions) => [
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
  Link.configure(linkOptions),
  HeadingAnchors,
  Table,
  Markdown,
]

/**
 * The same extension set with no Note/Root context — for headless use
 * (markdown-only parsing/serialization in migration, schema-only editors in
 * tests) where a Note Link can never actually be followed.
 */
export const Extensions = createExtensions(defaultLinkNavigationOptions)
