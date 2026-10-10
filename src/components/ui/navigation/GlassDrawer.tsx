"use client"

import type React from "react"
import { memo, useCallback } from "react"
import { StyleSheet, View, Pressable, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BlurView } from "@react-native-community/blur"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { X, User, Settings, HelpCircle, LogOut } from "lucide-react-native"
import { Box, Text } from "@/theme/theme"
import { useThemeStore } from "@/stores/themeStore"

export interface DrawerItem {
  id: string
  label: string
  icon: React.ComponentType<{ size: number; color: string }>
  onPress: () => void
  badge?: number
  divider?: boolean
}

export interface GlassDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: DrawerItem[]
  userInfo?: {
    name: string
    email: string
    avatar?: string
  }
  blurType?: "light" | "dark" | "regular"
  blurAmount?: number
}

const defaultItems: DrawerItem[] = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    onPress: () => console.log("Profile"),
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    onPress: () => console.log("Settings"),
  },
  {
    id: "help",
    label: "Help & Support",
    icon: HelpCircle,
    onPress: () => console.log("Help"),
    divider: true,
  },
  {
    id: "logout",
    label: "Logout",
    icon: LogOut,
    onPress: () => console.log("Logout"),
  },
]

export const GlassDrawer = memo(
  ({ isOpen, onClose, items = defaultItems, userInfo, blurType = "light", blurAmount = 15 }: GlassDrawerProps) => {
    const { theme, isDark } = useThemeStore()
    const insets = useSafeAreaInsets()

    const translateX = useSharedValue(isOpen ? 0 : -300)

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: withSpring(translateX.value, { damping: 20, stiffness: 200 }) }],
    }))

    const handleClose = useCallback(() => {
      onClose()
    }, [onClose])

    const effectiveBlurType = isDark ? "dark" : blurType

    if (!isOpen) return null

    return (
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <Animated.View style={[styles.drawer, { paddingTop: insets.top }, animatedStyle]}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={effectiveBlurType}
            blurAmount={blurAmount}
            reducedTransparencyFallbackColor={theme.colors.glassBackgroundStrong}
          />

          {/* Header */}
          <Box variant="drawer" style={styles.header}>
            <View style={styles.headerContent}>
              <Text variant="title" color="textPrimary">
                Menu
              </Text>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <X size={24} color={theme.colors.textPrimary} />
              </Pressable>
            </View>
          </Box>

          {/* User Info */}
          {userInfo && (
            <Box padding="l" borderBottomWidth={1} borderBottomColor="border">
              <View style={styles.userInfo}>
                <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                  <Text variant="title" color="backgroundTertiary">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text variant="body" color="textPrimary" fontWeight="600">
                    {userInfo.name}
                  </Text>
                  <Text variant="bodySmall" color="textSecondary">
                    {userInfo.email}
                  </Text>
                </View>
              </View>
            </Box>
          )}

          {/* Menu Items */}
          <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <DrawerMenuItem key={item.id} item={item} onClose={handleClose} />
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    )
  },
)

interface DrawerMenuItemProps {
  item: DrawerItem
  onClose: () => void
}

const DrawerMenuItem = memo(({ item, onClose }: DrawerMenuItemProps) => {
  const { theme } = useThemeStore()
  const scale = useSharedValue(1)

  const handlePress = useCallback(() => {
    item.onPress()
    onClose()
  }, [item, onClose])

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 200 })
  }, [scale])

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 })
  }, [scale])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const Icon = item.icon

  return (
    <>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.menuItem}
        accessibilityRole="menuitem"
      >
        <Animated.View style={[styles.menuItemContent, animatedStyle]}>
          <Icon size={20} color={theme.colors.textSecondary} />
          <Text variant="body" color="textPrimary" marginLeft="m">
            {item.label}
          </Text>
          {item.badge && item.badge > 0 && (
            <View style={[styles.itemBadge, { backgroundColor: theme.colors.error }]}>
              <Text variant="caption" color="backgroundTertiary">
                {item.badge}
              </Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
      {item.divider && <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />}
    </>
  )
})

DrawerMenuItem.displayName = "DrawerMenuItem"
GlassDrawer.displayName = "GlassDrawer"

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    padding: 8,
  },
  menuItem: {
    marginVertical: 2,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  itemBadge: {
    marginLeft: "auto",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
    marginHorizontal: 16,
  },
})
