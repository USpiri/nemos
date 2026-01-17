import {
  LinkComponentProps,
  Link as LinkPrimitive,
} from '@tanstack/react-router'
import { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { buttonVariants } from './button'

function Link({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: VariantProps<typeof buttonVariants> & LinkComponentProps) {
  return (
    <LinkPrimitive
      data-slot="link"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Link }
