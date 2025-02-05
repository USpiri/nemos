import { Button } from "@/components/ui/button/Button";
import cn from "@/utils/cn";
import { isNode } from "@/utils/editor";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  GripVertical,
  LucideIcon,
} from "lucide-react";
import { MouseEvent as ReactMouseEvent } from "react";

const MIN_WIDTH = 10;
const MAX_WIDTH = 100;

const alignButtons: {
  value: "start" | "end" | "center";
  icon: LucideIcon;
}[] = [
  { value: "start", icon: AlignLeft },
  { value: "center", icon: AlignCenter },
  { value: "end", icon: AlignRight },
];

export const ImageNodeView = ({
  node,
  editor,
  selected,
  getPos,
}: NodeViewProps) => {
  const onMouseDown = (e: ReactMouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;

    const parentWidth = e.currentTarget.parentElement?.offsetWidth || 1;
    const startWidth = (parseFloat(node.attrs.width) / 100) * parentWidth;

    const handleMouseMove = (event: MouseEvent) => {
      const newWidthPx = Math.min(
        (MAX_WIDTH / 100) * parentWidth,
        Math.max(
          (MIN_WIDTH / 100) * parentWidth,
          startWidth + (event.clientX - startX),
        ),
      );
      const newWidthPercent = (newWidthPx / parentWidth) * 100;
      editor
        .chain()
        .setImageWidth(`${Math.round(newWidthPercent)}%`)
        .run();
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <NodeViewWrapper>
      <div
        className="relative my-7 flex items-center"
        style={{ justifyContent: node.attrs.align }}
      >
        <img
          {...node.attrs}
          className={cn(
            selected && "outline outline-1 outline-foreground-select",
            "m-0 print:outline-none",
          )}
        />
        {editor.isEditable &&
          isNode(
            editor.state.selection.from,
            editor.state.selection.to,
            getPos(),
            node.nodeSize,
          ) && (
            <>
              <div
                role="button"
                tabIndex={0}
                onMouseDown={onMouseDown}
                className={cn(
                  !selected && "hidden",
                  "w-0 cursor-grab active:cursor-grabbing print:hidden",
                )}
              >
                <GripVertical className="size-4 text-foreground-muted hover:text-foreground" />
              </div>
              <div
                className="absolute bottom-full space-x-1 text-center print:hidden"
                style={{ width: node.attrs.width }}
              >
                {alignButtons.map((e) => (
                  <Button
                    key={e.value}
                    className="hover:bg-transparent hover:text-foreground"
                    onClick={() => editor.chain().setImageAlign(e.value).run()}
                  >
                    <e.icon className="size-4" />
                  </Button>
                ))}
              </div>
            </>
          )}
      </div>
    </NodeViewWrapper>
  );
};
