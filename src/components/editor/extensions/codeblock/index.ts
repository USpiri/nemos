import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import lowlight from "../lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Mermaid } from "../mermaid/Mermaid";
import { CodeBlock as CodeBlockComponent } from "./CodeBlock";

export const CodeBlock = CodeBlockLowlight.extend({ excludes: "math" })
  .configure({
    lowlight,
    defaultLanguage: "plaintext",
  })
  .extend({
    addNodeView() {
      return (props) => {
        const { node } = props;
        const language = node.attrs.language;
        return language === "mermaid"
          ? ReactNodeViewRenderer(Mermaid)(props)
          : ReactNodeViewRenderer(CodeBlockComponent)(props);
      };
    },
  });
