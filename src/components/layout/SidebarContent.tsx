import { getRouteApi } from '@tanstack/react-router'
import { ROOT } from '@/config/constants'
import { ScrollArea } from '../ui/scroll-area'
import { SidebarContent as SidebarContentBase } from '../ui/sidebar'
import { WorkspaceTree } from '../workspace-tree'

const route = getRouteApi('/workspace/$rootPath')

export const SidebarContent = () => {
  const { workspaceTree: tree, folderName } = route.useLoaderData()

  return (
    <SidebarContentBase>
      <ScrollArea className="[&_[data-slot=scroll-area-viewport]>div]:block! h-full [&_[data-slot=scroll-area-viewport]>div]:h-full!">
        <WorkspaceTree tree={tree} root={ROOT} workspace={folderName} />
      </ScrollArea>
    </SidebarContentBase>
  )
}
