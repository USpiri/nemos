import { FolderPlus, Settings, SquarePen } from 'lucide-react'
import { useDialog } from '@/hooks/use-dialog'
import { useRootActions } from '@/hooks/use-root-actions'
import {
  SidebarHeader as SidebarHeaderBase,
  SidebarMenu,
  SidebarMenuButton,
} from '../ui/sidebar'

export const SidebarHeader = () => {
  const { createNoteAndNavigate, createFolderAndRefresh } = useRootActions()

  const { open } = useDialog()

  const openSettings = () => {
    open('settings')
  }

  return (
    <SidebarHeaderBase className="border-border border-b">
      <SidebarMenu className="h-full flex-row items-center justify-center gap-1">
        <SidebarMenuButton
          className="aspect-square w-[unset] items-center justify-center p-0"
          onClick={() => createNoteAndNavigate()}
        >
          <SquarePen className="size-4" />
        </SidebarMenuButton>
        <SidebarMenuButton
          className="aspect-square w-[unset] items-center justify-center p-0"
          onClick={() => createFolderAndRefresh()}
        >
          <FolderPlus className="size-4" />
        </SidebarMenuButton>
        <SidebarMenuButton
          className="aspect-square w-[unset] items-center justify-center p-0"
          onClick={openSettings}
        >
          <Settings className="size-4" />
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarHeaderBase>
  )
}
