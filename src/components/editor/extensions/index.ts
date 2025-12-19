import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Focus, Placeholder, Selection } from "@tiptap/extensions";
import { CodeBlock } from "./codeblock";
import { StarterKit } from "@tiptap/starter-kit";
import { SlashCommands, filterCommandItems } from "./commands";
import { suggestionItems } from "@/config/suggestion-menu";
import { Math } from "./math";
import { FileHandler } from "./file-handler";
import { Image } from "./image";
import { Link } from "./link";
import { Table } from "./table";

export const Extensions = [
  StarterKit.configure({
    codeBlock: false,
    link: false,
    dropcursor: { class: "dropcursor" },
  }),
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
  Math,
  Image,
  Link,
  Table,
];
