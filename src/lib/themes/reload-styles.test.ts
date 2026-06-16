import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reloadStyles } from './reload-styles'

const {
  mockReadThemeCss,
  mockLoadCssSnippets,
  mockReadSnippetCss,
  mockApplyThemeCSS,
  mockInjectSnippetStyle,
  mockRemoveStaleSnippets,
} = vi.hoisted(() => ({
  mockReadThemeCss: vi.fn(),
  mockLoadCssSnippets: vi.fn(),
  mockReadSnippetCss: vi.fn(),
  mockApplyThemeCSS: vi.fn(),
  mockInjectSnippetStyle: vi.fn(),
  mockRemoveStaleSnippets: vi.fn(),
}))

vi.mock('@/lib/themes/service/read-theme-css', () => ({
  readThemeCss: mockReadThemeCss,
}))
vi.mock('@/lib/themes/service/load-css-snippets', () => ({
  loadCssSnippets: mockLoadCssSnippets,
}))
vi.mock('@/lib/themes/service/read-snippet-css', () => ({
  readSnippetCss: mockReadSnippetCss,
}))
vi.mock('@/lib/themes/style-injectors', () => ({
  applyThemeCSS: mockApplyThemeCSS,
  injectSnippetStyle: mockInjectSnippetStyle,
  removeStaleSnippets: mockRemoveStaleSnippets,
  GLOBAL_ATTR: 'data-nemos-snippet-global',
  WORKSPACE_ATTR: 'data-nemos-snippet-workspace',
}))

const WORKSPACE = 'nemos-app/my-workspace'
const snippet = (id: string) => ({ id, displayName: id })

beforeEach(() => {
  vi.clearAllMocks()
  mockLoadCssSnippets.mockResolvedValue({
    globalSnippets: [],
    workspaceSnippets: [],
  })
  mockReadSnippetCss.mockResolvedValue(null)
})

describe('reloadStyles — theme', () => {
  it('reads and applies active theme CSS', async () => {
    mockReadThemeCss.mockResolvedValue('body { color: red }')

    await reloadStyles({
      activeTheme: 'nord',
      workspacePath: WORKSPACE,
      disabledGlobalSnippets: [],
      disabledWorkspaceSnippets: [],
    })

    expect(mockReadThemeCss).toHaveBeenCalledWith('nord', WORKSPACE)
    expect(mockApplyThemeCSS).toHaveBeenCalledWith('body { color: red }')
  })

  it('applies null CSS to remove theme style tag when activeTheme is null', async () => {
    await reloadStyles({
      activeTheme: null,
      workspacePath: WORKSPACE,
      disabledGlobalSnippets: [],
      disabledWorkspaceSnippets: [],
    })

    expect(mockReadThemeCss).not.toHaveBeenCalled()
    expect(mockApplyThemeCSS).toHaveBeenCalledWith(null)
  })
})

describe('reloadStyles — snippets', () => {
  it('injects CSS for each enabled snippet', async () => {
    mockReadThemeCss.mockResolvedValue(null)
    mockLoadCssSnippets.mockResolvedValue({
      globalSnippets: [snippet('nord'), snippet('dracula')],
      workspaceSnippets: [snippet('custom')],
    })
    mockReadSnippetCss.mockImplementation(
      (_scope: string, filename: string) => `/* ${filename} */`,
    )

    await reloadStyles({
      activeTheme: null,
      workspacePath: WORKSPACE,
      disabledGlobalSnippets: [],
      disabledWorkspaceSnippets: [],
    })

    expect(mockInjectSnippetStyle).toHaveBeenCalledWith(
      'data-nemos-snippet-global',
      'nord',
      '/* nord.css */',
    )
    expect(mockInjectSnippetStyle).toHaveBeenCalledWith(
      'data-nemos-snippet-global',
      'dracula',
      '/* dracula.css */',
    )
    expect(mockInjectSnippetStyle).toHaveBeenCalledWith(
      'data-nemos-snippet-workspace',
      'custom',
      '/* custom.css */',
    )
  })

  it('does not inject disabled snippets', async () => {
    mockReadThemeCss.mockResolvedValue(null)
    mockLoadCssSnippets.mockResolvedValue({
      globalSnippets: [snippet('nord'), snippet('dracula')],
      workspaceSnippets: [],
    })
    mockReadSnippetCss.mockResolvedValue('/* css */')

    await reloadStyles({
      activeTheme: null,
      workspacePath: WORKSPACE,
      disabledGlobalSnippets: ['nord'],
      disabledWorkspaceSnippets: [],
    })

    const calls = mockInjectSnippetStyle.mock.calls
    expect(calls.every(([, id]) => id !== 'nord')).toBe(true)
  })

  it('removes stale snippet style tags', async () => {
    mockReadThemeCss.mockResolvedValue(null)
    mockLoadCssSnippets.mockResolvedValue({
      globalSnippets: [snippet('nord')],
      workspaceSnippets: [],
    })
    mockReadSnippetCss.mockResolvedValue('/* css */')

    await reloadStyles({
      activeTheme: null,
      workspacePath: WORKSPACE,
      disabledGlobalSnippets: [],
      disabledWorkspaceSnippets: [],
    })

    expect(mockRemoveStaleSnippets).toHaveBeenCalledWith(
      'data-nemos-snippet-global',
      new Set(['nord']),
    )
    expect(mockRemoveStaleSnippets).toHaveBeenCalledWith(
      'data-nemos-snippet-workspace',
      new Set(),
    )
  })

  it('returns updated globalSnippets and workspaceSnippets', async () => {
    mockReadThemeCss.mockResolvedValue(null)
    mockLoadCssSnippets.mockResolvedValue({
      globalSnippets: [snippet('nord')],
      workspaceSnippets: [snippet('custom')],
    })
    mockReadSnippetCss.mockResolvedValue('/* css */')

    const result = await reloadStyles({
      activeTheme: null,
      workspacePath: WORKSPACE,
      disabledGlobalSnippets: [],
      disabledWorkspaceSnippets: [],
    })

    expect(result.globalSnippets).toEqual([snippet('nord')])
    expect(result.workspaceSnippets).toEqual([snippet('custom')])
  })
})

describe('reloadStyles — edge cases', () => {
  it('returns empty lists and skips snippet loading when workspacePath is null', async () => {
    const result = await reloadStyles({
      activeTheme: null,
      workspacePath: null,
      disabledGlobalSnippets: [],
      disabledWorkspaceSnippets: [],
    })

    expect(result).toEqual({ globalSnippets: [], workspaceSnippets: [] })
    expect(mockLoadCssSnippets).not.toHaveBeenCalled()
  })

  it('returns empty lists when snippet folder is missing', async () => {
    mockReadThemeCss.mockResolvedValue(null)
    mockLoadCssSnippets.mockRejectedValue(new Error('not found'))

    const result = await reloadStyles({
      activeTheme: null,
      workspacePath: WORKSPACE,
      disabledGlobalSnippets: [],
      disabledWorkspaceSnippets: [],
    })

    expect(result).toEqual({ globalSnippets: [], workspaceSnippets: [] })
  })
})
