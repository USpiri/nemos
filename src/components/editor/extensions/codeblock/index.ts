import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import lowlight from "./lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CodeBlock as CodeBlockComponent } from "./CodeBlock";

export const CodeBlock = CodeBlockLowlight.configure({
  lowlight,
  defaultLanguage: "plaintext",
}).extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent, {
      contentDOMElementTag: "code",
    });
  },
});
