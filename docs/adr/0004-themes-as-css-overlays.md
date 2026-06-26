# Themes as CSS overlays, not complete skins

Themes are user-installed CSS customizations that are injected **after** the app's base styles. The app's base styles always remain in effect. A Theme that overrides one CSS variable changes only that variable; a Theme that targets `.dark` selectors affects only dark mode. The light/dark/system toggle works independently of Themes.

A Theme is a folder containing a `theme.css` file. The folder name is the Theme's ID. Themes are resolved across two scopes — Global (app data directory) and Workspace (`.config/themes/[ID]/`) — with the Workspace scope taking precedence on ID collision.

The alternative was treating Themes as complete skins that fully replace the app's visual layer. We rejected it for two reasons: first, a complete skin that omits any part of the UI leaves that part broken or invisible with no fallback — a user who ships an incomplete theme ships a broken app. Second, the overlay model naturally supports partial customizations (e.g. only changing the accent color, or only targeting dark mode), which is the majority of what users actually want. The safety guarantee — that the base styles always apply — means a user can never accidentally destroy the UI by dropping in a CSS file.

The light/dark/system toggle was kept as an independent dimension rather than absorbed into the theme system, because themes may legitimately target only one mode and the toggle must remain meaningful regardless of what theme is active.

No stability guarantee is made yet for which CSS variables or classes theme authors can rely on. A public CSS variable contract will be defined as part of a planned CSS classes rethink.
