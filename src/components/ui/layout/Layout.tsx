"use client"

import type React from "react"
import { memo } from "react"
import { ScrollView, type ScrollViewProps } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Box, Container, Surface, type BoxProps } from "../core"
import { GradientBackground } from "@/components/layout/GradientBackground"

export interface LayoutProps extends BoxProps {
  children?: React.ReactNode

  // Layout variants
  variant?: "default" | "gradient" | "glass" | "solid"

  // Scrolling
  scrollable?: boolean
  scrollProps?: Partial<ScrollViewProps>

  // Safe area
  safeArea?: boolean
  safeAreaTop?: boolean
  safeAreaBottom?: boolean

  // Container
  contained?: boolean
  containerSize?: "xs" | "sm" | "md" | "lg" | "xl" | "full"

  // Padding
  padded?: boolean
  paddingSize?: "xs" | "sm" | "md" | "lg" | "xl"

  // Background
  backgroundLevel?: 0 | 1 | 2 | 3 | 4 | 5
}

export const Layout = memo(
  ({
    children,

    // Layout variants
    variant = "default",

    // Scrolling
    scrollable = false,
    scrollProps = {},

    // Safe area
    safeArea = true,
    safeAreaTop = true,
    safeAreaBottom = true,

    // Container
    contained = false,
    containerSize = "full",

    // Padding
    padded = true,
    paddingSize = "md",

    // Background
    backgroundLevel = 0,

    ...restProps
  }: LayoutProps) => {
    const insets = useSafeAreaInsets()

    const getSafeAreaPadding = () => {
      if (!safeArea) return {}

      return {
        ...(safeAreaTop && { paddingTop: insets.top }),
        ...(safeAreaBottom && { paddingBottom: insets.bottom }),
      }
    }

    const renderBackground = () => {
      switch (variant) {
        case "gradient":
          return <GradientBackground />

        case "glass":
          return (
            <Surface
              level={backgroundLevel}
              variant="glass"
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            />
          )

        case "solid":
          return (
            <Surface
              level={backgroundLevel}
              variant="solid"
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            />
          )

        default:
          return null
      }
    }

    const content = contained ? (
      <Container size={containerSize} padded={padded} paddingSize={paddingSize}>
        {children}
      </Container>
    ) : (
      children
    )

    const layoutContent = scrollable ? (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        {content}
      </ScrollView>
    ) : (
      content
    )

    return (
      <Box flex1 {...getSafeAreaPadding()} {...restProps}>
        {renderBackground()}
        {layoutContent}
      </Box>
    )
  },
)

Layout.displayName = "Layout"
