# Two-layer settings: global defaults and workspace overrides

Settings are resolved through two layers: a **Global Settings** file in the OS app data directory, and a **Workspace Settings** file at `.config/settings.json` inside each Workspace root. The effective value for any setting is the workspace override if present, otherwise the global value. Workspace Settings are a sparse delta — only keys the user has explicitly changed are stored.

Global Settings are not writable through the Settings UI; they serve as a manually-editable baseline. The Settings UI writes exclusively to Workspace Settings, and is only accessible when a Workspace is open. The UI distinguishes overridden values (workspace layer) from inherited ones (global layer) and exposes both a per-setting revert-to-global action and a full reset-to-hardcoded-defaults action.

The alternative was a single global settings file. We rejected it because users wanted the ability to have different preferences per Workspace (e.g. different themes for work vs. personal workspaces) without losing a sensible app-wide baseline. A full per-workspace copy was also rejected in favour of a sparse delta to make it unambiguous whether a setting has been explicitly overridden or is just inheriting the global value.

The `.config` folder is hidden from the Workspace file tree via the existing dot-prefix filter.
