import { Node, mergeAttributes } from "@tiptap/react";
import MathNodeView from "./math-nodeview";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    mathDisplay: {
      toggleMathDisplay: () => ReturnType;
      setMathDisplay: () => ReturnType;
    };
  }
}

const name = "math-inline";
const tag = "math-inline";
const inputRule = /\$([^\s])([^$]*)\$$/;

export const MathInline = Node.create({
  name,
  group: "inline math",
  content: "text*",
  marks: "",
  inline: true,
  selectable: true,

  parseHTML() {
    return [{ tag }];
  },

  renderHTML({ HTMLAttributes }) {
    return [tag, mergeAttributes(HTMLAttributes), 0];
  },

  addAttributes() {
    return {
      showSource: {
        default: false,
      },
    };
  },

  addInputRules() {
    return [
      {
        find: inputRule,
        type: this.type,
        handler({ range, match, chain, state }) {
          const start = range.from;
          let end = range.to;

          if (match[2]) {
            const text = state.schema.text(match[2]);
            chain()
              .command(({ tr }) => {
                //@ts-ignore
                tr.replaceRangeWith(start, end, this.type.create(null, text));
                return true;
              })
              .run();
          }
        },
      },
    ];
  },

  addNodeView() {
    return (props) => new MathNodeView(props, true);
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          let isMath = false;
          const { selection } = state;
          const { empty, anchor } = selection;
          if (!empty) {
            return false;
          }
          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (
              node.type.name === this.name &&
              pos + node.nodeSize === anchor
            ) {
              isMath = true;
              tr.insertText("$" + (node.textContent || "") + "$", pos, anchor);
            }
          });
          return isMath;
        }),
    };
  },
});
