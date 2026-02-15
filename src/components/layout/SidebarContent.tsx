import { getRouteApi } from '@tanstack/react-router'
import { ROOT } from '@/config/constants'
import { ScrollArea } from '../ui/scroll-area'
import { SidebarContent as SidebarContentBase } from '../ui/sidebar'
import { WorkspaceTree } from '../workspace-tree'

const route = getRouteApi('/workspace/$workspaceId')

export const SidebarContent = () => {
  const tree = route.useLoaderData()
  const { workspaceId } = route.useParams()

  return (
    <SidebarContentBase>
      <ScrollArea className="h-full">
        <WorkspaceTree tree={tree} root={ROOT} workspace={workspaceId} />
      </ScrollArea>
    </SidebarContentBase>
  )
}
