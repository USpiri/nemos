import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeType } from "@/models/theme.interface";
import { useThemeStore } from "@/store/theme/theme.store";

// TODO:
// - Load color schemes dynamically

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const colorSchemes = [
  { value: "default", label: "Default" },
  { value: "custom", label: "Custom" },
  { value: "catppuccin", label: "Catppuccin" },
];

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

        <Select
          defaultValue={theme}
          onValueChange={(theme) => setTheme(theme as ThemeType)}
        >
          <SelectTrigger className="w-full max-w-56 rounded-sm border border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {themes.map((t) => (
              <SelectItem
                className="cursor-pointer rounded-none hover:bg-background-primary-hover"
                value={t.value}
              >
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-full items-center gap-5">
        <div>
          <h2 className="font-medium">Color Scheme</h2>
          <p className="text-sm text-foreground-muted">
            Select from a variety of colors palettes to personalize the
            application's look.
          </p>
        </div>
        <Select
          defaultValue={colorScheme || "default"}
          onValueChange={(scheme) => setColorScheme(scheme)}
        >
          <SelectTrigger className="w-full max-w-56 rounded-sm border border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colorSchemes.map((c) => (
              <SelectItem
                className="cursor-pointer rounded-none hover:bg-background-primary-hover"
                value={c.value}
              >
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
