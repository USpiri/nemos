import { Sidebar as SidebarBase, SidebarRail } from '../ui/sidebar'
import { SidebarContent } from './SidebarContent'
import { SidebarFooter } from './SidebarFooter'
import { SidebarHeader } from './SidebarHeader'

export const Sidebar = () => {
  return (
    <SidebarBase>
      <SidebarHeader />
      <SidebarContent />
      <SidebarFooter />
      <SidebarRail />
    </SidebarBase>
  )
}
