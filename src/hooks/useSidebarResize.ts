import { useCallback, useEffect, useRef, useState } from "react";

export const useSidebarResize = (initialWidth = 250) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(initialWidth);

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
        sidebarRef.current?.classList.add("resizing");
      } else {
        sidebarRef.current?.classList.remove("resizing");
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

  return {
    width,
    startResizing,
    sidebarRef,
  };
};
