import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { VariantProps } from 'class-variance-authority'
import { Check, Copy } from 'lucide-react'
import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from './button'

type CopyButtonProps = Omit<
  ButtonPrimitive.Props,
  'children' | 'onCopy' | 'onClick'
> &
  VariantProps<typeof buttonVariants> & {
    content: string
    delay?: number
    isCopied?: boolean
    onCopy?: (content: string) => boolean | void
    onCopyChange?: (isCopied: boolean) => void
  }

export const CopyButton = ({
  variant,
  size = 'icon',
  className,
  content,
  isCopied,
  delay = 3000,
  onCopy,
  onCopyChange,
  ...props
}: CopyButtonProps) => {
  const [localIsCopied, setLocalIsCopied] = useState(isCopied ?? false)
  const Icon = localIsCopied ? Check : Copy

  const handleIsCopied = useCallback(
    (isCopied: boolean) => {
      setLocalIsCopied(isCopied)
      onCopyChange?.(isCopied)
    },
    [onCopyChange],
  )

  const handleCopy = useCallback(() => {
    if (isCopied) return
    if (!content) return

    const shouldCopy = onCopy?.(content)
    if (shouldCopy === false) return

    navigator.clipboard
      .writeText(content)
      .then(() => {
        handleIsCopied(true)
        setTimeout(() => handleIsCopied(false), delay)
      })
      .catch((error) => {
        console.error('Error copying command', error)
      })
  }, [content, delay, onCopy, handleIsCopied, isCopied])

  return (
    <ButtonPrimitive
      data-slot="copy-button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleCopy}
      {...props}
    >
      <Icon
        className={cn(
          'size-3.5',
          localIsCopied && 'animate-[pop_0.5s_ease-in-out]',
        )}
      />
    </ButtonPrimitive>
  )
}
