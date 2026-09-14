# Root, Workspace, and Recent Roots are distinct concepts

**Date:** 2026-09-13 (retroactive — shipped in PR #110 / commit 34f1765 without an ADR at the time)
**Status:** Accepted

## Context

Before this feature, Nemos only had the concept of a Root: the folder currently open. There was no way to bookmark a folder for quick return, and no memory of recently opened folders. This ADR documents the model that shipped, since it was missed at the time and a later session (link-resolution design, ADR-0011) needed to reason about it precisely.

## Decision

Three separate concepts, layered rather than merged:

- **Root** — the folder currently open; can be opened via "Open Folder" without ever being pinned. Only one Root is open at a time; opening another Root (by switching Workspace or opening a new folder) replaces it. This is reflected directly in routing: `/workspace/$rootPath/notes/$noteId` carries one Root per route, so switching Roots means navigating to a different `$rootPath`, not managing simultaneous state for multiple open Roots.
- **Workspace** — a user-pinned *bookmark* to a Root. Pinning is opt-in. A Workspace has a stable identity assigned at pin time and a display name independent of the folder's actual name, so two Workspaces can point at same-named folders without conflict. Unpinning removes only the bookmark, never the folder.
- **Recent Roots** — an MRU list of the last 10 Roots opened, reordered and capped on every open regardless of Workspace pin status. Tracked independently of the Workspace registry; a Root can appear in both at once.

Note identity is unaffected by any of this: a Note's identity remains its path relative to its Root (ADR-0001), regardless of whether that Root is pinned, unpinned, or cycles out of Recent Roots.

## Alternatives considered

- **Merge Workspace and Recent Roots into one list** with a pinned flag per entry. Rejected: pinning and recency answer different questions (a deliberate bookmark vs. incidental usage history). Conflating them would mean unpinning a Workspace could also erase its recency entry, or a Root aging out of the MRU window could silently unpin it.
- **Support multiple Roots open at once** (a multi-root view). Rejected for this feature: the routing model — and the app generally — is built around one active Root at a time. Multi-Root would be a significantly larger architectural change and wasn't required to deliver pinning and recency.

## Consequences

Because only one Root is ever open, there is no existing mechanism for the app to view or reference a second Root while one is active — it can only *switch* the active Root. Any future feature that wants to point at "a Note in a different Root" (e.g. cross-Root links) has to design that from scratch; this ADR provides no such mechanism. This is relevant context for ADR-0011, which explicitly defers cross-Root links for that reason.
