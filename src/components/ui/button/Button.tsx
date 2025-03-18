import cn from "@/utils/cn";

// TODO:
// - Add variables and sizes

export const Button = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "hover:text-foreground-darker text-foreground-muted hover:bg-background-primary-hover active:text-foreground cursor-pointer rounded-sm p-1.5 transition-all active:scale-95",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
