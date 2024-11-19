import cn from "@/utils/cn";

export const Button = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "rounded p-1 transition-all hover:bg-neutral-700/30 active:scale-95",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
