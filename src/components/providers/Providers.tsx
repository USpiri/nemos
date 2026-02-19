import { SidebarProvider } from '../layout/SidebarProvider'
import { SettingsProvider } from './SettingsProvider'
import { ThemeProvider } from './ThemeProvider'

interface Props {
  children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </SettingsProvider>
  )
}
