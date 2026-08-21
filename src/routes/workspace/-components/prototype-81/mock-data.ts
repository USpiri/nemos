// PROTOTYPE for issue #81 — throwaway mock data, not real fs/store reads.
// Recent Roots and missing-pin detection don't exist in the real app yet,
// so everything here is hardcoded to demonstrate the UI/UX only.

export type MockWorkspace = {
  name: string
  path: string
  /** Simulates the "pinned Root whose folder can't be found" case from #80. */
  missing?: boolean
}

export type MockRecentRoot = {
  path: string
  lastOpenedAt: string
}

export const CURRENT_ROOT_PATH =
  'C:\\Users\\marc\\Documents\\nemos-app\\personal'

export const mockWorkspaces: MockWorkspace[] = [
  { name: 'Personal Notes', path: CURRENT_ROOT_PATH },
  { name: 'Honra Clients', path: 'D:\\Honra\\clients-vault' },
  { name: 'Legal Drafts', path: 'D:\\Honra\\legal\\drafts' },
  {
    name: 'Old Laptop Backup',
    path: 'E:\\backup\\notes-2024',
    missing: true,
  },
]

export const mockRecentRoots: MockRecentRoot[] = [
  {
    path: 'C:\\Users\\marc\\Downloads\\scratch-notes',
    lastOpenedAt: '2026-08-20T14:02:00Z',
  },
  {
    path: 'C:\\Projects\\tauri\\nemos\\docs',
    lastOpenedAt: '2026-08-19T09:15:00Z',
  },
  {
    path: 'C:\\Users\\marc\\Documents\\nemos-app\\draft-ideas',
    lastOpenedAt: '2026-08-17T11:40:00Z',
  },
]

export function basename(path: string) {
  return path.split(/[\\/]/).filter(Boolean).pop() ?? path
}

export function formatRelativeTime(iso: string) {
  const diffMs = Date.parse('2026-08-20T18:00:00Z') - Date.parse(iso)
  const hours = Math.round(diffMs / (1000 * 60 * 60))
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}
