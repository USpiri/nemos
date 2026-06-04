import { Sidebar as SidebarBase } from '../ui/sidebar'
import { SidebarContent } from './SidebarContent'
import { SidebarFooter } from './SidebarFooter'
import { SidebarHeader } from './SidebarHeader'
import { SidebarResizeHandle } from './SidebarResizeHandle'

export const Sidebar = () => {
  return (
    <SidebarBase>
      <SidebarResizeHandle />
      <SidebarHeader />
      <SidebarContent />
      <SidebarFooter />
    </SidebarBase>
  )
}
