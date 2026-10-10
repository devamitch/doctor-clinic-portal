"use client"

import type { Theme } from "@/theme/theme"
import type React from "react"

import { BlurView } from "@react-native-community/blur"
import { createText } from "@shopify/restyle"
import { useEffect } from "react"
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { BorderlessButton, RectButton, type BaseButtonProps } from "react-native-gesture-handler"
import LinearGradient from "react-native-linear-gradient"
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"

import { useThemeStore } from "@/stores/themeStore"

const Text = createText<Theme>()

export type GlassButtonProps = {
  text?: React.ReactNode | string
  onPress?: ((pointerInside?: boolean) => void | Promise<void>) | (() => void | Promise<void>)
  variant?: "glass" | "glassStrong" | "gradient" | "borderless"
  size?: "small" | "medium" | "large"
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  loadingColor?: string
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  icon?: React.ReactNode
  iconPosition?: "left" | "right"

  // Glass-specific props
  blurType?: "light" | "dark" | "regular"
  blurAmount?: number
  gradientColors?: string[]
  glassOpacity?: number

  // RectButton specific props
  underlayColor?: string
  activeOpacity?: number

  // BorderlessButton specific props
  borderless?: boolean

  // Animation props
  pressAnimationScale?: number
  springConfig?: {
    damping?: number
    stiffness?: number
    mass?: number
  }

  // Loading props
  loadingText?: string
  showLoadingText?: boolean
} & Omit<BaseButtonProps, "onPress">

