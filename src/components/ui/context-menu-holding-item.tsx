import { cn } from "@/utils/cn";
import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { ContextMenuItem } from "./context-menu";

interface Props {
  onCompleteHolding: () => void;
  label: string;
  icon?: ReactNode;
  time?: number;
  holdingLabel?: string;
  color?: string;
  escape?: boolean;
}

const INTERVAL_MS = 10;

export function ContextMenuHoldingItem({
  onCompleteHolding,
  label,
  icon,
  time = 1000,
  holdingLabel = "Hold to confirm",
  color = "var(--background-primary-alt",
  escape = true,
  ...props
}: React.ComponentProps<typeof ContextMenuItem> & Props) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [counter, setCounter] = useState(0);
  const STEP_INCREMENT = 100 / (time / INTERVAL_MS);

  const startCounter = (e: MouseEvent<HTMLDivElement>) => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter < 100) {
          return prevCounter + STEP_INCREMENT;
        } else {
          stopCounter(true);
          if (escape) {
            setTimeout(() => {
              const target = e.target as HTMLElement;
              target.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Escape" }),
              );
            }, 0);
          }
          return 0;
        }
      });
    }, INTERVAL_MS);
  };

  const stopCounter = (completed = false) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (completed) {
      onCompleteHolding();
    }
    setCounter(0);
  };

  useEffect(() => {
    return () => stopCounter();
  }, []);

  return (
    <ContextMenuItem
      onClick={(e) => {
        e.preventDefault();
      }}
      onMouseDown={startCounter}
      onMouseUp={() => stopCounter()}
      onMouseLeave={() => stopCounter()}
      {...props}
    >
      <div className="z-10 flex items-center">
        {icon}
        <p className="relative">
          <span className="flex items-center">
            <span
              className={cn(
                "origin-bottom [transform:rotateX(0deg)] transition-transform",
                counter > 5 && "[transform:rotateX(-90deg)]",
              )}
            >
              {label}
            </span>
            <span
              className={cn(
                "absolute left-0 origin-top [transform:rotateX(90deg)] text-nowrap transition-transform",
                counter > 5 && "[transform:rotateX(0deg)]",
              )}
            >
              {holdingLabel}
            </span>
          </span>
        </p>
      </div>
      <div
        className="bg-destructive absolute top-0 left-0 h-full rounded-xs transition-all ease-out"
        style={{
          width: `${Math.round(counter)}%`,
          backgroundColor: color,
        }}
      />
    </ContextMenuItem>
  );
}
