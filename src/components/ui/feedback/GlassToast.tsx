"use client"
import { memo, useCallback, useEffect } from "react"
import { StyleSheet, View, Pressable, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BlurView } from "@react-native-community/blur"
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, runOnJS } from "react-native-reanimated"
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react-native"
import { Box, Text } from "@/theme/theme"
import { useThemeStore } from "@/stores/themeStore"

const { width: screenWidth } = Dimensions.get("window")

export type ToastType = "success" | "error" | "warning" | "info"

export interface GlassToastProps {
  isVisible: boolean
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: () => void
  position?: "top" | "bottom"
  showCloseButton?: boolean
  blurType?: "light" | "dark" | "regular"
  blurAmount?: number
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const toastColors = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
} as const

export const GlassToast = memo(
  ({
    isVisible,
    type,
    title,
    message,
    duration = 4000,
    onClose,
    position = "top",
    showCloseButton = true,
    blurType = "light",
    blurAmount = 15,
  }: GlassToastProps) => {
    const { theme, isDark } = useThemeStore()
    const insets = useSafeAreaInsets()

    const translateY = useSharedValue(position === "top" ? -100 : 100)
    const opacity = useSharedValue(0)

    const handleClose = useCallback(() => {
      onClose()
    }, [onClose])

    useEffect(() => {
      if (isVisible) {
        opacity.value = withTiming(1, { duration: 300 })
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 })

        if (duration > 0) {
          const timer = setTimeout(() => {
            runOnJS(handleClose)()
          }, duration)

          return () => clearTimeout(timer)
        }
      } else {
        opacity.value = withTiming(0, { duration: 200 })
        translateY.value = withTiming(position === "top" ? -100 : 100, { duration: 200 })
      }
    }, [isVisible, duration, handleClose, opacity, translateY, position])

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    }))

    const Icon = toastIcons[type]
    const iconColor = theme.colors[toastColors[type]]
    const effectiveBlurType = isDark ? "dark" : blurType

    const containerStyle = {
      top: position === "top" ? insets.top + 16 : undefined,
      bottom: position === "bottom" ? insets.bottom + 16 : undefined,
    }

    if (!isVisible) return null

    return (
      <Animated.View style={[styles.container, containerStyle, animatedStyle]}>
        <Box style={styles.toast} overflow="hidden">
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={effectiveBlurType}
            blurAmount={blurAmount}
            reducedTransparencyFallbackColor={theme.colors.glassBackgroundStrong}
          />

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Icon size={24} color={iconColor} />
            </View>

            <View style={styles.textContainer}>
              <Text variant="body" color="textPrimary" fontWeight="600">
                {title}
              </Text>
              {message && (
                <Text variant="bodySmall" color="textSecondary" marginTop="xxs">
                  {message}
                </Text>
              )}
            </View>

            {showCloseButton && (
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <X size={20} color={theme.colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </Box>
      </Animated.View>
    )
  },
)

GlassToast.displayName = "GlassToast"

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toast: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    zIndex: 1,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
    marginTop: -2,
  },
})
