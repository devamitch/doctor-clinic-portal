"use client"

import type React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { useTheme } from "@shopify/restyle"
import type { Theme } from "@/theme/theme"
import { createNavigationTheme } from "@/theme/navigationTheme"

type ThemedNavigationContainerProps = {
  children: React.ReactNode
}

/**
 * A NavigationContainer that automatically uses our app's theme
 */
export const ThemedNavigationContainer: React.FC<ThemedNavigationContainerProps> = ({ children }) => {
  const theme = useTheme<Theme>()
  const navigationTheme = createNavigationTheme(theme)

  return <NavigationContainer theme={navigationTheme}>{children}</NavigationContainer>
}
