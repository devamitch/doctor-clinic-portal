"use client";

import type React from "react";

import { ThemeProvider as RestyleThemeProvider } from "@shopify/restyle";
import { useEffect } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useThemeStore } from "@/stores/themeStore";
import { darkTheme } from "@/theme/theme";

import { ErrorBoundary } from "../components";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { colorScheme, theme, setColorScheme } = useThemeStore();

  // Update theme based on system preference when colorScheme is 'system'
  useEffect(() => {
    if (colorScheme === "system") {
      setColorScheme("system");
    }
  }, [systemColorScheme, colorScheme, setColorScheme]);

  // Get status bar style based on theme
  const statusBarStyle = theme === darkTheme ? "light-content" : "dark-content";

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <RestyleThemeProvider theme={theme}>
            <StatusBar
              barStyle={statusBarStyle}
              backgroundColor="transparent"
              translucent
            />
            {children}
          </RestyleThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};
