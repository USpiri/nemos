import { useEffect, useState } from "react";

type ThemeType = "system" | "dark" | "light";

// TODO:
// - Load color schemes dynamically
// - Create a cusotm hook to handle configs

export const AppearanceConfig = () => {
  const [theme, setTheme] = useState<ThemeType>(
    () => (localStorage.getItem("theme") as ThemeType) ?? "system",
  );
  const [colorScheme, setColorScheme] = useState<string | null>(() =>
    JSON.parse(localStorage.getItem("color-scheme") ?? "null"),
  );

  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const applyTheme = (selectedTheme: ThemeType) => {
    localStorage.setItem("theme", selectedTheme);

    if (selectedTheme === "system") return;
    if (selectedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const onMediaColorChange = () => {
    const matchDark = media.matches;
    if (matchDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    if (theme === "system") {
      media.addEventListener("change", onMediaColorChange);
      applyTheme("system");
    } else {
      media.removeEventListener("change", onMediaColorChange);
      applyTheme(theme);
    }

    return () => {
      media.removeEventListener("change", onMediaColorChange);
    };
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
