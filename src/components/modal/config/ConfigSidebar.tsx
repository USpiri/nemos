import cn from "@/utils/cn";

interface Props {
  isActive: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const ConfigSidebarItem = ({ isActive, onClick, children }: Props) => {
  return (
    <button
      className={cn(
        "inline-flex w-full items-center gap-2 rounded px-3 py-1.5 text-foreground-darker transition-all hover:bg-neutral-700/30 hover:text-foreground active:scale-95 active:text-foreground-darker",
        isActive &&
          "bg-neutral-700/30 text-foreground active:scale-100 active:text-foreground",
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
    <div className="flex h-full w-64 flex-col gap-1 border-r border-border bg-neutral-900 p-2 text-sm">
      {children}
    </div>
  );
};
