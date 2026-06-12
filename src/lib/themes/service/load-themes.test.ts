import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadThemes } from './load-themes'

const { mockReadDir, mockReadDirAppData, mockExists, mockExistsAppData } =
  vi.hoisted(() => ({
    mockReadDir: vi.fn(),
    mockReadDirAppData: vi.fn(),
    mockExists: vi.fn(),
    mockExistsAppData: vi.fn(),
  }))

vi.mock('@/lib/fs', () => ({
  readDir: mockReadDir,
  readDirAppData: mockReadDirAppData,
  exists: mockExists,
  existsAppData: mockExistsAppData,
}))

const dir = (name: string) => ({ name, isDirectory: true, isFile: false, isSymlink: false })
const WORKSPACE = 'nemos-app/my-workspace'

describe('loadThemes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty array when both theme directories do not exist', async () => {
    mockReadDirAppData.mockRejectedValue(new Error('not found'))
    mockReadDir.mockRejectedValue(new Error('not found'))

    const result = await loadThemes(WORKSPACE)
    expect(result).toEqual([])
  })

  it('returns global themes when workspace directory does not exist', async () => {
    mockReadDirAppData.mockResolvedValue([dir('nord')])
    mockExistsAppData.mockResolvedValue(true)
    mockReadDir.mockRejectedValue(new Error('not found'))

    const result = await loadThemes(WORKSPACE)
    expect(result).toEqual([{ id: 'nord', displayName: 'Nord' }])
  })

  it('returns workspace themes when global directory does not exist', async () => {
    mockReadDirAppData.mockRejectedValue(new Error('not found'))
    mockReadDir.mockResolvedValue([dir('my-theme')])
    mockExists.mockResolvedValue(true)

    const result = await loadThemes(WORKSPACE)
    expect(result).toEqual([{ id: 'my-theme', displayName: 'My Theme' }])
  })

  it('excludes folders missing theme.css', async () => {
    mockReadDirAppData.mockResolvedValue([dir('no-css'), dir('has-css')])
    mockExistsAppData
      .mockResolvedValueOnce(false) // no-css/theme.css
      .mockResolvedValueOnce(true)  // has-css/theme.css
    mockReadDir.mockResolvedValue([])

    const result = await loadThemes(WORKSPACE)
    expect(result).toEqual([{ id: 'has-css', displayName: 'Has Css' }])
  })

  it('workspace theme wins on ID collision', async () => {
    mockReadDirAppData.mockResolvedValue([dir('shared-theme')])
    mockExistsAppData.mockResolvedValue(true)
    mockReadDir.mockResolvedValue([dir('shared-theme')])
    mockExists.mockResolvedValue(true)

    const result = await loadThemes(WORKSPACE)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('shared-theme')
  })

  it('returns merged results sorted alphabetically by displayName', async () => {
    mockReadDirAppData.mockResolvedValue([dir('zebra-theme')])
    mockExistsAppData.mockResolvedValue(true)
    mockReadDir.mockResolvedValue([dir('apple-theme')])
    mockExists.mockResolvedValue(true)

    const result = await loadThemes(WORKSPACE)
    expect(result.map((t) => t.displayName)).toEqual(['Apple Theme', 'Zebra Theme'])
  })

  it('derives display name correctly from folder name', async () => {
    mockReadDirAppData.mockResolvedValue([dir('my-dracula-theme')])
    mockExistsAppData.mockResolvedValue(true)
    mockReadDir.mockResolvedValue([])

    const result = await loadThemes(WORKSPACE)
    expect(result[0].displayName).toBe('My Dracula Theme')
  })
})
