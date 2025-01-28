/**
 * This code is adapted from the Typist project by Doist.
 * Original source: https://github.com/Doist/typist/blob/main/src/extensions/rich-text/rich-text-link.ts
 */

import Link, { type LinkOptions } from "@tiptap/extension-link";
import { Plugin } from "@tiptap/pm/state";
import {
  InputRule,
  markInputRule,
  markPasteRule,
  PasteRule,
} from "@tiptap/react";

function linkPasteRule(config: Parameters<typeof markPasteRule>[0]) {
  const defaultMarkPasteRule = markPasteRule(config);

  return new PasteRule({
    find: config.find,
    handler(props) {
      const { tr } = props.state;

      defaultMarkPasteRule.handler(props);
      tr.setMeta("preventAutolink", true);
    },
  });
}

function linkInputRule(config: Parameters<typeof markInputRule>[0]) {
  const defaultMarkInputRule = markInputRule(config);

  return new InputRule({
    find: config.find,
    handler(props) {
      const { tr } = props.state;

      defaultMarkInputRule.handler(props);
      tr.setMeta("preventAutolink", true);
    },
  });
}

const inputRegex = /(?:^|\s)\[([^\]]*)?\]\((\S+)(?: ["“](.+)["”])?\)$/i;
const pasteRegex = /(?:^|\s)\[([^\]]*)?\]\((\S+)(?: ["“](.+)["”])?\)/gi;

const MarkLink = Link.extend<LinkOptions>({
  inclusive: false,

  addOptions() {
    return {
      ...this.parent?.()!,
      openOnClick: "whenNotEditable",
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      title: {
        default: null,
      },
    };
  },

  addInputRules() {
    return [
      linkInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes(match) {
          return {
            title: match.pop()?.trim(),
            href: match.pop()?.trim(),
          };
        },
      }),
    ];
  },

  addPasteRules() {
    return [
      linkPasteRule({
        find: pasteRegex,
        type: this.type,
        getAttributes(match) {
          return {
            title: match.pop()?.trim(),
            href: match.pop()?.trim(),
          };
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    let hoveredElement: HTMLElement | null = null;
    return [
      new Plugin({
        props: {
          handleClick(view, _pos, event) {
            if (!view.editable) return false;
            if (!event.ctrlKey) return false;
            // TODO: handle open link on external browser
            console.log(event.target);
          },
          handleDOMEvents: {
            mouseover: (_, event) => {
              const target = event.target as HTMLElement;
              if (target.tagName === "A" && target.hasAttribute("href")) {
                hoveredElement = target;
                if (event.ctrlKey) target.classList.add("cursor-pointer");
              }
            },
            mouseout: (_, event) => {
              const target = event.target as HTMLElement;
              if (target.tagName === "A" && target.hasAttribute("href")) {
                target.classList.remove("cursor-pointer");
                hoveredElement = null;
              }
            },
            keydown: (_, event) => {
              if (event.key === "Control" && hoveredElement) {
                hoveredElement.classList.add("cursor-pointer");
              }
            },
            keyup: (_, event) => {
              if (event.key === "Control" && hoveredElement) {
                hoveredElement.classList.remove("cursor-pointer");
              }
            },
          },
        },
      }),
    ];
  },
});

export { MarkLink };
