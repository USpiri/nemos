import { cn } from "@/lib/utils";

interface Props {
  isActive: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const ConfigSidebarItem = ({ isActive, onClick, children }: Props) => {
  return (
    <button
      className={cn(
        "text-foreground-muted hover:bg-background-secondary-hover hover:text-foreground inline-flex w-full items-center gap-2 rounded-sm px-3 py-1.5 transition-all active:scale-95",
        isActive &&
          "bg-background-secondary-alt text-foreground active:text-foreground active:scale-100",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface ConfigSidebarProps {
  children?: React.ReactNode;
}

export const ConfigSidebar = ({ children }: ConfigSidebarProps) => {
  return (
    <div className="border-border bg-background-secondary flex h-full w-64 flex-col gap-1 border-r p-2 text-sm">
      {children}
    </div>
  );
};
