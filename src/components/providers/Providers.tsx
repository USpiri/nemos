import { SidebarProvider } from '../layout/SidebarProvider'

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
