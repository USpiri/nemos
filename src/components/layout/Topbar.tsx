import { Tabs } from '../tabs'
import { SidebarTrigger } from '../ui/sidebar'

export const Topbar = () => {
  return (
    <div className="flex items-center justify-between gap-2 overflow-hidden border-border border-b px-2.5">
      <SidebarTrigger className="mx-1 my-2 size-8" />
      <Tabs />
    </div>
  )
}
