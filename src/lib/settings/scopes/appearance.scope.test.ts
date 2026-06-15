import { describe, expect, it } from 'vitest'
import { AppearanceSettings } from './appearance.scope'

const validV1 = {
  theme: 'system' as const,
  autoSyncTheme: true,
  activeTheme: null,
}

describe('AppearanceSettings schema', () => {
  it('disabledGlobalSnippets defaults to [] when absent', () => {
    const result = AppearanceSettings.parse(validV1)
    expect(result.disabledGlobalSnippets).toEqual([])
  })

  it('disabledWorkspaceSnippets defaults to [] when absent', () => {
    const result = AppearanceSettings.parse(validV1)
    expect(result.disabledWorkspaceSnippets).toEqual([])
  })
})
