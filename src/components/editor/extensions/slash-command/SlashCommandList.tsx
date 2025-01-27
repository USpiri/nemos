import { SuggestionItem } from "@/models/suggestion.interface";
import cn from "@/utils/cn";
import { NodeViewRendererProps, Range } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";

interface Props extends NodeViewRendererProps {
  items: SuggestionItem[];
  range: Range;
  query: string;
}

export const SlashCommandList = ({ items, query, editor, range }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter((i) => {
    const lowerQuery = query.toLowerCase();
    return (
      i.title.toLowerCase().includes(lowerQuery) ||
      i.searchTerms?.some((term) => term.toLowerCase().includes(lowerQuery))
    );
  });

  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter", "Escape"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (!navigationKeys.includes(e.key)) return;
      if (e.key === "Escape")
        return document.removeEventListener("keydown", onKeyDown, true);

      e.preventDefault();

      const key = e.key;

      if (key === "Enter") {
        console.log(selectedIndex);
        filteredItems[selectedIndex].command?.({ editor, range });
      } else {
        setSelectedIndex((index) => {
          const next = index + (key === "ArrowUp" ? -1 : 1);
          if (next === filteredItems.length) return 0;
          if (next === -1) return filteredItems.length - 1;
          return next;
        });
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [selectedIndex, filteredItems]);

  useEffect(() => {
    if (listRef.current) {
      const selectedButton = listRef.current.querySelector<HTMLButtonElement>(
        `[data-index="${selectedIndex}"]`,
      );
      selectedButton?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <aside
      ref={listRef}
      className="slash-menu max-h-72 min-w-56 overflow-auto rounded-sm border border-border bg-background-primary shadow-md"
    >
      {filteredItems.length !== 0 &&
        filteredItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "slash-menu-item flex w-full items-center gap-2 px-2 py-1",
              index === selectedIndex && "bg-background-primary-hover",
            )}
            data-index={index}
            onClick={() => item.command?.({ editor, range })}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <item.icon className="slash-menu-item-icon size-4" />
            <span className="slash-menu-item-title">{item.title}</span>
          </button>
        ))}
      {!filteredItems.length && <p className="px-2 py-1">No items found</p>}
    </aside>
  );
};
