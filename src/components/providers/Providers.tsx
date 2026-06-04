import { SettingsProvider } from './SettingsProvider'
import { ThemeProvider } from './ThemeProvider'

interface Props {
  children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
  return (
    <SettingsProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SettingsProvider>
  )
}
