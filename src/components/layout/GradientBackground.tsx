import type React from "react"
import type { ViewStyle } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { useThemeStore } from "@/stores/themeStore"

type GradientBackgroundProps = {
  children: React.ReactNode
  style?: ViewStyle
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, style }) => {
  const { theme } = useThemeStore()

  return (
    <LinearGradient
      colors={[theme.colors.gradientStart, theme.colors.gradientMiddle, theme.colors.gradientEnd]}
      style={[{ flex: 1 }, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  )
}
