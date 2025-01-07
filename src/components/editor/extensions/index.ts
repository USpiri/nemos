import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import StarterKit from "@tiptap/starter-kit";
import lowlight from "./lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Math } from "./math";

export const Extensions = [
  StarterKit.configure({ codeBlock: false }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Placeholder.configure({
    placeholder: "Write something...",
  }),
  CodeBlockLowlight.extend({ excludes: "math" }).configure({
    lowlight,
    defaultLanguage: "plaintext",
  }),
  Math,
];
