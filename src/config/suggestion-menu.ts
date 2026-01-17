import {
  ChartLine,
  Code,
  FlaskConical,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Quote,
  Sigma,
  Table,
} from 'lucide-react'
import { CommandItem } from '@/types'

export const suggestionItems: CommandItem[] = [
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    tags: ['title', 'big', 'large'],
    icon: Heading1,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run()
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    tags: ['subtitle', 'medium'],
    icon: Heading2,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run()
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    tags: ['small', 'section'],
    icon: Heading3,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run()
    },
  },
  {
    title: 'Heading 4',
    description: 'Small section heading.',
    tags: ['small', 'section'],
    icon: Heading4,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 4 })
        .run()
    },
  },
  {
    title: 'Heading 5',
    description: 'Small section heading.',
    tags: ['small', 'section'],
    icon: Heading5,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 5 })
        .run()
    },
  },
  {
    title: 'Heading 6',
    description: 'Small section heading.',
    tags: ['small', 'section'],
    icon: Heading6,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 6 })
        .run()
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a bullet list.',
    tags: ['list', 'bullet', 'unordered'],
    icon: List,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list.',
    tags: ['list', 'numbered', 'ordered'],
    icon: ListOrdered,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: 'Task List',
    description: 'Create a task list.',
    tags: ['list', 'todo', 'checkbox'],
    icon: ListTodo,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    },
  },
  {
    title: 'Blockquote',
    description: 'Add a blockquote.',
    tags: ['quote', 'citation'],
    icon: Quote,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    title: 'Code Block',
    description: 'Insert a code block.',
    tags: ['snippet'],
    icon: Code,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
  },
  {
    title: 'Math Block',
    description: 'Insert a math block.',
    tags: ['math', 'block', 'formula'],
    icon: Sigma,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent('<math-display></math-display>')
        .run()
    },
  },
  {
    title: 'Mermaid Diagram',
    description: 'Insert a Mermaid diagram.',
    tags: ['chart', 'pie'],
    icon: ChartLine,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleCodeBlock({ language: 'mermaid' })
        .run()
    },
  },
  {
    title: 'Chemical structure',
    description: 'Insert a SMILES chemical structure.',
    tags: ['science', 'molecule', 'atoms'],
    icon: FlaskConical,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleCodeBlock({ language: 'smiles' })
        .run()
    },
  },
  {
    title: 'Horizontal Rule',
    description: 'Insert a horizontal line.',
    tags: ['divider', 'line', 'hr'],
    icon: Minus,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
  {
    title: 'Table',
    description: 'Insert Table',
    tags: [],
    icon: Table,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 2, cols: 1, withHeaderRow: true })
        .run()
    },
  },
]
