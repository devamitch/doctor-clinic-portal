"use client"

import React, { memo, useCallback } from "react"
import { Pressable, StyleSheet } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { ChevronRight } from "lucide-react-native"
import { Box, Text, HStack, VStack } from "@/components/ui/core"
import { useThemeStore } from "@/stores/themeStore"

export interface ListItemProps {
  /**
   * Content
   */
  title: string
  subtitle?: string
  description?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  badge?: React.ReactNode | number | string

  /**
   * Styling
   */
  variant?: "default" | "glass" | "card" | "minimal"
  size?: "small" | "medium" | "large"
  divider?: boolean
  disabled?: boolean

  /**
   * Interaction
   */
  onPress?: () => void
  onLongPress?: () => void
  showChevron?: boolean
  selected?: boolean
  selectable?: boolean
  swipeable?: boolean
  swipeActions?: React.ReactNode
}

export const ListItem = memo(
  ({
    // Content
    title,
    subtitle,
    description,
    leftIcon,
    rightIcon,
    leftContent,
    rightContent,
    badge,

    // Styling
    variant = "default",
    size = "medium",
    divider = false,
    disabled = false,

    // Interaction
    onPress,
    onLongPress,
    showChevron = false,
    selected = false,
    selectable = false,
    swipeable = false,
    swipeActions,
  }: ListItemProps) => {
    const { theme } = useThemeStore()
    const scale = useSharedValue(1)

    const handlePressIn = useCallback(() => {
      if (onPress || onLongPress) {
        scale.value = withSpring(0.98, { damping: 15, stiffness: 200 })
      }
    }, [onPress, onLongPress, scale])

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 })
    }, [scale])

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }))

    // Get padding based on size
    const getPadding = () => {
      switch (size) {
        case "small":
          return { px: "s" as const, py: "xs" as const }
        case "large":
          return { px: "l" as const, py: "m" as const }
        default:
          return { px: "m" as const, py: "s" as const }
      }
    }

    // Get container props based on variant
    const getContainerProps = () => {
      switch (variant) {
        case "glass":
          return {
            glass: true,
            glassVariant: "light" as const,
            borderRadius: "m" as const,
            mb: "xs" as const,
          }
        case "card":
          return {
            backgroundColor: "backgroundSecondary" as const,
            borderRadius: "m" as const,
            shadow: "small" as const,
            mb: "xs" as const,
          }
        case "minimal":
          return {
            backgroundColor: "transparent" as const,
          }
        default:
          return {
            backgroundColor: "backgroundSecondary" as const,
          }
      }
    }

    // Render badge
    const renderBadge = () => {
      if (!badge) return null

      if (React.isValidElement(badge)) {
        return badge
      }

      return (
        <Box backgroundColor="primary" borderRadius="full" px="s" py="xxs" minWidth={20} height={20} center ml="s">
          <Text variant="caption" color="backgroundTertiary" textAlign="center">
            {badge}
          </Text>
        </Box>
      )
    }

    // Render right content
    const renderRightContent = () => {
      if (rightContent) {
        return rightContent
      }

      if (rightIcon) {
        return rightIcon
      }

      if (showChevron) {
        return <ChevronRight size={18} color={theme.colors.textSecondary} />
      }

      return null
    }

    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        onLongPress={disabled ? undefined : onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={({ pressed }) => [
          styles.pressable,
          {
            opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
          },
        ]}
      >
        <Animated.View style={animatedStyle}>
          <Box {...getContainerProps()} {...getPadding()}>
            <HStack spacing="m" centerVertical>
              {leftContent || leftIcon ? (
                <Box mr="s" center>
                  {leftContent || leftIcon}
                </Box>
              ) : null}

              <VStack flex1 spacing="xxs">
                <HStack spacing="xs" centerVertical>
                  <Text
                    variant={size === "small" ? "bodySmall" : "body"}
                    color={selected ? "primary" : "textPrimary"}
                    fontWeight={selected ? "600" : "400"}
                    flex1
                    numberOfLines={1}
                  >
                    {title}
                  </Text>
                  {renderBadge()}
                </HStack>

                {subtitle && (
                  <Text variant="bodySmall" color="textSecondary" numberOfLines={1}>
                    {subtitle}
                  </Text>
                )}

                {description && (
                  <Text variant="caption" color="textTertiary" numberOfLines={2} mt="xxs">
                    {description}
                  </Text>
                )}
              </VStack>

              {renderRightContent() && <Box ml="s">{renderRightContent()}</Box>}
            </HStack>
          </Box>

          {divider && <Box height={StyleSheet.hairlineWidth} backgroundColor="border" />}
        </Animated.View>
      </Pressable>
    )
  },
)

ListItem.displayName = "ListItem"

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },
})
