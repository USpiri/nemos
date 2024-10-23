import { useCallback, useEffect, useRef, useState } from "react";

export const Sidebar = () => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(268);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        setWidth(
          mouseMoveEvent.clientX -
            sidebarRef?.current!.getBoundingClientRect().left,
        );
      }
    },
    [isResizing],
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div
      className="relative grid min-w-40 max-w-80 grid-rows-[auto_1fr_auto] border-r border-neutral-800 print:hidden"
      ref={sidebarRef}
      style={{ width: width }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="h-11 border-b border-neutral-800">Sidebar Title</div>
      <div>Sidebar Content</div>
      <div className="h-11 border-t border-neutral-800">Sidebar Footer</div>
      <div
        className="absolute right-0 top-0 h-full w-1.5 border-r-[3px] border-transparent transition-colors hover:cursor-ew-resize active:border-emerald-700"
        onMouseDown={startResizing}
      />
    </div>
  );
};
