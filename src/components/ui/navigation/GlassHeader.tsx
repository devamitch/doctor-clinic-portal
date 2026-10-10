"use client"

import type React from "react"
import { memo, useCallback } from "react"
import { StyleSheet, View, Pressable } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BlurView } from "@react-native-community/blur"
import { ArrowLeft, MoreVertical } from "lucide-react-native"
import { Box, Text } from "@/theme/theme"
import { useThemeStore } from "@/stores/themeStore"

export interface GlassHeaderProps {
  title?: string
  subtitle?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onLeftPress?: () => void
  onRightPress?: () => void
  showBackButton?: boolean
  transparent?: boolean
  blurType?: "light" | "dark" | "regular"
  blurAmount?: number
}

export const GlassHeader = memo(
  ({
    title,
    subtitle,
    leftIcon,
    rightIcon,
    onLeftPress,
    onRightPress,
    showBackButton = false,
    transparent = false,
    blurType = "light",
    blurAmount = 15,
  }: GlassHeaderProps) => {
    const { theme, isDark } = useThemeStore()
    const insets = useSafeAreaInsets()

    const handleLeftPress = useCallback(() => {
      onLeftPress?.()
    }, [onLeftPress])

    const handleRightPress = useCallback(() => {
      onRightPress?.()
    }, [onRightPress])

    const effectiveBlurType = isDark ? "dark" : blurType

    return (
      <Box style={[styles.container, { paddingTop: insets.top }]}>
        {!transparent && (
          <>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType={effectiveBlurType}
              blurAmount={blurAmount}
              reducedTransparencyFallbackColor={theme.colors.glassBackgroundStrong}
            />
            <View style={[styles.border, { backgroundColor: theme.colors.border }]} />
          </>
        )}

        <Box variant="header" style={styles.content}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {showBackButton || leftIcon ? (
              <Pressable onPress={handleLeftPress} style={styles.iconButton}>
                {leftIcon || <ArrowLeft size={24} color={theme.colors.textPrimary} />}
              </Pressable>
            ) : (
              <View style={styles.iconPlaceholder} />
            )}
          </View>

          {/* Center Section */}
          <View style={styles.centerSection}>
            {title && (
              <Text variant="title" color="textPrimary" textAlign="center" numberOfLines={1}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text variant="caption" color="textSecondary" textAlign="center" numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            {rightIcon ? (
              <Pressable onPress={handleRightPress} style={styles.iconButton}>
                {rightIcon}
              </Pressable>
            ) : onRightPress ? (
              <Pressable onPress={handleRightPress} style={styles.iconButton}>
                <MoreVertical size={24} color={theme.colors.textPrimary} />
              </Pressable>
            ) : (
              <View style={styles.iconPlaceholder} />
            )}
          </View>
        </Box>
      </Box>
    )
  },
)

GlassHeader.displayName = "GlassHeader"

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 100,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  border: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  leftSection: {
    flex: 1,
    alignItems: "flex-start",
  },
  centerSection: {
    flex: 2,
    alignItems: "center",
  },
  rightSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
  },
})
