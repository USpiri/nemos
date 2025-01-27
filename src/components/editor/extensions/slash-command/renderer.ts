import { Editor, ReactRenderer } from "@tiptap/react";
import tippy, { GetReferenceClientRect, Instance, Props } from "tippy.js";
import { SlashCommandList } from "./SlashCommandList";

export const renderItems = (elementRef?: React.RefObject<Element> | null) => {
  let component: ReactRenderer | null = null;
  let popup: Instance<Props>[] | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new ReactRenderer(SlashCommandList, {
        props,
        editor: props.editor,
      });

      const { selection } = props.editor.state;
      const parentNode = selection.$from.node(selection.$from.depth);
      const blockType = parentNode.type.name;

      if (!props.clientRect) {
        return;
      }

      if (blockType === "codeBlock") {
        return false;
      }

      //@ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => (elementRef ? elementRef.current : document.body),
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
        duration: 200,
      });
    },

    onUpdate: (props: {
      editor: Editor;
      clientRect: GetReferenceClientRect;
    }) => {
      component?.updateProps(props);
      if (!props.clientRect) {
        return;
      }
      popup?.[0]?.setProps({
        getReferenceClientRect: props.clientRect,
      });
    },

    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === "Escape") {
        popup?.[0]?.hide();
        return true;
      }

      // @ts-ignore
      return component?.ref?.onKeyDown(props);
    },

    onExit: () => {
      popup?.[0]?.destroy();
      component?.destroy();
    },
  };
};
