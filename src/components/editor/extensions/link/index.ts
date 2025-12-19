/**
 * This code is adapted from the Typist project by Doist.
 * Original source: https://github.com/Doist/typist/blob/main/src/extensions/rich-text/rich-text-link.ts
 */

import { openUrl } from "@tauri-apps/plugin-opener";
import {
  Link as LinkExtension,
  type LinkOptions,
} from "@tiptap/extension-link";
import { Plugin } from "@tiptap/pm/state";
import { InputRule, markInputRule } from "@tiptap/react";

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

export const Link = LinkExtension.extend<LinkOptions>({
  inclusive: false,

  addOptions() {
    return {
      ...(this.parent?.() as LinkOptions),
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

  addProseMirrorPlugins() {
    let hoveredElement: HTMLElement | null = null;
    return [
      new Plugin({
        props: {
          /*
           * Ctrl + click to open on edit mode
           * Click to open on read-only mode
           * */
          handleClick(view, _pos, event) {
            if (!view.editable) return false;
            if (!event.ctrlKey) return false;

            const element = event.target as HTMLElement;
            const target = (
              element.matches("a") ? event.target : element.parentElement
            ) as HTMLAnchorElement;
            if (target.tagName !== "A" && !target.hasAttribute("href"))
              return false;

            const url = target.href;
            openUrl(url);
          },

          handleDOMEvents: {
            /*
             * Prevent default anchor behaviour
             * https://github.com/tauri-apps/tauri/issues/2791
             * */
            click: (view, event) => {
              if (!view.editable) return;

              const element = event.target as HTMLElement;
              const target = (
                element.matches("a") ? event.target : element.parentElement
              ) as HTMLAnchorElement;
              if (target.tagName === "A" && target.hasAttribute("href")) {
                event.preventDefault();
                event.stopPropagation();
              }
            },

            /*
             * cursor-pointer on ctrl + key + hover
             * */
            mouseover: (_, event) => {
              const element = event.target as HTMLElement;
              const target = (
                element.matches("a") ? event.target : element.parentElement
              ) as HTMLAnchorElement;
              if (target.tagName === "A" && target.hasAttribute("href")) {
                hoveredElement = target;
                if (event.ctrlKey) target.classList.add("cursor-pointer");
              }
            },
            mouseout: (_, event) => {
              const element = event.target as HTMLElement;
              const target = (
                element.matches("a") ? event.target : element.parentElement
              ) as HTMLAnchorElement;
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
