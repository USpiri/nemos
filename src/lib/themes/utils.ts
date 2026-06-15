import type { SnippetDescriptor, ThemeDescriptor } from './theme.types'

export const toDisplayName = (folderName: string): string =>
  folderName.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export const filterEnabled = (
  descriptors: SnippetDescriptor[],
  disabled: string[],
): SnippetDescriptor[] => descriptors.filter((d) => !disabled.includes(d.id))

export const mergeThemes = (
  global: ThemeDescriptor[],
  workspace: ThemeDescriptor[],
): ThemeDescriptor[] => {
  const merged = new Map<string, ThemeDescriptor>()
  for (const theme of global) merged.set(theme.id, theme)
  for (const theme of workspace) merged.set(theme.id, theme)
  return [...merged.values()].sort((a, b) =>
    a.displayName.localeCompare(b.displayName),
  )
}
