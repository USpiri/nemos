import Focus from "@tiptap/extension-focus";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import StarterKit from "@tiptap/starter-kit";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import { CodeBlock } from "./codeblock";
import { Math } from "./math";

export const Extensions = [
  StarterKit.configure({ codeBlock: false }),
  Focus,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Placeholder.configure({
    placeholder: "Write something...",
  }),
  CodeBlock,
  Math,
  GlobalDragHandle,
];
