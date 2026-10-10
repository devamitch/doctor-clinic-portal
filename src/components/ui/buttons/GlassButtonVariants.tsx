"use client"

import type React from "react"
import { GlassButton, type GlassButtonProps } from "../base/GlassButton"
import { useThemeStore } from "@/stores/themeStore"

// Predefined button variants
export interface GlassButtonVariantProps extends Omit<GlassButtonProps, "variant" | "gradientColors"> {
  size?: "small" | "medium" | "large"
  fullWidth?: boolean
}

// Primary Glass Button
export const PrimaryGlassButton: React.FC<GlassButtonVariantProps> = ({ style, textStyle, ...props }) => {
  const { theme } = useThemeStore()

  return (
    <GlassButton
      {...props}
      variant="gradient"
      gradientColors={[theme.colors.primary, theme.colors.primaryDark]}
      style={[
        {
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
        style,
      ]}
      textStyle={[{ color: theme.colors.backgroundTertiary, fontWeight: "600" }, textStyle]}
    />
  )
}

// Secondary Glass Button
export const SecondaryGlassButton: React.FC<GlassButtonVariantProps> = ({ style, textStyle, ...props }) => {
  const { theme } = useThemeStore()

  return (
    <GlassButton
      {...props}
      variant="glassStrong"
      style={[
        {
          borderWidth: 1,
          borderColor: theme.colors.borderStrong,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        },
        style,
      ]}
      textStyle={[{ color: theme.colors.primary, fontWeight: "600" }, textStyle]}
    />
  )
}

// Success Glass Button
export const SuccessGlassButton: React.FC<GlassButtonVariantProps> = ({ style, textStyle, ...props }) => {
  const { theme } = useThemeStore()

  return (
    <GlassButton
      {...props}
      variant="gradient"
      gradientColors={[theme.colors.success, "#2ECC71"]}
      style={[
        {
          shadowColor: theme.colors.success,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
        style,
      ]}
      textStyle={[{ color: theme.colors.backgroundTertiary, fontWeight: "600" }, textStyle]}
    />
  )
}

// Danger Glass Button
export const DangerGlassButton: React.FC<GlassButtonVariantProps> = ({ style, textStyle, ...props }) => {
  const { theme } = useThemeStore()

  return (
    <GlassButton
      {...props}
      variant="gradient"
      gradientColors={[theme.colors.error, "#E74C3C"]}
      style={[
        {
          shadowColor: theme.colors.error,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
        style,
      ]}
      textStyle={[{ color: theme.colors.backgroundTertiary, fontWeight: "600" }, textStyle]}
    />
  )
}

// Warning Glass Button
export const WarningGlassButton: React.FC<GlassButtonVariantProps> = ({ style, textStyle, ...props }) => {
  const { theme } = useThemeStore()

  return (
    <GlassButton
      {...props}
      variant="gradient"
      gradientColors={[theme.colors.warning, "#F39C12"]}
      style={[
        {
          shadowColor: theme.colors.warning,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
        style,
      ]}
      textStyle={[{ color: theme.colors.backgroundTertiary, fontWeight: "600" }, textStyle]}
    />
  )
}

// Ghost Glass Button
export const GhostGlassButton: React.FC<GlassButtonVariantProps> = ({ style, textStyle, ...props }) => {
  const { theme } = useThemeStore()

  return (
    <GlassButton
      {...props}
      variant="glass"
      style={[
        {
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: "transparent",
        },
        style,
      ]}
      textStyle={[{ color: theme.colors.textPrimary, fontWeight: "500" }, textStyle]}
    />
  )
}

// Icon Glass Button
export const IconGlassButton: React.FC<GlassButtonVariantProps> = ({ size = "medium", style, ...props }) => {
  const { theme } = useThemeStore()

  const getIconButtonStyle = () => {
    switch (size) {
      case "small":
        return { width: 40, height: 40, borderRadius: 20 }
      case "large":
        return { width: 60, height: 60, borderRadius: 30 }
      default:
        return { width: 50, height: 50, borderRadius: 25 }
    }
  }

  return (
    <GlassButton
      {...props}
      variant="glassStrong"
      size={size}
      style={[
        getIconButtonStyle(),
        {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        },
        style,
      ]}
    />
  )
}

// Text Glass Button
export const TextGlassButton: React.FC<GlassButtonVariantProps> = ({ style, textStyle, ...props }) => {
  const { theme } = useThemeStore()

  return (
    <GlassButton
      {...props}
      variant="borderless"
      style={[
        {
          backgroundColor: "transparent",
          paddingHorizontal: 16,
        },
        style,
      ]}
      textStyle={[{ color: theme.colors.primary, fontWeight: "500" }, textStyle]}
    />
  )
}
