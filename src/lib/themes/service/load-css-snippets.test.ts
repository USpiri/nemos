import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadCssSnippets } from './load-css-snippets'

const { mockReadDir, mockReadDirAppData } = vi.hoisted(() => ({
  mockReadDir: vi.fn(),
  mockReadDirAppData: vi.fn(),
}))

vi.mock('@/lib/fs', () => ({
  readDir: mockReadDir,
  readDirAppData: mockReadDirAppData,
}))

const file = (name: string) => ({
  name,
  isDirectory: false,
  isFile: true,
  isSymlink: false,
})
const ROOT = 'nemos-app/my-root'

describe('loadCssSnippets', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty lists when both snippet directories do not exist', async () => {
    mockReadDirAppData.mockRejectedValue(new Error('not found'))
    mockReadDir.mockRejectedValue(new Error('not found'))

    const result = await loadCssSnippets(ROOT)
    expect(result).toEqual({ globalSnippets: [], rootSnippets: [] })
  })

  it('returns global snippets when root directory does not exist', async () => {
    mockReadDirAppData.mockResolvedValue([file('nord.css')])
    mockReadDir.mockRejectedValue(new Error('not found'))

    const result = await loadCssSnippets(ROOT)
    expect(result.globalSnippets).toEqual([{ id: 'nord', displayName: 'Nord' }])
    expect(result.rootSnippets).toEqual([])
  })

  it('returns root snippets when global directory does not exist', async () => {
    mockReadDirAppData.mockRejectedValue(new Error('not found'))
    mockReadDir.mockResolvedValue([file('my-snippet.css')])

    const result = await loadCssSnippets(ROOT)
    expect(result.globalSnippets).toEqual([])
    expect(result.rootSnippets).toEqual([
      { id: 'my-snippet', displayName: 'My Snippet' },
    ])
  })

  it('ignores non-.css files', async () => {
    mockReadDirAppData.mockResolvedValue([
      file('valid.css'),
      {
        name: 'readme.txt',
        isDirectory: false,
        isFile: true,
        isSymlink: false,
      },
      { name: 'theme', isDirectory: true, isFile: false, isSymlink: false },
    ])
    mockReadDir.mockResolvedValue([])

    const result = await loadCssSnippets(ROOT)
    expect(result.globalSnippets).toEqual([
      { id: 'valid', displayName: 'Valid' },
    ])
  })

  it('returns both lists independently without merging', async () => {
    mockReadDirAppData.mockResolvedValue([
      file('shared.css'),
      file('global-only.css'),
    ])
    mockReadDir.mockResolvedValue([file('shared.css'), file('root-only.css')])

    const result = await loadCssSnippets(ROOT)
    expect(result.globalSnippets).toHaveLength(2)
    expect(result.rootSnippets).toHaveLength(2)
    expect(result.globalSnippets.map((s) => s.id)).toContain('shared')
    expect(result.rootSnippets.map((s) => s.id)).toContain('shared')
  })

  it('derives display name from filename using toDisplayName', async () => {
    mockReadDirAppData.mockResolvedValue([file('my-dracula-theme.css')])
    mockReadDir.mockResolvedValue([])

    const result = await loadCssSnippets(ROOT)
    expect(result.globalSnippets[0].displayName).toBe('My Dracula Theme')
  })
})
