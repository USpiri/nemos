import { ThemeType } from "@/models/theme.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  theme: ThemeType;
  colorScheme: string | null;
  setTheme: (theme: ThemeType) => void;
  setColorScheme: (theme: string | null) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "system",
      colorScheme: null,
      setTheme: (theme) => {
        set({ theme });
      },
      setColorScheme: (colorScheme) => {
        set({ colorScheme });
      },
    }),
    {
      name: "theme",
    },
  ),
);