export const GlassButton: React.FC<GlassButtonProps> = ({
  text,
  onPress,
  variant = "glass",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  loadingColor,
  style,
  textStyle,
  icon,
  iconPosition = "left",
  blurType = "light",
  blurAmount = 10,
  gradientColors,
  glassOpacity = 0.3,
  underlayColor,
  activeOpacity = 0.8,
  borderless = true,
  pressAnimationScale = 0.97,
  springConfig = {
    damping: 10,
    stiffness: 100,
    mass: 0.5,
  },
  loadingText = "Loading...",
  showLoadingText = false,
  rippleColor,
  exclusive = true,
  delayLongPress = 600,
  onActiveStateChange,
  onLongPress,
  ...restProps
}) => {
  const { theme } = useThemeStore()

  // Animation values
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)
  const loadingOpacity = useSharedValue(0)

  // Handle button press
  const handlePress = async () => {
    if (!disabled && !loading) {
      try {
        await onPress?.()
      } catch (error) {
        console.error("Button press error:", error)
      }
    }
  }

  // Handle active state change with animation
  const handleActiveStateChange = (active: boolean) => {
    if (disabled || loading) return

    scale.value = withSpring(active ? pressAnimationScale : 1, springConfig)

    // Call original onActiveStateChange if provided
    if (onActiveStateChange) {
      runOnJS(onActiveStateChange)(active)
    }
  }

  // Handle loading state changes
  useEffect(() => {
    opacity.value = withTiming(disabled ? 0.6 : 1, { duration: 200 })
    loadingOpacity.value = withTiming(loading ? 1 : 0, { duration: 300 })
  }, [disabled, loading, opacity, loadingOpacity])

  // Button animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }
  })

  // Loading overlay animated style
  const loadingOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: loadingOpacity.value,
      transform: [
        {
          scale: interpolate(loadingOpacity.value, [0, 1], [0.8, 1]),
        },
      ],
    }
  })

  // Content animated style
  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(loadingOpacity.value, [0, 1], [1, 0]),
    }
  })

  // Get button dimensions based on size
  const getButtonStyle = () => {
    const baseStyle: any = {
      width: fullWidth ? "100%" : "auto",
      minWidth: fullWidth ? undefined : 120,
    }

    switch (size) {
      case "small":
        return { ...baseStyle, height: 40, borderRadius: 20, paddingHorizontal: 16 }
      case "large":
        return { ...baseStyle, height: 60, borderRadius: 30, paddingHorizontal: 32 }
      default:
        return { ...baseStyle, height: 50, borderRadius: 25, paddingHorizontal: 24 }
    }
  }

  // Get text style based on size
  const getTextStyle = () => {
    switch (size) {
      case "small":
        return { fontSize: 14 }
      case "large":
        return { fontSize: 18 }
      default:
        return { fontSize: 16 }
    }
  }

  // Get colors based on variant
  const getColors = () => {
    switch (variant) {
      case "glassStrong":
        return {
          backgroundColor: theme.colors.glassBackgroundStrong,
          textColor: theme.colors.textPrimary,
          loadingColor: loadingColor || theme.colors.primary,
        }
      case "gradient":
        return {
          backgroundColor: "transparent",
          textColor: theme.colors.backgroundTertiary,
          loadingColor: loadingColor || theme.colors.backgroundTertiary,
        }
      case "borderless":
        return {
          backgroundColor: "transparent",
          textColor: theme.colors.primary,
          loadingColor: loadingColor || theme.colors.primary,
        }
      default:
        return {
          backgroundColor: theme.colors.glassBackground,
          textColor: theme.colors.textPrimary,
          loadingColor: loadingColor || theme.colors.primary,
        }
    }
  }

  const colors = getColors()

  // Render background based on variant
  const renderBackground = () => {
    if (variant === "gradient") {
      return (
        <LinearGradient
          colors={gradientColors || [theme.colors.primary, theme.colors.primaryDark]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )
    }

    if (variant === "borderless") {
      return null
    }

    return (
      <BlurView
        style={StyleSheet.absoluteFillObject}
        blurType={blurType}
        blurAmount={blurAmount}
        reducedTransparencyFallbackColor={colors.backgroundColor}
      />
    )
  }

  // Common button content
  const renderContent = () => (
    <>
      <Animated.View style={[styles.contentContainer, contentStyle]}>
        {icon && iconPosition === "left" && <View style={styles.iconLeft}>{icon}</View>}
        <Text style={[styles.text, { color: colors.textColor }, getTextStyle(), textStyle]}>
          {text}
        </Text>
        {icon && iconPosition === "right" && <View style={styles.iconRight}>{icon}</View>}
      </Animated.View>

      {/* Loading overlay */}
      <Animated.View style={[styles.loadingOverlay, loadingOverlayStyle]} pointerEvents="none">
        <ActivityIndicator color={colors.loadingColor} size="small" />
        {showLoadingText && (
          <Text
            style={[styles.loadingText, { color: colors.textColor }, getTextStyle(), textStyle]}
          >
            {loadingText}
          </Text>
        )}
      </Animated.View>
    </>
  )

  // Common button props
  const commonProps = {
    onPress: handlePress,
    onActiveStateChange: handleActiveStateChange,
    onLongPress,
    exclusive,
    delayLongPress,
    enabled: !disabled && !loading,
    rippleColor: rippleColor || (variant !== "borderless" ? "rgba(255, 255, 255, 0.3)" : undefined),
    ...restProps,
  }

  // Render based on variant
  if (variant === "borderless") {
    return (
      <BorderlessButton
        {...commonProps}
        borderless={borderless}
        activeOpacity={activeOpacity}
        style={[
          styles.button,
          getButtonStyle(),
          { backgroundColor: colors.backgroundColor },
          style,
        ]}
      >
        <Animated.View style={[styles.buttonContent, animatedStyle]}>
          <View accessible accessibilityRole="button">
            {renderContent()}
          </View>
        </Animated.View>
      </BorderlessButton>
    )
  }

  // Default to RectButton with glass effect
  return (
    <RectButton
      {...commonProps}
      underlayColor={underlayColor || colors.backgroundColor}
      activeOpacity={activeOpacity}
      style={[styles.button, getButtonStyle(), style]}
    >
      <View
        style={[
          styles.buttonContent,
          { overflow: "hidden", borderRadius: getButtonStyle().borderRadius },
        ]}
      >
        {renderBackground()}
        <Animated.View style={[styles.contentWrapper, animatedStyle]}>
          <View accessible accessibilityRole="button">
            {renderContent()}
          </View>
        </Animated.View>
      </View>
    </RectButton>
  )
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
})
