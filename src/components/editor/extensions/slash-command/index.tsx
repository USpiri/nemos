import { suggestionItems } from "@/config/suggestion-menu";
import { Extension } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import { renderItems } from "./renderer";

const SlashCommand = Extension.create({
  name: "slash-commands",
  addOptions() {
    return {
      suggestion: {
        char: "/",
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,

        // Show suggestion only on the start of a paragraph node.
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          const isRootDepth = $from.depth === 1;
          const isParagraph = $from.parent.type.name === "paragraph";
          const isStartOfLine = $from.parent.textContent.charAt(0) === "/";
          // const isInColumn = this.editor.isActive('column');
          const afterContent = $from.parent.textContent.substring(
            $from.parent.textContent.indexOf("/"),
          );
          const isValidAfterContent = !afterContent.endsWith("  ");

          return (
            isRootDepth && isParagraph && isStartOfLine && isValidAfterContent
          );
        },
      }),
    ];
  },
});

export const SlashCommands = SlashCommand.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});
