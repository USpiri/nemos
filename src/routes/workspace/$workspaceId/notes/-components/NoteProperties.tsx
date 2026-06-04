import { Plus, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { TagInput } from '@/components/TagInput'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Frontmatter } from '@/lib/notes/note.type'
import { cn } from '@/lib/utils/cn'

const BUILT_IN_KEYS = new Set(['readonly', 'tags', 'cssClass', 'description'])

interface Props {
  className?: string
  frontmatter: Frontmatter
  onChange?: (updated: Frontmatter) => void
}

export const NoteProperties = ({ className, frontmatter, onChange }: Props) => {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const update = useCallback(
    (patch: Partial<Frontmatter>) => onChange?.({ ...frontmatter, ...patch }),
    [frontmatter, onChange],
  )

  const addProperty = () => {
    const key = newKey.trim()
    if (!key) return
    update({ [key]: newValue.trim() })
    setNewKey('')
    setNewValue('')
  }

  const removeProperty = (key: string) => {
    const { [key]: _, ...remaining } = frontmatter as Record<string, unknown>
    onChange?.(remaining as Frontmatter)
  }

  const customEntries = Object.entries(frontmatter).filter(
    ([key]) => !BUILT_IN_KEYS.has(key),
  )

  return (
    <Accordion className={className}>
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-muted-foreground">
          Properties
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          <Separator className="mb-4" />
          <NotePropertyRow>
            <NotePropertyRowTitle name="readonly" />
            <Switch
              checked={frontmatter.readonly ?? false}
              onCheckedChange={(checked) => update({ readonly: checked })}
            />
          </NotePropertyRow>
          <NotePropertyRow>
            <NotePropertyRowTitle name="tags" />
            <TagInput
              className="w-full"
              tags={frontmatter.tags ?? []}
              onTagChange={(tags) => update({ tags })}
            />
          </NotePropertyRow>
          <NotePropertyRow>
            <NotePropertyRowTitle name="cssClass" />
            <NotePropertyValue
              value={frontmatter.cssClass ?? ''}
              onChange={(v) => update({ cssClass: v })}
            />
          </NotePropertyRow>
          <NotePropertyRow>
            <NotePropertyRowTitle name="description" />
            <NotePropertyValue
              value={(frontmatter['description'] ?? '') as string}
              onChange={(v) => update({ description: v })}
            />
          </NotePropertyRow>

          {customEntries.map(([key, value]) => (
            <NotePropertyRow key={key}>
              <NotePropertyRowTitle name={key} />
              <div className="flex w-full gap-1">
                <NotePropertyValue
                  value={String(value ?? '')}
                  onChange={(v) => update({ [key]: v })}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => removeProperty(key)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </NotePropertyRow>
          ))}

          <NotePropertyRow className="mt-2">
            <Input
              className="h-8 font-mono text-xs"
              placeholder="key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addProperty()}
            />
            <div className="flex w-full gap-1">
              <NotePropertyValue value={newValue} onChange={setNewValue} />
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={addProperty}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </NotePropertyRow>

          <Separator className="mt-4" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

interface PropertyRowProps {
  children?: React.ReactNode
}

export const NotePropertyRow = ({
  children,
  className,
}: PropertyRowProps & { className?: string }) => {
  return (
    <div
      className={cn('grid grid-cols-[100px_1fr] items-start gap-3', className)}
    >
      {children}
    </div>
  )
}

export const NotePropertyRowTitle = ({
  name,
  className,
}: {
  name: string
  className?: string
}) => (
  <span
    className={cn(
      'mb-0 flex h-8 w-24 shrink-0 items-center font-mono text-muted-foreground text-xs',
      className,
    )}
  >
    {name}
  </span>
)

export const NotePropertyValue = ({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (value: string) => void
  className?: string
}) => (
  <Textarea
    className={cn('min-h-8 w-full py-1', className)}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
)
