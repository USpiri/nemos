import { useCallback } from 'react'
import { useAppearanceSettings } from '@/lib/settings'
import { reloadStyles } from '@/lib/themes/reload-styles'
import type { SnippetDescriptor } from '@/lib/themes/theme.types'

interface ReloadResult {
  globalSnippets: SnippetDescriptor[]
  workspaceSnippets: SnippetDescriptor[]
}

export function useReloadStyles(): () => Promise<ReloadResult> {
  const activeTheme = useAppearanceSettings((s) => s.activeTheme)
  const workspacePath = useAppearanceSettings((s) => s.workspacePath)
  const disabledGlobalSnippets = useAppearanceSettings(
    (s) => s.disabledGlobalSnippets,
  )
  const disabledWorkspaceSnippets = useAppearanceSettings(
    (s) => s.disabledWorkspaceSnippets,
  )

  return useCallback(
    () =>
      reloadStyles({
        activeTheme,
        workspacePath,
        disabledGlobalSnippets,
        disabledWorkspaceSnippets,
      }),
    [
      activeTheme,
      workspacePath,
      disabledGlobalSnippets,
      disabledWorkspaceSnippets,
    ],
  )
}
