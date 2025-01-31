import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import lowlight from "../lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Mermaid } from "../mermaid/Mermaid";
import { CodeBlock as CodeBlockComponent } from "./CodeBlock";
import { Smiles } from "../smiles/Smiles";

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

        switch (language) {
          case "mermaid":
            return ReactNodeViewRenderer(Mermaid)(props);

          case "smiles":
            return ReactNodeViewRenderer(Smiles)(props);

          default:
            return ReactNodeViewRenderer(CodeBlockComponent)(props);
        }
      };
    },
  });
