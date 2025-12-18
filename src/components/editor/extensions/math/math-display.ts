import { mergeAttributes, Node, textblockTypeInputRule } from "@tiptap/react";
import MathNodeView from "./math-nodeview";
import { TextSelection } from "@tiptap/pm/state";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    mathDisplay: {
      toggleMathDisplay: () => ReturnType;
      setMathDisplay: () => ReturnType;
    };
  }
}

const name = "math-display";
const tag = "math-display";
const inputRule = /^(\$\$)[\s]$/;

export const MathDisplay = Node.create({
  name,
  group: "block math",
  content: "text*",
  draggable: true,
  inline: false,
  code: true,

  parseHTML() {
    return [{ tag }];
  },

  renderHTML({ HTMLAttributes }) {
    return [tag, mergeAttributes(HTMLAttributes), 0];
  },

  addInputRules() {
    return [textblockTypeInputRule({ find: inputRule, type: this.type })];
  },

  addAttributes() {
    return {
      showSource: {
        default: true,
      },
    };
  },

  addNodeView() {
    return (props) => new MathNodeView(props);
  },

  addCommands() {
    return {
      toggleMathDisplay:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph", {
            showSource: true,
          });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      // if the user presses the right arrow or enter key and there's no node after, create one
      ArrowDown: ({ editor }) => {
        const { empty, $anchor } = editor.state.selection;
        if (!empty || $anchor.parent.type.name !== this.name) {
          return false;
        }

        const posAfter = $anchor.after();
        const pos = editor.state.tr.doc.resolve(posAfter);
        if (!pos.nodeAfter || pos.nodeAfter.type.name == "footnotes") {
          return editor.commands.command(({ tr }) => {
            const paragraph = editor.state.schema.nodes.paragraph.create();
            tr.insert(posAfter, paragraph);

            const resolvedPos = tr.doc.resolve(posAfter + 1);
            tr.setSelection(TextSelection.near(resolvedPos));
            return true;
          });
        }
        return false;
      },

      Enter: ({ editor }) => {
        const { $from, empty } = editor.state.selection;
        if (!empty || $from.parent.type !== this.type) {
          return false;
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
        const endsWithDoubleNewline = $from.parent.textContent.endsWith("\n");
        const hasContent = !!$from.parent.textContent.trim();

        if (!isAtEnd || !endsWithDoubleNewline) {
          return false;
        }

        return editor
          .chain()
          .command(({ tr }) => {
            tr.delete($from.pos - (hasContent ? 1 : 3), $from.pos);
            return true;
          })
          .exitCode()
          .run();
      },
    };
  },
});
