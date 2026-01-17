import { SidebarProvider } from '../ui/sidebar'

interface Props {
  children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
  return (
    <>
      <SidebarProvider>{children}</SidebarProvider>
    </>
  )
}
