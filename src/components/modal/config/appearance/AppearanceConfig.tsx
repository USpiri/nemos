import { ThemeType } from "@/models/theme.interface";
import { useThemeStore } from "@/store/theme/theme.store";

// TODO:
// - Load color schemes dynamically

export const AppearanceConfig = () => {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const setColorScheme = useThemeStore((s) => s.setColorScheme);

  return (
    <>
      <div className="flex w-full items-center gap-5">
        <div>
          <h2 className="font-medium">Theme</h2>
          <p className="text-sm text-foreground-muted">
            Choose the application's display mode: light, dark, or match the
            system's setting.
          </p>
        </div>

        <label className="h-fit w-56 rounded border border-border px-2.5">
          <select
            className="w-full bg-background-primary py-1.5 outline-none"
            onChange={(e) => setTheme(e.target.value as ThemeType)}
            defaultValue={theme}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </label>
      </div>
      <div className="flex w-full items-center gap-5">
        <div>
          <h2 className="font-medium">Color Scheme</h2>
          <p className="text-sm text-foreground-muted">
            Select from a variety of colors palettes to personalize the
            application's look.
          </p>
        </div>
        <label className="h-fit w-56 rounded border border-border px-2.5">
          <select
            className="w-full bg-background-primary py-1.5 outline-none"
            defaultValue={colorScheme ?? undefined}
            onChange={(e) => setColorScheme(e.target.value ?? null)}
          >
            <option value="">Default</option>
            <option value="custom">Custom</option>
            <option value="catppuccin">Catppuccin</option>
          </select>
        </label>
      </div>
    </>
  );
};
