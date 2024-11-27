import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import StarterKit from "@tiptap/starter-kit";
import lowlight from "./lowlight";
import Placeholder from "@tiptap/extension-placeholder";

export const Extensions = [
  StarterKit.configure({ codeBlock: false }),
  Placeholder.configure({
    placeholder: "Write something...",
  }),
  CodeBlockLowlight.configure({ lowlight, defaultLanguage: "plaintext" }),
];
