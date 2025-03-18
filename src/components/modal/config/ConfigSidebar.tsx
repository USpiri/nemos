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
        "inline-flex w-full items-center gap-2 rounded-sm px-3 py-1.5 text-foreground-muted transition-all hover:bg-background-secondary-hover hover:text-foreground active:scale-95",
        isActive &&
          "bg-background-secondary-alt text-foreground active:scale-100 active:text-foreground",
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
    <div className="flex h-full w-64 flex-col gap-1 border-r border-border bg-background-secondary p-2 text-sm">
      {children}
    </div>
  );
};
