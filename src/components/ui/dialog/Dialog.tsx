import cn from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

interface Props {
  isOpen: boolean;
  className?: string;
  dialogClassName?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export const Dialog = ({
  isOpen,
  className,
  dialogClassName,
  onClose,
  children,
}: Props) => {
  const [isDialogOpen, setDialogOpen] = useState(isOpen);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const handleClose = () => {
    onClose?.();
    setDialogOpen(false);
  };

  useEffect(() => {
    setDialogOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isDialogOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isDialogOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          handleClose();
        }
      }}
      className={cn(
        "h-[85vh] w-[calc(100%-2rem)] max-w-5xl rounded-md border border-border bg-background text-foreground outline-none backdrop:bg-neutral-950/50 backdrop:backdrop-blur-[1px]",
        dialogClassName,
      )}
    >
      <div className={cn("h-full px-4 py-2", className)}>{children}</div>
    </dialog>
  );
};
