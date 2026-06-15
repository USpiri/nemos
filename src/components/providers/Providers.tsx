import { SettingsProvider } from './SettingsProvider'
import { SnippetsProvider } from './SnippetsProvider'
import { ThemeProvider } from './ThemeProvider'

interface Props {
  children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <SnippetsProvider>{children}</SnippetsProvider>
      </ThemeProvider>
    </SettingsProvider>
  )
}
