"use client"

import type React from "react"
import { memo, useCallback } from "react"
import { StyleSheet, View, Pressable } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BlurView } from "@react-native-community/blur"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { Home, Calendar, User, Settings, Heart } from "lucide-react-native"
import { Box, Text } from "@/theme/theme"
import { useThemeStore } from "@/stores/themeStore"

export interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<{ size: number; color: string }>
  badge?: number
}

export interface GlassTabBarProps {
  tabs: TabItem[]
  activeTab: string
  onTabPress: (tabId: string) => void
  blurType?: "light" | "dark" | "regular"
  blurAmount?: number
}

const defaultTabs: TabItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
]

export const GlassTabBar = memo(
  ({ tabs = defaultTabs, activeTab, onTabPress, blurType = "light", blurAmount = 15 }: GlassTabBarProps) => {
    const { theme, isDark } = useThemeStore()
    const insets = useSafeAreaInsets()

    const handleTabPress = useCallback(
      (tabId: string) => {
        onTabPress(tabId)
      },
      [onTabPress],
    )

    const effectiveBlurType = isDark ? "dark" : blurType

    return (
      <Box style={[styles.container, { paddingBottom: insets.bottom }]}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={effectiveBlurType}
          blurAmount={blurAmount}
          reducedTransparencyFallbackColor={theme.colors.glassBackgroundStrong}
        />
        <View style={[styles.border, { backgroundColor: theme.colors.border }]} />

        <Box variant="tabBar" style={styles.content}>
          {tabs.map((tab) => (
            <TabBarItem key={tab.id} tab={tab} isActive={activeTab === tab.id} onPress={() => handleTabPress(tab.id)} />
          ))}
        </Box>
      </Box>
    )
  },
)

interface TabBarItemProps {
  tab: TabItem
  isActive: boolean
  onPress: () => void
}

const TabBarItem = memo(({ tab, isActive, onPress }: TabBarItemProps) => {
  const { theme } = useThemeStore()
  const scale = useSharedValue(1)

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 })
  }, [scale])

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 })
  }, [scale])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const Icon = tab.icon

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabItem}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        <View style={styles.iconContainer}>
          <Icon
            size={24}
            color={isActive ? theme.colors.primary : theme.colors.textSecondary}
            strokeWidth={isActive ? 2.5 : 2}
          />
          {tab.badge && tab.badge > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
              <Text variant="overline" color="backgroundTertiary" fontSize={10}>
                {tab.badge > 99 ? "99+" : tab.badge.toString()}
              </Text>
            </View>
          )}
        </View>
        <Text
          variant="caption"
          color={isActive ? "primary" : "textSecondary"}
          fontWeight={isActive ? "600" : "400"}
          marginTop="xxs"
        >
          {tab.label}
        </Text>
      </Animated.View>
    </Pressable>
  )
})

TabBarItem.displayName = "TabBarItem"
GlassTabBar.displayName = "GlassTabBar"

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  content: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  border: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
})
