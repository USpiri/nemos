import { useState } from 'react'
import {
  TokenInput,
  TokenInputChip,
  TokenInputField,
  TokenInputTokenRemove,
} from '@/components/ui/token-input'

interface Props {
  className?: string
  tags?: string[]
  onTagChange?: (tags: string[]) => void
}

export function TagInput({ className, tags = [], onTagChange }: Props) {
  const [input, setInput] = useState('')

  const add = (raw: string) => {
    const value = raw.trim()
    if (!value || tags.includes(value)) return
    onTagChange?.([...tags, value])
    setInput('')
  }

  const remove = (index: number) => {
    onTagChange?.(tags.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      add(input)
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      remove(tags.length - 1)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.endsWith(',')) {
      add(value.slice(0, -1))
    } else {
      setInput(value)
    }
  }

  return (
    <TokenInput className={className}>
      {tags.map((tag, i) => (
        <TokenInputChip key={tag}>
          {tag}
          <TokenInputTokenRemove onClick={() => remove(i)} />
        </TokenInputChip>
      ))}
      <TokenInputField
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? '+ Add a tag' : undefined}
      />
    </TokenInput>
  )
}
