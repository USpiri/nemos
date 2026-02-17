import { getRouteApi } from '@tanstack/react-router'
import { FolderPlus, Settings, SquarePen } from 'lucide-react'
import { useDialog } from '@/hooks/use-dialog'
import { useWorkspaceActions } from '@/hooks/use-workspace-actions'
import {
  SidebarHeader as SidebarHeaderBase,
  SidebarMenu,
  SidebarMenuButton,
} from '../ui/sidebar'

const route = getRouteApi('/workspace/$workspaceId')

export const SidebarHeader = () => {
  const { workspaceId } = route.useParams()

  const { createNoteAndNavigate, createFolderAndRefresh } = useWorkspaceActions(
    {
      workspace: workspaceId,
    },
  )

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
