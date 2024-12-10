import cn from "@/utils/cn";

// TODO:
// - Change bg colors to variables
// - Add variables and sizes

export const Button = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "hover:text-foreground-darker rounded p-1.5 text-foreground-muted transition-all hover:bg-background-primary-hover active:scale-95 active:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
