import { useEffect, useState } from "react";
import { create } from "zustand";

type ThemeType = "system" | "dark" | "light";

// TODO:
// - Load color schemes dynamically
// - Create a cusotm hook to handle configs
// - Move zustand store

interface ThemeStore {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const useThemeStore = create<ThemeStore>()((set) => ({
  theme: (localStorage.getItem("theme") as ThemeType) || "system",
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
  },
}));

export const AppearanceConfig = () => {
  const { theme, setTheme } = useThemeStore();
  const [colorScheme, setColorScheme] = useState<string | null>(() =>
    JSON.parse(localStorage.getItem("color-scheme") ?? "null"),
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const systemMedia = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const systemDark = systemMedia.matches;
      if (theme === "dark" || (theme === "system" && systemDark)) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };
    applyTheme();

    if (theme === "system") {
      systemMedia.addEventListener("change", applyTheme);
    }
    return () => systemMedia.removeEventListener("change", applyTheme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("color-scheme", JSON.stringify(colorScheme));
    if (!colorScheme) {
      document.documentElement.removeAttribute("data-color-scheme");
    } else {
      document.documentElement.setAttribute("data-color-scheme", colorScheme);
    }
  }, [colorScheme]);

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
