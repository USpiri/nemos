import { useUiStore } from '@/store/ui.store'
import { SidebarProvider as SidebarProviderBase } from '../ui/sidebar'

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const open = useUiStore((state) => state.sidebarOpen)
  const setOpen = useUiStore((state) => state.setSidebarState)
  return (
    <SidebarProviderBase open={open} onOpenChange={setOpen}>
      {children}
    </SidebarProviderBase>
  )
}
