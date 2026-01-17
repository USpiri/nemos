import { Field as FieldPrimitive } from '@base-ui/react/field'
import { Check, X } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

const EditableContext = createContext<{
  value: string
  defaultValue: string
  disabled: boolean
  isEditing: boolean
  autoFocus: boolean
  setValue: (value: string) => void
  setIsEditing: (isEditing: boolean) => void
  onSubmit: (value: string) => void
  onChange: (value: string) => void
  onCancel: () => void
} | null>(null)

function useEditableContext(component: string) {
  const context = useContext(EditableContext)
  if (!context) {
    throw new Error(`\`${component}\` must be used within \`Editable\``)
  }
  return context
}

interface EditableProps
  extends Omit<FieldPrimitive.Root.Props, 'onSubmit' | 'onChange'> {
  defaultValue?: string
  value?: string
  disabled?: boolean
  autoFocus?: boolean
  isEditing?: boolean
  onSubmit?: (value: string) => void
  onChange?: (value: string) => void
  onCancel?: () => void
}

function Editable({
  className,
  children,
  defaultValue = '',
  value: controlledValue,
  disabled = false,
  autoFocus = true,
  isEditing: isEditingProp = false,
  onSubmit: onSubmitProp,
  onChange: onChangeProp,
  onCancel: onCancelProp,
  ...props
}: EditableProps) {
  const [isEditing, setIsEditing] = useState(isEditingProp)
  const [internalValue, setInternalValue] = useState(defaultValue)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const setValue = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
    },
    [isControlled],
  )

  const handleSubmit = useCallback(
    (submitValue: string) => {
      setIsEditing(false)
      onSubmitProp?.(submitValue)
    },
    [onSubmitProp],
  )

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue)
      onChangeProp?.(newValue)
    },
    [setValue, onChangeProp],
  )

  const handleCancel = useCallback(() => {
    if (!isControlled) {
      setInternalValue(defaultValue)
    }
    setIsEditing(false)
    onCancelProp?.()
  }, [isControlled, defaultValue, onCancelProp])

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      handleSubmit(value)
    },
    [handleSubmit, value],
  )

  useEffect(() => {
    setInternalValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    setIsEditing(isEditingProp)
  }, [isEditingProp])

  return (
    <EditableContext.Provider
      value={{
        value,
        defaultValue,
        disabled,
        isEditing,
        autoFocus,
        setValue,
        setIsEditing,
        onSubmit: handleSubmit,
        onChange: handleChange,
        onCancel: handleCancel,
      }}
    >
      <FieldPrimitive.Root
        data-slot="editable-text-root"
        className={cn('flex w-full min-w-0 flex-1 items-center', className)}
        onSubmit={handleFormSubmit}
        disabled={disabled}
        {...props}
      >
        {children}
      </FieldPrimitive.Root>
    </EditableContext.Provider>
  )
}

interface EditableInputProps
  extends Omit<
    React.ComponentProps<'input'>,
    'onChange' | 'value' | 'defaultValue'
  > {}

function EditableInput({ className, onKeyDown, ...props }: EditableInputProps) {
  const {
    value,
    disabled,
    isEditing,
    autoFocus,
    onChange,
    onSubmit,
    onCancel,
    setIsEditing,
  } = useEditableContext('EditableInput')

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && autoFocus && inputRef.current) {
      inputRef.current.focus()
      // Select all text for easy replacement
      inputRef.current.select()
    }
  }, [isEditing, autoFocus])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSubmit(value)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
      onKeyDown?.(e)
    },
    [value, onSubmit, onCancel, onKeyDown],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  const handleBlur = () => {
    setIsEditing(false)
  }

  return (
    <input
      ref={inputRef}
      data-slot="editable-text-control"
      hidden={!isEditing}
      aria-hidden={!isEditing}
      className={cn(
        'w-full min-w-0 flex-1 bg-transparent outline-none',
        'rounded px-2 py-1 text-sm',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-hidden:hidden',
        className,
      )}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      disabled={disabled || !isEditing}
      readOnly={!isEditing}
      aria-label="Editable text input"
      {...props}
    />
  )
}

function EditablePreview({
  className,
  placeholder = 'Double click to edit',
  prefix,
  suffix,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  placeholder?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}) {
  const { value, disabled, isEditing, setIsEditing } =
    useEditableContext('EditablePreview')

  const handleClick = () => {
    if (!disabled) {
      setIsEditing(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault()
      setIsEditing(true)
    }
  }

  return (
    <div
      data-slot="editable-text-preview"
      hidden={isEditing}
      aria-hidden={isEditing}
      className={cn(
        'w-full min-w-0 flex-1 cursor-pointer px-2 py-1 text-sm',
        'focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-hidden:hidden',
        !value && 'text-muted-foreground',
        className,
      )}
      onDoubleClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label="Click to edit text"
      {...props}
    >
      {prefix}
      {children || value || placeholder}
      {suffix}
    </div>
  )
}

function EditableError({ ...props }: FieldPrimitive.Error.Props) {
  return <FieldPrimitive.Error data-slot="editable-text-error" {...props} />
}

function EditableToolbar({ className, ...props }: React.ComponentProps<'div'>) {
  const { isEditing } = useEditableContext('EditableToolbar')

  return (
    <div
      data-slot="editable-text-toolbar"
      hidden={!isEditing}
      aria-hidden={!isEditing}
      className={cn('flex items-center gap-1 aria-hidden:hidden', className)}
      {...props}
    />
  )
}

interface EditableButtonProps
  extends Omit<React.ComponentProps<typeof Button>, 'onClick'> {
  onClick?: () => void
}

function EditableSubmit({ className, onClick, ...props }: EditableButtonProps) {
  const { value, onSubmit } = useEditableContext('EditableSubmit')

  const handleClick = useCallback(() => {
    onSubmit(value)
    onClick?.()
  }, [value, onSubmit, onClick])

  return (
    <Button
      data-slot="editable-text-submit"
      size="icon-sm"
      variant="ghost"
      onClick={handleClick}
      className={cn('z-20 text-green-500 hover:text-green-600', className)}
      tabIndex={-1}
      {...props}
    >
      <Check />
      <span className="sr-only">Submit</span>
    </Button>
  )
}

function EditableCancel({ className, onClick, ...props }: EditableButtonProps) {
  const { onCancel } = useEditableContext('EditableCancel')

  const handleClick = useCallback(() => {
    onCancel()
    onClick?.()
  }, [onCancel, onClick])

  return (
    <Button
      data-slot="editable-text-cancel"
      size="icon-sm"
      variant="ghost"
      onClick={handleClick}
      tabIndex={-1}
      className={cn('text-destructive hover:text-destructive/80', className)}
      {...props}
    >
      <X />
      <span className="sr-only">Cancel</span>
    </Button>
  )
}

export {
  Editable,
  EditableInput,
  EditablePreview,
  EditableError,
  EditableToolbar,
  EditableSubmit,
  EditableCancel,
  useEditableContext,
}
