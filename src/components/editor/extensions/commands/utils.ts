import { CommandItem } from "@/types";
import { computePosition, flip, shift } from "@floating-ui/dom";
import { Editor, posToDOMRect } from "@tiptap/react";

export const filterCommandItems = (query: string, items: CommandItem[]) => {
  const normalizedQuery = query.toLowerCase().trim();
  if (normalizedQuery.length === 0) return items;
  return items.filter((item) => {
    return (
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
      item.description?.toLowerCase().includes(normalizedQuery)
    );
  });
};

export const updatePosition = (editor: Editor, element: HTMLElement) => {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(
        editor.view,
        editor.state.selection.from,
        editor.state.selection.to,
      ),
  };

  computePosition(virtualElement, element, {
    placement: "bottom-start",
    strategy: "absolute",
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = "max-content";
    element.style.position = strategy;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  });
};
