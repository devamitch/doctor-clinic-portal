"use client"

import type React from "react"
import { memo, useCallback, useEffect } from "react"
import { StyleSheet, View, Pressable, Modal, Dimensions } from "react-native"
import { BlurView } from "@react-native-community/blur"
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
import { X } from "lucide-react-native"
import { Box, Text } from "@/theme/theme"
import { useThemeStore } from "@/stores/themeStore"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

export interface GlassModalProps {
  isVisible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: "small" | "medium" | "large" | "fullscreen"
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  animationType?: "slide" | "fade" | "scale"
  blurType?: "light" | "dark" | "regular"
  blurAmount?: number
}

export const GlassModal = memo(
  ({
    isVisible,
    onClose,
    title,
    children,
    size = "medium",
    showCloseButton = true,
    closeOnBackdrop = true,
    animationType = "scale",
    blurType = "light",
    blurAmount = 15,
  }: GlassModalProps) => {
    const { theme, isDark } = useThemeStore()

    const opacity = useSharedValue(0)
    const scale = useSharedValue(0.8)
    const translateY = useSharedValue(50)

    const handleClose = useCallback(() => {
      onClose()
    }, [onClose])

    const handleBackdropPress = useCallback(() => {
      if (closeOnBackdrop) {
        handleClose()
      }
    }, [closeOnBackdrop, handleClose])

    useEffect(() => {
      if (isVisible) {
        opacity.value = withTiming(1, { duration: 300 })
        if (animationType === "scale") {
          scale.value = withSpring(1, { damping: 20, stiffness: 200 })
        } else if (animationType === "slide") {
          translateY.value = withSpring(0, { damping: 20, stiffness: 200 })
        }
      } else {
        opacity.value = withTiming(0, { duration: 200 })
        if (animationType === "scale") {
          scale.value = withTiming(0.8, { duration: 200 })
        } else if (animationType === "slide") {
          translateY.value = withTiming(50, { duration: 200 })
        }
      }
    }, [isVisible, animationType, opacity, scale, translateY])

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }))

    const modalAnimatedStyle = useAnimatedStyle(() => {
      const transform = []

      if (animationType === "scale") {
        transform.push({ scale: scale.value })
      } else if (animationType === "slide") {
        transform.push({ translateY: translateY.value })
      }

      return {
        opacity: opacity.value,
        transform,
      }
    })

    const getModalSize = () => {
      switch (size) {
        case "small":
          return { width: Math.min(320, screenWidth - 32), maxHeight: screenHeight * 0.4 }
        case "large":
          return { width: Math.min(600, screenWidth - 32), maxHeight: screenHeight * 0.8 }
        case "fullscreen":
          return { width: screenWidth, height: screenHeight }
        default:
          return { width: Math.min(400, screenWidth - 32), maxHeight: screenHeight * 0.6 }
      }
    }

    const modalSize = getModalSize()
    const effectiveBlurType = isDark ? "dark" : blurType

    return (
      <Modal visible={isVisible} transparent animationType="none" statusBarTranslucent>
        <View style={styles.overlay}>
          <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
          </Animated.View>

          <Animated.View style={[styles.modalContainer, modalAnimatedStyle]}>
            <Box
              variant={size === "fullscreen" ? "fullscreen" : "modal"}
              style={[styles.modal, modalSize]}
              overflow="hidden"
            >
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType={effectiveBlurType}
                blurAmount={blurAmount}
                reducedTransparencyFallbackColor={theme.colors.glassBackgroundStrong}
              />

              <View style={styles.content}>
                {/* Header */}
                {(title || showCloseButton) && (
                  <View style={styles.header}>
                    <View style={styles.titleContainer}>
                      {title && (
                        <Text variant="title" color="textPrimary">
                          {title}
                        </Text>
                      )}
                    </View>
                    {showCloseButton && (
                      <Pressable onPress={handleClose} style={styles.closeButton}>
                        <X size={24} color={theme.colors.textPrimary} />
                      </Pressable>
                    )}
                  </View>
                )}

                {/* Body */}
                <View style={styles.body}>{children}</View>
              </View>
            </Box>
          </Animated.View>
        </View>
      </Modal>
    )
  },
)

GlassModal.displayName = "GlassModal"

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    borderRadius: 20,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  titleContainer: {
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 16,
  },
  body: {
    flex: 1,
    padding: 20,
  },
})
