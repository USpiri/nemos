import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const h1Variants = cva(
  "scroll-m-20 font-semibold tracking-tight text-balance",
  {
    variants: {
      size: {
        default: "text-3xl",
        sm: "text-2xl",
        lg: "text-4xl",
      },
    },
  },
);

export const H1 = ({
  children,
  size = "default",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof h1Variants>) => {
  return (
    <h1 className={cn(h1Variants({ size }), props.className)} {...props}>
      {children}
    </h1>
  );
};

export const H2 = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0",
        props.className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

export const H3 = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        props.className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

export const H4 = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-lg font-semibold tracking-tight",
        props.className,
      )}
      {...props}
    >
      {children}
    </h4>
  );
};

const textVariants = cva("leading-7 not-first:mt-6", {
  variants: {
    variant: {
      default: "",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
    },
  },
});

export const P = ({
  children,
  variant = "default",
  size = "default",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof textVariants>) => {
  return (
    <p
      className={cn(textVariants({ variant, size }), props.className)}
      {...props}
    >
      {children}
    </p>
  );
};

export const Blockquote = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) => {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", props.className)}
      {...props}
    >
      {children}
    </blockquote>
  );
};

export const Code = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  return (
    <code
      className={cn(
        "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-xs",
        props.className,
      )}
      {...props}
    >
      {children}
    </code>
  );
};
