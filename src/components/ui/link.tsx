import { VariantProps } from "class-variance-authority";
import {
  LinkComponentProps,
  Link as LinkPrimitive,
} from "@tanstack/react-router";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";

function Link({
  className,
  variant = "default",
  size = "default",
  ...props
}: VariantProps<typeof buttonVariants> & LinkComponentProps) {
  return (
    <LinkPrimitive
      data-slot="link"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Link };
