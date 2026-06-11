# Note identity is the filesystem path

A Note has no UUID or opaque identifier. Its identity is its path relative to the Workspace root (e.g. `folder/my-note.md`). This means zero indirection — no metadata store, no ID-to-path lookup table, no sync layer. The trade-off is that renaming or moving a Note is a change of identity: open Tabs pointing to the old path become stale and must be updated, and any external references (links, bookmarks) break silently. We accepted this cost to keep the data model as simple as possible: Notes are just files, and the filesystem is the only source of truth.
