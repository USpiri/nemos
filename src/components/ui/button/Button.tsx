import cn from "@/utils/cn";

export const Button = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "rounded p-1.5 text-stone-400 transition-all hover:bg-neutral-700/30 hover:text-stone-200 active:scale-95 active:text-stone-400",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
