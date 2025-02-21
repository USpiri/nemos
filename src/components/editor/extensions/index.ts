import Focus from "@tiptap/extension-focus";
import Placeholder from "@tiptap/extension-placeholder";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import StarterKit from "@tiptap/starter-kit";
import AutoJoiner from "tiptap-extension-auto-joiner";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import { CodeBlock } from "./codeblock";
import { FileHandler } from "./file-handler";
import { Image } from "./image";
import { MarkLink } from "./link";
import { Math } from "./math";
import { SlashCommands } from "./slash-command";
import { Table } from "./table";

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
  Table,
  TableRow,
  TableHeader,
  TableCell,
  FileHandler,
  SlashCommands,
  Focus,
  AutoJoiner,
  GlobalDragHandle,
];
