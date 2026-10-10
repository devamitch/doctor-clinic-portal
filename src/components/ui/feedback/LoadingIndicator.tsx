"use client"

import React, { memo } from "react"
import { ActivityIndicator, StyleSheet } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated"
import { Box, Text, VStack } from "@/components/ui/core"
import { useThemeStore } from "@/stores/themeStore"

export interface LoadingIndicatorProps {
  /**
   * Content
   */
  message?: string
  size?: "small" | "medium" | "large"

  /**
   * Styling
   */
  variant?: "spinner" | "pulse" | "skeleton"
  color?: string
  overlay?: boolean
}

export const LoadingIndicator = memo(
  ({ message, size = "medium", variant = "spinner", color, overlay = false }: LoadingIndicatorProps) => {
    const { theme } = useThemeStore()
    const opacity = useSharedValue(0.3)

    React.useEffect(() => {
      if (variant === "pulse") {
        opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true)
      }
    }, [variant, opacity])

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }))

    const getSize = () => {
      switch (size) {
        case "small":
          return 20
        case "large":
          return 40
        default:
          return 30
      }
    }

    const renderContent = () => {
      switch (variant) {
        case "pulse":
          return (
            <Animated.View style={[styles.pulseContainer, animatedStyle]}>
              <Box width={getSize()} height={getSize()} borderRadius="full" backgroundColor={color || "primary"} />
            </Animated.View>
          )
        case "skeleton":
          return (
            <VStack spacing="s">
              <Animated.View style={animatedStyle}>
                <Box height={20} backgroundColor="border" borderRadius="s" mb="s" />
                <Box height={16} backgroundColor="border" borderRadius="s" width="80%" mb="s" />
                <Box height={16} backgroundColor="border" borderRadius="s" width="60%" />
              </Animated.View>
            </VStack>
          )
        default:
          return <ActivityIndicator size={size === "small" ? "small" : "large"} color={color || theme.colors.primary} />
      }
    }

    const content = (
      <VStack spacing="m" centerHorizontal>
        {renderContent()}
        {message && (
          <Text variant="body" color="textSecondary" textAlign="center">
            {message}
          </Text>
        )}
      </VStack>
    )

    if (overlay) {
      return (
        <Box style={StyleSheet.absoluteFill} backgroundColor="backgroundOverlay" center zIndex={1000}>
          <Box glass glassVariant="strong" p="xl" borderRadius="l">
            {content}
          </Box>
        </Box>
      )
    }

    return (
      <Box center p="l">
        {content}
      </Box>
    )
  },
)

LoadingIndicator.displayName = "LoadingIndicator"

const styles = StyleSheet.create({
  pulseContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
})
