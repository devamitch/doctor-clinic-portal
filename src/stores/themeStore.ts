import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { lightTheme, darkTheme, type Theme } from "@/theme/theme";

const storage = new MMKV();

const zustandStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.delete(name);
  },
};

export type ColorScheme = "light" | "dark" | "system";

type ThemeState = {
  colorScheme: ColorScheme;
  theme: Theme;
  isDark: boolean;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      colorScheme: "light",
      theme: lightTheme,
      isDark: false,

      setColorScheme: (scheme: ColorScheme) => {
        const isDark =
          scheme === "dark" ||
          (scheme === "system" && /* system dark mode check */ false);

        set({
          colorScheme: scheme,
          theme: isDark ? darkTheme : lightTheme,
          isDark,
        });
      },

      toggleTheme: () => {
        const { colorScheme } = get();
        const newScheme = colorScheme === "light" ? "dark" : "light";
        get().setColorScheme(newScheme);
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ colorScheme: state.colorScheme }),
    }
  )
);
