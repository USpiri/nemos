import { useEffect } from 'react'
import { useAppearanceSettings } from '@/lib/settings'

const scopeInits = [() => useAppearanceSettings.getState().init()]

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  useEffect(() => {
    Promise.all(scopeInits.map((fn) => fn()))
  }, [])
  return <>{children}</>
}
