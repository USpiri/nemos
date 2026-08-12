# Nemos

Nemos is a minimalist, local-first note-taking desktop app built with Tauri v2 (Rust backend) and React (TypeScript frontend). Notes are plain Markdown files on the user's own filesystem — there is no database, no sync service, and no proprietary format.

## Core Premise

Notes should live on the user's device, in open formats, and work for the user. **Markdown is the canonical storage format.** Proprietary formats are not supported going forward.

---

## Terms

### Note
A single `.md` file on the local filesystem. A Note consists of optional YAML frontmatter followed by Markdown body content. A Note's identity is its path relative to its Workspace root; renaming or moving a Note is a change of identity.

### Legacy Note
A `.note` file — the pre-migration format that stored note data as JSON (`{ content: TipTapJSON, readonly?: boolean }`). Legacy Notes are not opened or understood by the app after migration; they exist only as migration sources.

### Migration
The one-time process of converting Legacy Notes in a Workspace to Notes. Triggered automatically when the app detects Legacy Notes on Workspace open; the user chooses whether to delete the source files after conversion.

### Workspace
A root directory on the local filesystem under which Notes and Folders are stored. All Workspaces live inside a `nemos-app` folder in the user's Documents directory.

### Frontmatter
The YAML block at the top of a Note file. Built-in fields: `readonly` (bool — makes the Note non-editable), `tags` (string[]), `cssClass` (string — applied as a CSS class on the note container). Additional arbitrary fields are allowed.

### Folder
A directory inside a Workspace that contains Notes and/or other Folders. Folders are part of the workspace tree and are represented as real directories on the local filesystem.

### Settings
User preferences persisted to disk in two layers: **Global Settings** and **Workspace Settings**.

#### Global Settings
The baseline set of user preferences stored in the OS app data directory. Applies across all Workspaces. Editable manually (not through the Settings UI). If absent on first launch, hardcoded schema defaults are written.

#### Workspace Settings
A sparse delta of preference overrides scoped to a single Workspace, stored at `.config/settings.json` inside the Workspace root. Only keys that differ from Global Settings are stored. The effective value for any setting is the Workspace override if present, otherwise the Global value. Written exclusively through the Settings UI. The `.config` folder is hidden from the Workspace file tree.

### Tab
An open Note in the editor. Multiple Tabs can be open simultaneously in a browser-like tab bar. Tabs persist across app restarts.

### Source Mode
The per-element state in which an inline element — a Math expression, Mermaid diagram, SMILES structure, or Link — shows its raw, directly-editable markup source instead of its rendered form. An element enters Source Mode when the cursor, or a selection fully contained within it, moves into it (by click or by keyboard navigation), and leaves Source Mode the instant the cursor moves elsewhere, at which point it re-renders from the (possibly just-edited) source. Each element type implements Source Mode with whatever mechanism fits it — Math/Mermaid/SMILES toggle a `showSource` node attribute, Link unwraps its mark into literal text and re-parses it on exit — but the observable behavior is the same across all of them.

Distinct from a Note's `readonly` field, which is a separate, whole-document edit/read-only state. Also distinct from the app's broader writing-first design principle (keeping edits inline, without modals or side panels) — that principle is *why* Source Mode exists, not the thing itself. Referred to informally as "click-to-edit" in the changelog and commit history, though that undersells the keyboard-navigation trigger.

### Theme
A user-installed CSS customization for the app, consisting of a folder containing a `theme.css` file. Theme CSS is injected after the app's base styles — it augments rather than replaces them. The app's base styles always remain in effect, so a Theme that only overrides one CSS variable only changes that variable; the rest of the UI is unaffected. A Theme that targets `.dark` selectors only affects dark mode; light mode is untouched. The light/dark/system toggle works independently of Themes.

Themes are discovered and resolved across two scopes: **Global Themes** (available to all Workspaces) and **Workspace Themes** (scoped to a single Workspace). When a Global Theme and a Workspace Theme share the same ID, the Workspace Theme takes precedence.

A Theme's ID is its folder name. Renaming the folder changes the Theme's ID and breaks any saved reference to it.

#### Global Theme
A Theme installed in the OS app data directory, available across all Workspaces.

#### Workspace Theme
A Theme installed inside a Workspace's `.config/themes/[ThemeID]/` directory, scoped to that Workspace. Overrides a Global Theme with the same ID.

> **Theming API:** Theme authors can override any CSS variable, target any structural selector, or inject arbitrary CSS. The stable selectors and variables that form the public contract are documented in `docs/theming.md`.

### CSS Snippet
A flat `.css` file placed in a snippets folder that is injected into the app after the base styles and any active Theme. CSS Snippets augment rather than replace existing styles. Unlike Themes, a CSS Snippet is a single file — there is no enclosing folder.

CSS Snippets are discovered across two scopes: **Global Snippets** (available to all Workspaces) and **Workspace Snippets** (scoped to a single Workspace). Both scopes are loaded additively — a filename that appears in both scopes does not cause one to replace the other; both are injected. Global Snippets are injected first; Workspace Snippets are injected after, so Workspace CSS rules win on any property conflict via cascade.

Each CSS Snippet can be independently toggled on or off. Toggle state is per-Workspace: disabling a Global Snippet in one Workspace does not affect other Workspaces. Snippets are enabled by default — only disabled Snippet IDs are persisted (in the Workspace Settings delta under `disabledGlobalSnippets` and `disabledWorkspaceSnippets`).

A CSS Snippet's ID is its filename without the `.css` extension.

#### Global CSS Snippet
A CSS Snippet installed in the OS app data directory (`snippets/[filename].css`), available to all Workspaces.

#### Workspace CSS Snippet
A CSS Snippet installed inside a Workspace's `.config/snippets/[filename].css`, scoped to that Workspace.

### Release Workflow

#### Release

A tagged, shipped version of the app (e.g., `v1.1.0`). Releases are immutable — once tagged, the code at that point never changes. Only the changelog and release notes may be edited after the fact.

#### Minor release
A release that increments the minor version (`vX.Y.0`) and delivers new user-facing features. Cut from `main`.

#### Patch release
A release that increments the patch version (`vX.Y.Z`) and delivers only bug fixes against a previously shipped version. Cut from a maintenance line, not from `main`.

#### Maintenance line
The `fix/vX.Y.x` branch tracking all patches for a specific minor version. Created reactively from the release tag when the first bug is found. Deleted after the next minor version ships.

#### Integration branch
`main`. The branch where all feature work lands. Represents the next unreleased version. Version in `package.json` stays at the last released version until release day.

#### Feature branch
A short-lived branch for a self-contained piece of work. Always branched from and merged back to its target (either `main` or a parent feature branch). Deleted after merge.

#### Merge back
The act of merging a maintenance line onto `main` once its patch has shipped, carrying the fix commits, changelog entry, and version bump over in a single merge. Performed after the release ceremony (version bump, tag, push) on the maintenance line, not before it.

#### Release ceremony
The sequence of steps that converts code on a branch into a shipped release: changelog update → version bump → commit → tag → push → publish GitHub Release.
