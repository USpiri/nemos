import { DetailedRootEntry } from '../workspace.type'

export const sortRecentEntries = (entries: DetailedRootEntry[]) =>
  [...entries].sort(
    (a, b) => (b.modified?.getTime() ?? 0) - (a.modified?.getTime() ?? 0),
  )
