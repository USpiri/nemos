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

### Theme
A user-installed CSS customization for the app, consisting of a folder containing a `theme.css` file. Theme CSS is injected after the app's base styles — it augments rather than replaces them. The app's base styles always remain in effect, so a Theme that only overrides one CSS variable only changes that variable; the rest of the UI is unaffected. A Theme that targets `.dark` selectors only affects dark mode; light mode is untouched. The light/dark/system toggle works independently of Themes.

Themes are discovered and resolved across two scopes: **Global Themes** (available to all Workspaces) and **Workspace Themes** (scoped to a single Workspace). When a Global Theme and a Workspace Theme share the same ID, the Workspace Theme takes precedence.

A Theme's ID is its folder name. Renaming the folder changes the Theme's ID and breaks any saved reference to it.

#### Global Theme
A Theme installed in the OS app data directory, available across all Workspaces.

#### Workspace Theme
A Theme installed inside a Workspace's `.config/themes/[ThemeID]/` directory, scoped to that Workspace. Overrides a Global Theme with the same ID.

> **CSS variable contract:** Theme authors can override any CSS variable or class the app currently exposes. No stability guarantee is made yet — the authoritative list and any public API contract will be defined as part of the planned CSS classes rethink.
