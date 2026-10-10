import type { Theme as NavigationTheme } from "@react-navigation/native"
import { lightColors } from "./colors"
import type { Theme } from "./theme"

/**
 * Creates a React Navigation theme that matches our app theme
 */
export const createNavigationTheme = (theme: Theme): NavigationTheme => {
  const isLightTheme = theme.colors === lightColors

  return {
    dark: !isLightTheme,
    colors: {
      // Primary color for screen backgrounds
      background: theme.colors.backgroundPrimary,

      // Color for cards, modals, and screens
      card: theme.colors.glassBackgroundStrong,

      // Text color for headers, titles, and labels
      text: theme.colors.textPrimary,

      // Primary color for interactive elements
      primary: theme.colors.primary,

      // Color for borders between elements
      border: theme.colors.border,

      // Color for tab bar icons and labels
      notification: theme.colors.error,
    },
  }
}

/**
 * Default header styles that match our glassmorphic design
 */
export const defaultHeaderStyles = (theme: Theme) => ({
  headerStyle: {
    backgroundColor: theme.colors.glassBackgroundStrong,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTintColor: theme.colors.textPrimary,
  headerTitleStyle: {
    fontWeight: "600",
  },
})

/**
 * Glass header styles with stronger blur effect
 */
export const glassHeaderStyles = (theme: Theme) => ({
  headerStyle: {
    backgroundColor: theme.colors.glassBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTintColor: theme.colors.textPrimary,
  headerTitleStyle: {
    fontWeight: "600",
  },
})

/**
 * Primary colored header styles
 */
export const primaryHeaderStyles = (theme: Theme) => ({
  headerStyle: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTintColor: "#FFFFFF",
  headerTitleStyle: {
    fontWeight: "600",
  },
})

/**
 * Tab bar styles that match our glassmorphic design
 */
export const defaultTabBarStyles = (theme: Theme) => ({
  tabBarStyle: {
    backgroundColor: theme.colors.glassBackgroundStrong,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    height: 60,
    paddingBottom: 8,
  },
  tabBarActiveTintColor: theme.colors.primary,
  tabBarInactiveTintColor: theme.colors.textSecondary,
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: "500",
  },
})
