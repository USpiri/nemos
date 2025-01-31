import Focus from "@tiptap/extension-focus";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import StarterKit from "@tiptap/starter-kit";
import AutoJoiner from "tiptap-extension-auto-joiner";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import { CodeBlock } from "./codeblock";
import { FileHandler } from "./file-handler";
import { MarkLink } from "./link";
import { Math } from "./math";
import { SlashCommands } from "./slash-command";

export const Extensions = [
  StarterKit.configure({
    codeBlock: false,
    dropcursor: { class: "dropcursor" },
  }),
  MarkLink,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  CodeBlock,
  Placeholder.configure({
    placeholder: 'Write something or type "/" for commands...',
  }),
  Math,
  Image.configure({
    allowBase64: true,
  }),
  FileHandler,
  SlashCommands,
  Focus,
  AutoJoiner,
  GlobalDragHandle,
];
