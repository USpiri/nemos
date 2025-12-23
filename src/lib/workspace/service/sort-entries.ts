import { DetailedWorkspaceEntry } from "../workspace.type";

export const sortRecentEntries = (entries: DetailedWorkspaceEntry[]) =>
  [...entries].sort(
    (a, b) => (b.modified?.getTime() ?? 0) - (a.modified?.getTime() ?? 0),
  );
