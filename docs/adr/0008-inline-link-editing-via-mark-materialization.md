# ADR 0008 — Inline Raw-Source Editing for Links via Mark Materialization

**Date:** 2026-08-10
**Status:** Accepted

## Context

Link is the only major inline decoration in the editor with no way to view or edit its own data. Ctrl+click opens the href in a browser, but there is no affordance to see or change it without leaving the editor and hand-typing over the markdown. Math, Mermaid, and Smiles already solve this class of problem by toggling between a rendered view and a raw-source view on selection — but Link is structurally different from all three: it's a TipTap **mark** decorating arbitrary existing text, not a self-contained node. Its "source" (`href`, `title`) has no place in the document's actual text — unlike Math, where the raw LaTeX *is* the node's entire content, exposed directly through a `contentDOM`.

## Decision

Link stays a **mark**, not a node — this preserves mark composability (partial-word links, links nested with bold/italic, autolink-on-paste) that a node conversion would lose. It's rendered via a React `MarkView`.

On selection — the caret entering the link's range, by click or by cursor movement — a transaction **unwraps the mark and replaces the label with the literal raw-markdown source text**: `[label](url)`, or `[label](url "title")` when a title is set. This is real, plain, directly-editable document text, mirroring how Math exposes its LaTeX source through `contentDOM`. On blur/deselection, a transaction re-parses the current text using the link extension's existing input-rule grammar (`inputRegex`, `link/index.ts:24`) and reapplies the mark with the parsed `href`/`title`.

Malformed or empty raw text on commit is left as whatever plain text it now reads as — the mark simply isn't reapplied. There is no error state and no explicit cancel affordance (no Escape-to-revert): whatever is present when focus leaves is what commits, matching Math's own behavior exactly.

Link creation (`Ctrl/Cmd+K` on an active selection) uses the same mechanism: it wraps the selection with an empty-href mark and immediately materializes it into edit mode.

The raw source always uses the full bracket grammar, even when label and href are identical (autolinks) — one parsing path, no special-cased bare-URL shortcut, matching standard markdown link syntax convention.

## Alternatives considered

- **Floating panel/popover** (Notion/Google Docs style), anchored to the link, editing `href` as a mark attribute directly with no document mutation. Rejected: it doesn't match the inline, writing-first convention already established by Math/Mermaid/Smiles, and introduces a floating-overlay UI paradigm the editor doesn't otherwise use for content editing.
- **Inline affix** — leave the label untouched as normal prose, add a small adjacent editable field for just the `href`, still via `MarkView` but without mutating the label. Rejected in favor of full raw-source parity with Math/Mermaid.
- **Convert Link to an atomic node**, for true structural parity with Math. Rejected: loses mark composability (bold/italic within a link, links over partial-word selections), and would require migrating every existing link in every note to a new node type on the next markdown round-trip.
- **Bare-URL special case for autolinks** (materializing as just the URL, no brackets, when label === href). Rejected in favor of always using the full bracket grammar, for one consistent parsing path and adherence to standard markdown link convention.

## Consequences

While a link is mid-edit, it doesn't exist as a mark in the document at all — only as plain text. This is safe to persist: the materialized raw text is itself valid markdown, so a save that happens to land mid-edit still round-trips correctly on next load. The trade-off is that a malformed edit to the bracket structure permanently loses the link (unwraps to plain text) rather than failing loudly or reverting — a deliberate simplicity choice, worth revisiting if it proves too easy to lose links by accident in practice.
