import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Focus, Placeholder, Selection } from "@tiptap/extensions";
import { CodeBlock } from "./codeblock";
import { StarterKit } from "@tiptap/starter-kit";
import { SlashCommands, filterCommandItems } from "./commands";
import { suggestionItems } from "@/config/suggestion-menu";

export const Extensions = [
  StarterKit.configure({
    codeBlock: false,
    dropcursor: { class: "dropcursor" },
  }),
  Selection,
  Focus,
  Placeholder.configure({
    placeholder: 'Write something or type "/" for commands...',
  }),
  TaskList,
  TaskItem,
  CodeBlock,
  SlashCommands.configure({
    commandItems: suggestionItems,
    suggestion: {
      items: ({ query }: { query: string }) =>
        filterCommandItems(query, suggestionItems),
    },
  }),
];
