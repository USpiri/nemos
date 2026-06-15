import { beforeEach, describe, expect, it, vi } from 'vitest'
import { readSnippetCss } from './read-snippet-css'

const { mockExists, mockExistsAppData, mockRead, mockReadAppData } = vi.hoisted(
  () => ({
    mockExists: vi.fn(),
    mockExistsAppData: vi.fn(),
    mockRead: vi.fn(),
    mockReadAppData: vi.fn(),
  }),
)

vi.mock('@/lib/fs', () => ({
  exists: mockExists,
  existsAppData: mockExistsAppData,
  read: mockRead,
  readAppData: mockReadAppData,
}))

const WORKSPACE = 'nemos-app/my-workspace'

describe('readSnippetCss', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when global file does not exist', async () => {
    mockExistsAppData.mockResolvedValue(false)

    expect(await readSnippetCss('global', 'my-snippet.css', null)).toBeNull()
  })

  it('returns CSS content for an existing global file', async () => {
    mockExistsAppData.mockResolvedValue(true)
    mockReadAppData.mockResolvedValue('.global { color: red }')

    const result = await readSnippetCss('global', 'my-snippet.css', null)

    expect(result).toBe('.global { color: red }')
    expect(mockReadAppData).toHaveBeenCalledWith('snippets/my-snippet.css')
  })

  it('returns CSS content for an existing workspace file', async () => {
    mockExists.mockResolvedValue(true)
    mockRead.mockResolvedValue('.ws { color: blue }')

    const result = await readSnippetCss(
      'workspace',
      'my-snippet.css',
      WORKSPACE,
    )

    expect(result).toBe('.ws { color: blue }')
    expect(mockRead).toHaveBeenCalledWith(
      `${WORKSPACE}/.config/snippets/my-snippet.css`,
    )
  })

  it('returns null when workspace file does not exist', async () => {
    mockExists.mockResolvedValue(false)

    expect(
      await readSnippetCss('workspace', 'my-snippet.css', WORKSPACE),
    ).toBeNull()
  })

  it('returns null when workspace scope requested but workspaceFsPath is null', async () => {
    expect(await readSnippetCss('workspace', 'my-snippet.css', null)).toBeNull()
    expect(mockExists).not.toHaveBeenCalled()
  })

  it('returns null without throwing when global read fails', async () => {
    mockExistsAppData.mockResolvedValue(true)
    mockReadAppData.mockRejectedValue(new Error('io error'))

    await expect(
      readSnippetCss('global', 'my-snippet.css', null),
    ).resolves.toBeNull()
  })

  it('returns null without throwing when workspace read fails', async () => {
    mockExists.mockResolvedValue(true)
    mockRead.mockRejectedValue(new Error('io error'))

    await expect(
      readSnippetCss('workspace', 'my-snippet.css', WORKSPACE),
    ).resolves.toBeNull()
  })

  it('global and workspace scopes are fully independent', async () => {
    mockExists.mockResolvedValue(true)
    mockRead.mockResolvedValue('.ws {}')
    mockExistsAppData.mockResolvedValue(true)
    mockReadAppData.mockResolvedValue('.global {}')

    const wsResult = await readSnippetCss('workspace', 'shared.css', WORKSPACE)
    const globalResult = await readSnippetCss('global', 'shared.css', WORKSPACE)

    expect(wsResult).toBe('.ws {}')
    expect(globalResult).toBe('.global {}')
  })
})
