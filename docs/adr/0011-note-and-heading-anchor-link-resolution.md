# Note and heading-anchor links resolve dynamically within the same Root

**Date:** 2026-09-13
**Status:** Accepted

## Context

Markdown links only worked for External Links. A link to a heading in the same Note (`#some-heading`), to another Note in the same Root (`other-note.md`), or to a heading inside another Note (`other-note.md#some-heading`) would render but do nothing meaningful when followed. Cross-Root links, a backlinks index, automatic link rewriting on Note rename/move, `[[wikilink]]` syntax, and authoring/autocomplete assistance for inserting links were all considered during design and explicitly deferred — none are addressed by this ADR.

## Decision

Links continue to use standard Markdown syntax (`[label](target)`) exclusively; no wikilink syntax is introduced.

A link target resolves as:

- **`#slug`** — a Heading Anchor in the *same* Note. Matched by slugifying every heading in the current document (GitHub-Flavored-Markdown algorithm: lowercase, spaces to hyphens, strip punctuation, de-duplicate repeats with `-1`/`-2`) and comparing against `slug`.
- **`relative/path.md`** — a Note Link to another Note, resolved relative to the *linking* Note's own folder (standard CommonMark/relative-link convention), not relative to the Root. This keeps a Note's saved Markdown meaningful if the Note is moved within the Root, or opened outside Nemos entirely, where no "Root" concept exists. The `.md` extension is required explicitly; there is no extension-inference fallback, matching GitHub's own relative-link behavior and avoiding ambiguity with non-Markdown files that might share a folder.
- **`relative/path.md#slug`** — composition of the two above: resolve the Note Link, then the Heading Anchor within it.

No slug or heading ID is persisted into a Note's saved Markdown; anchors are recomputed from heading text on every navigation. A Tiptap `unique-id`-style extension was considered and rejected for this purpose: it only stores IDs as in-memory ProseMirror node attributes with no Markdown serialization path, so an ID would not survive a save-to-plain-Markdown-and-reload cycle without inventing a non-standard Markdown syntax addition — which this decision avoids, to keep `.md` files fully portable and plain outside Nemos. The accepted cost: a Heading Anchor silently stops resolving if the target heading's text is later edited — the same trade-off GitHub, VS Code, and every other slug-based tool makes.

Click behavior stays the shape already established for External Links (ADR-0008): in edit mode, Ctrl+click follows any Link regardless of target kind, preserving plain click for text editing. In read-only mode, plain click follows any Link, with no modifier needed. Read-only mode's click handling is also corrected here: it previously fell through to `@tiptap/extension-link`'s default handler (`window.open`), bypassing the Tauri opener plugin entirely; it now routes through the same resolution/navigation logic edit mode uses.

Following a Note Link replaces the current Tab's content; it does not open a new Tab.

An unresolved Link — target Note missing, or target Note present but the Heading Anchor doesn't match any heading — is styled visually distinct from a resolved one. Clicking a Link to a missing Note offers to create it at that relative path, creating any missing intermediate Folders. Clicking a Link whose Note exists but whose Heading Anchor doesn't resolve still navigates to the Note (no scroll) rather than erroring — the Note is a valid target even when the anchor half fails.

## Alternatives considered

- **Root-relative paths** instead of Note-relative paths for Note Links. Rejected: it would make a Note's saved Markdown meaningless once the Note is moved to a different Folder, or opened outside Nemos — Note-relative paths are what GitHub and every plain Markdown viewer already expect.
- **Persisted heading IDs** (via a Tiptap unique-id-style extension, or a hand-rolled equivalent) for anchor stability across heading renames. Rejected for this round: doing it properly requires a non-standard Markdown syntax addition (e.g. a Pandoc-style `{#id}` suffix) and a custom serializer/parser — a larger, separable decision from making anchors resolve at all.
- **Extension inference** (resolving `other-note` without `.md`). Rejected: GitHub's own relative-link handling has no such fallback either, and it would create ambiguity against non-Markdown files that might share a Note's folder.

## Consequences

This deliberately does not address: Links breaking silently when a Note is renamed or moved (already an accepted trade-off of ADR-0001, unchanged here), Links to Notes in a different Root (ADR-0010 notes there's no existing mechanism for the app to reference a second Root at all), a backlinks index, or any authoring-time assistance for inserting Links. All are named here as future, separate decisions rather than silently out of scope.
