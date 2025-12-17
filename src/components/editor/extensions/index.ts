import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Focus, Placeholder, Selection } from "@tiptap/extensions";
import { CodeBlock } from "./codeblock";
import { StarterKit } from "@tiptap/starter-kit";

export const Extensions = [
  StarterKit.configure({
    codeBlock: false,
    dropcursor: { class: "dropcursor" },
  }),
  Selection,
  Focus,
  Placeholder,
  TaskList,
  TaskItem,
  CodeBlock,
];
