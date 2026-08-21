// PROTOTYPE for issue #81 — Create Workspace dialog with the #78 addendum:
// full-path default + native folder-picker trigger, instead of a bare name
// hardcoded under nemos-app.
import { FolderOpenIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

const DEFAULT_PARENT = 'C:\\Users\\marc\\Documents\\nemos-app'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrototypeCreateWorkspaceDialog({ open, onOpenChange }: Props) {
  const [name, setName] = useState('')
  const [parentPath, setParentPath] = useState(DEFAULT_PARENT)

  const handleBrowse = () => {
    toast.info('Would open a native folder picker (tauri-plugin-dialog)', {
      description: 'Picking a folder replaces the path field above.',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Would create the Workspace', {
      description: `${parentPath}\\${name || '<name>'}`,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Creates a new folder and pins it as a Workspace automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="proto-parent-path">Location</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="proto-parent-path"
                  value={parentPath}
                  onChange={(e) => setParentPath(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    onClick={handleBrowse}
                    aria-label="Browse for a folder"
                  >
                    <FolderOpenIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Defaults to <code>nemos-app</code> — browse to put this
                Workspace somewhere else instead.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="proto-workspace-name">
                Workspace Name
              </FieldLabel>
              <Input
                id="proto-workspace-name"
                placeholder="my-workspace"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FieldDescription>
                Becomes the new folder&apos;s name under Location.
              </FieldDescription>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Workspace</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
