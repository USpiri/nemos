import { Info, Keyboard, Palette, Settings, Type } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar'

export const categories = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'editor', label: 'Editor', icon: Type },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
  { id: 'about', label: 'About', icon: Info },
] as const

export type CategoryId = (typeof categories)[number]['id']

interface SettingsSidebarProps {
  activeCategory: CategoryId
  onCategoryChange: (id: CategoryId) => void
}

export const SettingsSidebar = ({
  activeCategory,
  onCategoryChange,
}: SettingsSidebarProps) => {
  return (
    <Sidebar className="w-52 border-r" collapsible="none">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {categories.map((category) => (
              <SidebarMenuItem key={category.id}>
                <SidebarMenuButton
                  onClick={() => onCategoryChange(category.id)}
                  isActive={activeCategory === category.id}
                >
                  <category.icon className="size-4" />
                  {category.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <span className="font-mono text-muted-foreground text-xs">
          Nemos v1.0.0
        </span>
      </SidebarFooter>
    </Sidebar>
  )
}
