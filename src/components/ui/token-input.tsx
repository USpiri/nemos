import { XIcon } from 'lucide-react'
import { createContext, RefObject, useContext, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/index'

interface TokenInputContextValue {
  inputRef: RefObject<HTMLInputElement | null>
}

const TokenInputContext = createContext<TokenInputContextValue | null>(null)
function useTokenInputContext() {
  const context = useContext(TokenInputContext)

  if (!context) {
    throw new Error(
      'TokenInput components must be used within <TokenInputRoot>',
    )
  }

  return context
}

function TokenInput({
  className,
  onClick,
  ...props
}: React.ComponentProps<'div'>) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <TokenInputContext.Provider value={{ inputRef }}>
      <div
        data-slot="token-input"
        role="group"
        className={cn(
          'relative flex h-auto min-h-8 w-full cursor-text flex-wrap items-center gap-1 rounded-lg border border-input px-1.5 py-1 outline-none transition-colors has-[[data-slot=token-input-field]:focus-visible]:border-ring has-[[data-slot][aria-invalid=true]]:border-destructive has-disabled:opacity-50 has-[[data-slot=token-input-field]:focus-visible]:ring-[3px] has-[[data-slot=token-input-field]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:ring-[3px] has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:bg-input/30 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',
          className,
        )}
        onClick={(e) => {
          inputRef.current?.focus()
          onClick?.(e)
        }}
        {...props}
      />
    </TokenInputContext.Provider>
  )
}

function TokenInputChip({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="token-input-chip"
      className={cn(
        'flex h-[calc(--spacing(5.25))] shrink-0 items-center gap-1 whitespace-nowrap rounded-sm bg-muted px-1.5 font-medium text-foreground text-xs',
        className,
      )}
      {...props}
    />
  )
}

function TokenInputTokenRemove({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      className={cn('-ml-1 opacity-50 hover:opacity-100', className)}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
      }}
      {...props}
    >
      <XIcon className="pointer-events-none size-3" />
    </Button>
  )
}

function TokenInputField({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  const { inputRef } = useTokenInputContext()
  return (
    <Input
      ref={inputRef}
      data-slot="token-input-field"
      className={cn(
        'h-auto min-h-0 min-w-16 flex-1 rounded-none border-0 bg-transparent px-0 py-0 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent',
        className,
      )}
      {...props}
    />
  )
}

export { TokenInput, TokenInputChip, TokenInputTokenRemove, TokenInputField }
