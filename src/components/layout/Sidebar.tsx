import { Sidebar as SidebarBase } from '../ui/sidebar'
import { SidebarContent } from './SidebarContent'
import { SidebarFooter } from './SidebarFooter'
import { SidebarHeader } from './SidebarHeader'

export const Sidebar = () => {
  return (
    <SidebarBase>
      <SidebarHeader />
      <SidebarContent />
      <SidebarFooter />
    </SidebarBase>
  )
}
