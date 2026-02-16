import { Sidebar as SidebarBase } from '../ui/sidebar'
import { SidebarContent } from './SidebarContent'
import { SidebarFooter } from './SidebarFooter'
import { SidebarHeader } from './SidebarHeader'

export const Sidebar = () => {
  return (
    <SidebarBase className="static! w-full border-none">
      <SidebarHeader />
      <SidebarContent />
      <SidebarFooter />
    </SidebarBase>
  )
}
