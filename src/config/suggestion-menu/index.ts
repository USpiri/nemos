import { createSuggestionItems } from "@/utils/editor/sugesstion";
import {
  ChartLine,
  Code,
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
} from "lucide-react";

export const suggestionItems = createSuggestionItems([
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large"],
    icon: Heading1,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        //@ts-ignore
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: Heading2,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        //@ts-ignore
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["small", "section"],
    icon: Heading3,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        //@ts-ignore
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
  },
  {
    title: "Heading 4",
    description: "Small section heading.",
    searchTerms: ["small", "section"],
    icon: Heading4,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        //@ts-ignore
        .deleteRange(range)
        .setNode("heading", { level: 4 })
        .run();
    },
  },
  {
    title: "Heading 5",
    description: "Small section heading.",
    searchTerms: ["small", "section"],
    icon: Heading5,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        //@ts-ignore
        .deleteRange(range)
        .setNode("heading", { level: 5 })
        .run();
    },
  },
  {
    title: "Heading 6",
    description: "Small section heading.",
    searchTerms: ["small", "section"],
    icon: Heading6,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        //@ts-ignore
        .deleteRange(range)
        .setNode("heading", { level: 6 })
        .run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a bullet list.",
    searchTerms: ["list", "bullet", "unordered"],
    icon: List,
    command: ({ editor, range }) => {
      //@ts-ignore
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a numbered list.",
    searchTerms: ["list", "numbered", "ordered"],
    icon: ListOrdered,
    command: ({ editor, range }) => {
      //@ts-ignore
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Task List",
    description: "Create a task list.",
    searchTerms: ["list", "todo", "checkbox"],
    icon: ListTodo,
    command: ({ editor, range }) => {
      //@ts-ignore
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Blockquote",
    description: "Add a blockquote.",
    searchTerms: ["quote", "citation"],
    icon: Quote,
    command: ({ editor, range }) => {
      //@ts-ignore
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: "Code Block",
    description: "Insert a code block.",
    searchTerms: ["snippet"],
    icon: Code,
    command: ({ editor, range }) => {
      //@ts-ignore
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: "Math Block",
    description: "Insert a math block.",
    searchTerms: ["math", "block", "formula"],
    icon: Sigma,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        //@ts-ignore
        .deleteRange(range)
        .insertContent("<math-display></math-display>")
        .run();
    },
  },
  {
    title: "Mermaid Diagram",
    description: "Insert a Mermaid diagram.",
    searchTerms: ["chart", "pie"],
    icon: ChartLine,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        // @ts-ignore
        .deleteRange(range)
        .toggleCodeBlock({ language: "mermaid" })
        // .setNode("codeBlock", { language: "mermaid" })
        .run();
    },
  },
  {
    title: "Horizontal Rule",
    description: "Insert a horizontal line.",
    searchTerms: ["divider", "line", "hr"],
    icon: Minus,
    command: ({ editor, range }) => {
      //@ts-ignore
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
]);
