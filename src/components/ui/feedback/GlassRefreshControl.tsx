"use client"

import { memo } from "react"
import { RefreshControl, type RefreshControlProps } from "react-native"
import { useThemeStore } from "@/stores/themeStore"

export interface GlassRefreshControlProps extends Omit<RefreshControlProps, "colors" | "tintColor"> {
  /**
   * Custom styling
   */
  variant?: "primary" | "secondary" | "accent"
}

export const GlassRefreshControl = memo(({ variant = "primary", ...rest }: GlassRefreshControlProps) => {
  const { theme } = useThemeStore()

  const getColors = () => {
    switch (variant) {
      case "secondary":
        return {
          tintColor: theme.colors.secondary,
          colors: [theme.colors.secondary],
        }
      case "accent":
        return {
          tintColor: theme.colors.accent,
          colors: [theme.colors.accent],
        }
      default:
        return {
          tintColor: theme.colors.primary,
          colors: [theme.colors.primary],
        }
    }
  }

  const colors = getColors()

  return <RefreshControl {...colors} progressBackgroundColor={theme.colors.glassBackgroundMedium} {...rest} />
})

GlassRefreshControl.displayName = "GlassRefreshControl"
