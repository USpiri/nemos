import { getRouteApi } from '@tanstack/react-router'
import { ScrollArea } from '../ui/scroll-area'
import { SidebarContent as SidebarContentBase } from '../ui/sidebar'
import { RootTree } from '../root-tree'

const route = getRouteApi('/workspace/$rootPath')

export const SidebarContent = () => {
  const { rootTree: tree } = route.useLoaderData()
  const { rootPath } = route.useParams()

  return (
    <SidebarContentBase>
      <ScrollArea className="[&_[data-slot=scroll-area-viewport]>div]:block! h-full [&_[data-slot=scroll-area-viewport]>div]:h-full!">
        <RootTree tree={tree} rootPath={rootPath} />
      </ScrollArea>
    </SidebarContentBase>
  )
}
