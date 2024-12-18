import { cn } from "@/utils/cn";
import {
  forwardRef,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
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

const ContextMenuHoldingItem = forwardRef<
  React.ElementRef<typeof ContextMenuItem>,
  Props
>(
  (
    {
      onCompleteHolding,
      label,
      icon,
      time = 1000,
      holdingLabel = "Hold to confirm",
      color = "var(--background-primary-alt",
      escape = true,
    },
    ref,
  ) => {
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
              const target = e.target;
              target.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Escape" }),
              );
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
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
        }}
        onMouseDown={startCounter}
        onMouseUp={() => stopCounter()}
        onMouseLeave={() => stopCounter()}
      >
        <div className="z-10 flex items-center">
          {icon}
          <p className="relative">
            <span className="flex items-center">
              <span
                className={cn(
                  "origin-bottom transition-transform [transform:rotateX(0deg)]",
                  counter > 5 && "[transform:rotateX(-90deg)]",
                )}
              >
                {label}
              </span>
              <span
                className={cn(
                  "absolute left-0 origin-top text-nowrap transition-transform [transform:rotateX(90deg)]",
                  counter > 5 && "[transform:rotateX(0deg)]",
                )}
              >
                {holdingLabel}
              </span>
            </span>
          </p>
        </div>
        <div
          className="absolute left-0 top-0 h-full rounded bg-destructive transition-all ease-out"
          style={{
            width: `${Math.round(counter)}%`,
            backgroundColor: color,
          }}
        />
      </ContextMenuItem>
    );
  },
);
ContextMenuHoldingItem.displayName = ContextMenuItem.displayName;
export { ContextMenuHoldingItem };
