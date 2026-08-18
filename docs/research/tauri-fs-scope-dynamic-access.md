# Tauri v2 fs scope: dynamic/persisted folder access

Research for [#76](https://github.com/USpiri/nemos/issues/76). Question: can nemos let a user open an
arbitrary folder at runtime (not just `Documents/nemos-app`) given Tauri v2's static, capabilities-declared
fs scope model?

## TL;DR

**Yes, this is a well-supported, standard Tauri v2 pattern, not a workaround.** The `dialog` plugin's
`open()`/`save()` commands already call into the fs plugin's runtime `Scope` object
(`s.allow_directory()` / `s.allow_file()`) the moment the user picks a path — confirmed directly in the
plugin source, not inferred. That runtime scope is checked by every fs command in an **OR** with the
static capabilities-declared scope (see [Q1](#1-runtimedynamic-scope-grant)), so a picked folder becomes
readable/writable immediately without ever appearing in `capabilities/*.json`.

**Persistence across restarts is a solved, official pattern**: `tauri-plugin-persisted-scope` saves that
same runtime scope to disk and replays it on next launch, confirmed by a maintainer describing exactly
nemos's use case (a code-editor-style "Open Project" flow) as the plugin's motivating example ([Q2](#2-persistence-across-restarts)).

**Nemos does not currently depend on `@tauri-apps/plugin-dialog`** — verified directly in `Cargo.toml` and
`package.json` ([Q3](#3-dialog-plugin-confirmation)). It is the correct, documented way to get a native
folder picker, and it has known Windows quirks worth planning around (default-path separator handling,
blocking-call/threading rules) but no folder-picker-breaking bug on Windows.

**Security-wise**, the main footguns are: granting recursion (`allow_directory(path, true)`) further out
than the user's actual pick, treating `$HOME/**` as a starting scope, not distinguishing the asset
protocol's separate scope, and symlinks inside a granted folder pointing outside it ([Q4](#4-security-guidance)).
Tauri's own docs explicitly recommend narrow directories over `$HOME/**/*` or `**/*`.

**Recommended shape for nemos**: keep `fs:allow-*` permissions in `capabilities/default.json` scoped to
`$DOCUMENT/**` and `$APPDATA/**` as today (for the legacy default workspace and app config), add
`dialog:default` (or just `dialog:allow-open`), add `tauri-plugin-persisted-scope`, and use
`tauri-plugin-store` only to remember *which* path was last opened (a UX hint), not to re-grant access —
the persisted-scope plugin's own file (`.persisted-scope` in appdata) is what actually restores the grant.
See [Recommendation](#recommendation) for the concrete permission/plugin list.

---

## 1. Runtime/dynamic scope grant

**Yes.** `tauri-plugin-fs` v2 checks two independent scope sources for every path-touching command, and
allows the path if *either* one covers it. This is visible directly in the plugin's `resolve_path`
function:

```rust
// plugins/fs/src/commands.rs (tauri-apps/plugins-workspace, v2 branch,
// https://github.com/tauri-apps/plugins-workspace/blob/v2/plugins/fs/src/commands.rs)
let fs_scope = webview.state::<crate::Scope>();

let scope = tauri::scope::fs::Scope::new(
    webview,
    &FsScope::Scope {
        allow: global_scope.allows()...chain(command_scope.allows()...).collect(),
        deny:  global_scope.denies()...chain(command_scope.denies()...).collect(),
        ...
    },
)?;

if is_forbidden(&fs_scope.scope, &resolved_path, ...) || is_forbidden(&scope, &resolved_path, ...) {
    return Err(...PathForbidden...);
}

if fs_scope.scope.is_allowed(&resolved_path) || scope.is_allowed(&resolved_path) {
    // allowed
}
```

- `scope` is built fresh, per call, from the **statically declared** `allow`/`deny` entries under the
  permission's `global_scope`/`command_scope` — i.e. what's in `capabilities/*.json`.
- `fs_scope` is `webview.state::<crate::Scope>()` — a **long-lived, mutable, in-memory scope object**
  (the same one `tauri_plugin_fs::FsExt::fs_scope()` / `try_fs_scope()` return), which any Rust code in
  the app can extend at runtime via `.allow_directory(path, recursive)` / `.allow_file(path)`. Full method
  list on the type ([`tauri::scope::fs::Scope`](https://docs.rs/tauri/2.4.1/tauri/scope/fs/struct.Scope.html)):
  `allow_directory`, `allow_file`, `forbid_directory`, `forbid_file`, `is_allowed`, `is_forbidden`,
  `allowed_patterns`, `forbidden_patterns`, plus `listen`/`once`/`unlisten` for scope-change events.

So the OR-check means: a path that was never declared in `capabilities/*.json` is fully usable by
`readTextFile`, `writeTextFile`, `readDir`, etc. as soon as something calls `fs_scope.allow_directory(...)`
on it, provided the *command itself* (e.g. `fs:allow-read-text-file`) is still granted to the window
(the capability system's command-level allow/deny gate is separate from, and checked before, this
path-level scope gate).

**The dialog plugin is exactly that "something," and it does this automatically, unconditionally, and
without any dedicated "extend scope" permission.** From the actual `open()`/`save()` command
implementations ([`plugins/dialog/src/commands.rs`](https://github.com/tauri-apps/plugins-workspace/blob/v2/plugins/dialog/src/commands.rs)):

```rust
let folder = dialog_builder.blocking_pick_folder();
if let Some(folder) = &folder {
    if let Ok(path) = folder.clone().into_path() {
        if let Some(s) = window.try_fs_scope() {
            s.allow_directory(&path, options.recursive)?;   // fs plugin's runtime Scope
        }
        tauri_scope.allow_directory(&path, options.directory)?; // core tauri::scope::Scopes
    }
}
```

The same pattern appears for single-file pick, multi-file pick, and `save()`. So:

- **No special `fs:allow-*` permission exists for "extend scope at runtime."** The extension happens
  inside the dialog plugin's own Rust command handler — it is privileged backend code, not something the
  frontend calls directly, so it isn't gated by an fs permission at all.
- **The only permission required is on the dialog side**: `dialog:allow-open` (covered by `dialog:default`,
  which is `["allow-message", "allow-save", "allow-open"]` per [`plugins/dialog/permissions/default.toml`](https://github.com/tauri-apps/plugins-workspace/blob/v2/plugins/dialog/permissions/default.toml)).
- Reading/writing the picked path afterward still requires the *command* (e.g. `fs:allow-read-text-file`)
  to be granted in capabilities — but that permission's `allow` scope list can be narrow (or omit the
  picked path entirely), because the dynamic `fs_scope` created by the dialog pick satisfies the OR-check.
- This confirms the documented "scope + dialog" pattern precisely: it is **not** `fs:default`'s
  autogenerated scope reacting to dialog selections (fs:default only ever covers the app-specific
  directories per its own manifest, see below) — it is the dialog plugin's Rust code directly mutating the
  fs plugin's shared runtime `Scope` object.

Confirmed the same thing from a Tauri core maintainer's own words in
[tauri-apps/tauri discussion #8540](https://github.com/tauri-apps/tauri/discussions/8540)
(FabianLars, Tauri team):

> "It saves scope configs added via these apis [`tauri::scope::FsScope`], the built-in dialog, and file
> drops (if tauri's file drop is enabled) to disk so they are preserved across app restarts. Example:
> Imagine you're working on a code editor, your user clicks on 'Open Project' and selects their project in
> the file picker dialog. Tauri will then extend the fs scope with the selected path automatically so you
> can immediately use the fs javascript apis."

For reference, `fs:default`'s manifest ([`plugins/fs/permissions/default.toml`](https://github.com/tauri-apps/plugins-workspace/blob/v2/plugins/fs/permissions/default.toml))
only grants `create-app-specific-dirs` + `read-app-specific-dirs-recursive` scoped to `AppConfig`,
`AppData`, `AppLocalData`, `AppCache`, `AppLog` — matching what nemos already has for `$APPDATA/**`. It is
unrelated to dialog auto-scoping.

## 2. Persistence across restarts

**Yes — official plugin, official pattern, this is the documented precedent.**
[`tauri-plugin-persisted-scope`](https://v2.tauri.app/plugin/persisted-scope/)
(source: [`plugins/persisted-scope`](https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/persisted-scope))
does exactly one thing: it listens for changes to the same runtime `crate::Scope` object described above,
serializes the allowed/forbidden path patterns with `bincode` to `<app-data-dir>/.persisted-scope` on every
change, and on the next app startup re-applies every saved pattern via `allow_path()`/`forbid_path()`
(→ `scope.allow_directory()` / `scope.allow_file()`), **before any dialog interaction happens** —
confirmed directly from [`plugins/persisted-scope/src/lib.rs`](https://github.com/tauri-apps/plugins-workspace/blob/v2/plugins/persisted-scope/src/lib.rs):

```rust
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("persisted-scope")
        .setup(|app, _api| {
            let fs_scope = app.try_fs_scope();
            ...
            if fs_scope_state_path.exists() {
                let scope: Scope = std::fs::read(&fs_scope_state_path)...unwrap_or_default();
                for allowed in &scope.allowed_paths { allow_path(fs_scope, &allowed); }
                for forbidden in &scope.forbidden_patterns { forbid_path(fs_scope, &forbidden); }
            }
            fs_scope.listen(move |event| {
                if let tauri::fs::Event::PathAllowed(_) = event {
                    save_scopes(&app.fs_scope(), &app_dir, &fs_scope_state_path);
                }
            });
        })
}
```

Notes worth flagging for nemos's design:

- **The plugin must be registered *after* `fs`** in the Tauri builder chain — it prints a dev-mode warning
  if not (`"Please make sure to register the fs plugin before the persisted-scope plugin!"`).
- **It does not validate that a persisted path still exists on disk before re-granting it.** Restoring a
  scope entry for a folder that was deleted, renamed, or lives on an unmounted drive will silently succeed
  at the scope layer; the failure only surfaces later, when nemos actually tries to `readDir`/`stat` it.
  Nemos should re-validate (e.g. `exists()` + `readDir()`) right after restore and prompt to re-pick if the
  remembered Workspace root is gone, rather than assuming the restored grant means the folder is usable.
- It persists to a raw bincode file, separate from any app-level settings store — it is not something
  nemos configures via `tauri-plugin-store`; the two serve different jobs (see Recommendation).

**Precedent for the "open any project folder" pattern**: the maintainer's own example in
[discussion #8540](https://github.com/tauri-apps/tauri/discussions/8540) is *specifically* a code-editor
"Open Project" flow — this is not a hypothetical, it's the plugin's stated reason for existing. A related
discussion, [#8540 is also cross-referenced from #9195, "FS permissions dependent on dialog action"](https://github.com/tauri-apps/tauri/discussions/9195),
shows a user independently rediscovering the same runtime-scope-via-dialog behavior (and being confused by
it because — without persisted-scope — the grant resets on every relaunch, requiring the dialog to be
re-triggered once per session, exactly as expected without the plugin).

## 3. Dialog plugin confirmation

Confirmed directly in this repo:

- `src-tauri/Cargo.toml` dependencies: `tauri`, `tauri-plugin-log`, `tauri-plugin-fs`, `tauri-plugin-process`,
  `tauri-plugin-opener`, `tauri-plugin-store`, `tauri-plugin-updater` — **no `tauri-plugin-dialog`**.
- `package.json` dependencies: `@tauri-apps/plugin-fs`, `@tauri-apps/plugin-opener`, `@tauri-apps/plugin-process`,
  `@tauri-apps/plugin-store`, `@tauri-apps/plugin-updater` — **no `@tauri-apps/plugin-dialog`**.

`plugin-dialog` is indeed the standard, official mechanism for a native folder/file picker in Tauri v2 —
documented at [v2.tauri.app/plugin/dialog](https://v2.tauri.app/plugin/dialog/), maintained in the same
[`tauri-apps/plugins-workspace`](https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/dialog)
repo as `fs`, `store`, etc. `directory: true` on the `open()` options is the folder-picker mode (as opposed
to file picker); it's what the dialog's Rust `open()` command branches on (`options.directory` in the
`commands.rs` excerpt in [Q1](#1-runtimedynamic-scope-grant)).

Windows-specific quirks worth flagging (this project builds primarily for Windows):

- **Path-separator handling in `defaultPath`**: historically ([tauri-apps/tauri#8074](https://github.com/tauri-apps/tauri/issues/8074),
  filed against Tauri 1.4, Windows 10) a forward-slash `defaultPath` (e.g. `"D:/tmp"`) was silently ignored
  by the native Windows dialog, only backslash paths worked. The current v2 `commands.rs`
  (`set_default_path`, desktop branch) explicitly works around this with a comment referencing that exact
  issue and normalizes via `default_path.components().collect()` before handing it to the OS dialog — so
  this is handled internally now, but it's evidence Windows path-separator quirks are a known category of
  bug in this code path and worth a smoke test on Windows once nemos wires up a default/last-used path.
- **Blocking vs. async calls**: the dialog plugin exposes both `blocking_pick_folder()` (used internally by
  the JS `open()` command via `#[tauri::command] async fn open(...)`) and non-blocking variants. Native
  Win32 folder dialogs must run off the UI/event-loop thread when called in a blocking fashion; Tauri's own
  command already wraps this correctly (the command function is `async`, and the dialog builder methods are
  blocking calls dispatched appropriately), so nemos's own code doesn't need to manage this — but any custom
  Rust command that touches `FileDialogBuilder` directly must respect the same rule (never call
  `blocking_*` from the main/event-loop thread).
- **No folder-picker support on mobile** (Android has no native folder picker in this plugin — [tauri-apps/plugins-workspace#933](https://github.com/tauri-apps/plugins-workspace/issues/933)) —
  irrelevant to nemos today since it only ships Windows, but worth remembering if mobile is ever considered.
- **Mixed file+folder selection is not supported** in a single dialog call ([tauri-apps/plugins-workspace#2137](https://github.com/tauri-apps/plugins-workspace/issues/2137)) —
  not a concern for an "Open Folder" flow, which only needs `directory: true`.
- No Windows-specific bug was found that breaks basic single-folder selection (`directory: true, multiple: false`) —
  the quirks above are about `defaultPath` formatting and threading discipline, not picker correctness.

## 4. Security guidance

Tauri's own docs and advisories give concrete, specific guidance here — not just generic "least privilege"
language:

- **Scope narrowly, not by base directory alone.** The [asset protocol scope docs](https://v2.tauri.app/security/asset-protocol/)
  state directly: *"Prefer narrow directories (`$APPCACHE`, `$RESOURCE`, a single app subfolder under
  `$HOME`, etc.) instead of broad `$HOME/**/*` or `**/*`"*, adding that a maximally permissive example is
  *"not a default recommendation; it increases exposure of hidden and sensitive files."* This is Tauri's
  own explicit discouragement of `$HOME/**`-style roots — the same reasoning applies to the fs plugin's
  scope, since [asset-protocol scope uses the identical `FsScope` type](https://v2.tauri.app/security/asset-protocol/)
  as fs-plugin scope configuration.
- **The [capabilities docs](https://v2.tauri.app/security/capabilities/) explicitly list what capabilities
  do *not* protect against**, including *"Too lax scopes and configuration"* and *"Incorrect scope checks
  in the command implementation"* — i.e. Tauri's own security model treats "scope granted too broadly" as
  a known, named residual risk category, not an edge case.
- **Recursion is the specific lever to be careful with.** `allow_directory(path, recursive)` — the same
  call the dialog plugin makes automatically — takes an explicit `recursive: bool`. Granting recursion on
  a folder wider than what the user actually picked (or granting it non-recursively but on a parent
  directory "just in case") is the concrete way "narrow scope" turns into "broad scope" in this API; the
  dialog plugin itself only ever recurses into exactly the folder the user selected
  (`options.recursive` from the JS caller — nemos controls this value on the `open()` call, so this is a
  choice nemos makes explicitly, not a footgun of the underlying API).
- **Symlink/junction traversal escaping scope is a real, historical vulnerability class** in this exact
  code path: [GHSA-28m8-9j7v-x499 "The readDir Endpoint Scope can be Bypassed With Symbolic Links"](https://github.com/tauri-apps/tauri/security/advisories/GHSA-28m8-9j7v-x499)
  (CVE-2022-39215) — recursive `readDir` failed to canonicalize symlinks/junctions, letting a crafted link
  inside an allowed folder point outside the scope and leak a directory listing (not file contents). Fixed
  in Tauri 1.0.6/1.1.0 via [PR #5123](https://github.com/tauri-apps/tauri/pull/5123). The current v2 fs
  plugin source does contain symlink-aware handling (`std::fs::symlink_metadata`,
  `std::fs::read_link`/`canonicalize` in `plugins/fs/src/commands.rs`), consistent with that fix having
  carried forward, but this is exactly the kind of edge case worth a deliberate test once nemos allows
  arbitrary user folders (a symlink inside a granted Workspace folder pointing at, say, the user's whole
  home directory) rather than assuming it's fully closed off.
- **A related, distinct advisory** — [GHSA-q9wv-22m9-vhqh "The Filesystem Scope can be Partially Bypassed"](https://github.com/tauri-apps/tauri/security/advisories/GHSA-q9wv-22m9-vhqh) —
  confirms the dialog-driven auto-scoping behavior is old and load-bearing enough to have had its own CVE:
  paths selected via dialog/drag-and-drop that contained unescaped glob metacharacters (`*`, `**`,
  `[a-Z]`) could widen the auto-granted scope to sibling files/subfolders. On Windows the exposure was
  narrower (only the `[a-Z]` single-character-filename pattern applied, since `*` isn't a valid Windows
  path component). Fixed in Tauri 1.0.7 / 1.1.2 / 2.0.0 — i.e. **fixed by the time nemos's Tauri 2.0.3
  dependency was released**, but it's a useful reminder that paths handed back from the OS dialog are
  still attacker-shaped input if a folder name itself is adversarial (e.g. a malicious folder someone was
  tricked into opening), and glob-escaping matters even for "the user picked it themselves" paths.
- **Asset protocol is a separate scope from fs plugin scope** and must be configured independently
  (`app.security.assetProtocol.scope` in `tauri.conf.json`, `enable: true` + its own allow list) if nemos
  ever renders picked-folder content (e.g. images referenced from a note) via `convertFileSrc`/the asset
  protocol rather than through the fs plugin's `readFile`. Granting fs scope to a folder does **not**
  automatically grant asset-protocol scope to it.

## Recommendation

1. **Add `dialog:default`** (or narrowly `dialog:allow-open`) to `src-tauri/capabilities/default.json`, and
   add `@tauri-apps/plugin-dialog` / `tauri-plugin-dialog` as dependencies (currently absent, per Q3).
2. **Keep the existing `fs:allow-*` permissions scoped to `$DOCUMENT/**` and `$APPDATA/**`** for the
   legacy/default workspace and app-internal config — do not widen these to `**` or `$HOME/**`. The dynamic
   OR-check in `resolve_path` (Q1) means any *additional* user-picked Workspace root is authorized through
   the runtime scope, not through widening the static capability. This keeps the static declaration
   narrow and auditable, per Tauri's own least-privilege framing (Q4).
3. **Add `tauri-plugin-persisted-scope`**, registered after `fs` in the plugin builder chain, so a picked
   Workspace folder survives app restart without re-prompting the dialog every launch (Q2). No extra
   capability entry is needed for this plugin itself — it operates on the already-shared runtime `Scope`
   object.
4. **Build the "Open Folder" flow as**: call `dialog.open({ directory: true, multiple: false, recursive: true })`
   → this both returns the path *and* (per Q1) automatically extends the runtime fs scope for it,
   recursively, with no further plumbing required. Then persist *which* path was opened as app-level UX
   state (last-used Workspace, list of recent folders) in `tauri-plugin-store` (already a nemos
   dependency) — this is a separate concern from the *access grant* itself (that's persisted-scope's job)
   and is purely "what should the sidebar show / what should auto-open on next launch."
5. **On startup, after persisted-scope restores the fs scope**, re-validate the remembered last-used path
   (`exists()`, then `readDir()`) before trusting it as the active Workspace, since persisted-scope will
   silently re-grant a path even if it's been deleted, renamed, or is on a now-unmounted drive (Q2). Fall
   back to prompting the user to re-pick if validation fails.
6. **Do not add asset-protocol scope changes as a side effect of fs scope changes.** If/when nemos needs to
   render arbitrary images or embeds from a user-picked folder via the asset protocol, that requires its
   own explicit, equally-narrow `app.security.assetProtocol.scope` entry — treat it as a separate decision,
   not bundled into the fs-scope work in #76 (Q4).
7. Keep `recursive` on the dialog-driven grant matched to what nemos actually intends to allow (the whole
   Workspace subtree) — don't request non-recursive grants and then separately widen, and don't request
   recursion on a parent of the picked folder.
