import * as SecureStore from "expo-secure-store";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Uniwind, useUniwind } from "uniwind";

type ThemeName = "light" | "dark";
const THEME_STORAGE_KEY = "illtip-app-theme";

type AppThemeContextType = {
  currentTheme: string;
  isLight: boolean;
  isDark: boolean;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
};

const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined);

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useUniwind();
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
        if (savedTheme === "dark" || savedTheme === "light") {
          Uniwind.setTheme(savedTheme);
        } else {
          // Default to light if no theme saved
          Uniwind.setTheme("light");
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
        Uniwind.setTheme("light");
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const isLight = useMemo(() => {
    return theme === "light";
  }, [theme]);

  const isDark = useMemo(() => {
    return theme === "dark";
  }, [theme]);

  const setTheme = useCallback(async (newTheme: ThemeName) => {
    Uniwind.setTheme(newTheme);
    try {
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  }, []);

  const toggleTheme = useCallback(async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({
      currentTheme: theme,
      isLight,
      isDark,
      setTheme,
      toggleTheme,
    }),
    [theme, isLight, isDark, setTheme, toggleTheme],
  );

  // Prevent rendering children until theme is loaded to avoid flash of wrong theme
  if (!isLoaded) return null;

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
};

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return context;
}
