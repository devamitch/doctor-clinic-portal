"use client"

import React, { forwardRef, memo, useCallback } from "react"
import {
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  RefreshControl,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native"
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated"
import { Box } from "@/components/ui/core"
import { useThemeStore } from "@/stores/themeStore"

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)

export interface GlassScrollViewProps extends ScrollViewProps {
  /**
   * Glass effect for the container
   */
  glass?: boolean
  glassVariant?: "light" | "medium" | "strong"

  /**
   * Content container styling
   */
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"]
  contentInset?: { top?: number; left?: number; bottom?: number; right?: number }

  /**
   * Padding and spacing
   */
  spacing?: "none" | "xs" | "s" | "m" | "l" | "xl"

  /**
   * Pull to refresh functionality
   */
  refreshing?: boolean
  onRefresh?: () => void

  /**
   * Scroll events
   */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onScrollBeginDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onScrollEndDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onMomentumScrollBegin?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void

  /**
   * Scroll position
   */
  scrollY?: Animated.SharedValue<number>

  /**
   * Empty state
   */
  ListEmptyComponent?: React.ReactElement
  isLoading?: boolean
}

export const GlassScrollView = memo(
  forwardRef<ScrollView, GlassScrollViewProps>(
    (
      {
        glass = false,
        glassVariant = "light",
        contentContainerStyle,
        contentInset,
        spacing = "m",
        refreshing = false,
        onRefresh,
        onScroll,
        onScrollBeginDrag,
        onScrollEndDrag,
        onMomentumScrollBegin,
        onMomentumScrollEnd,
        scrollY,
        ListEmptyComponent,
        isLoading = false,
        children,
        ...rest
      },
      ref,
    ) => {
      const { theme } = useThemeStore()

      // Create a shared value for scroll position if not provided
      const defaultScrollY = useSharedValue(0)
      const scrollYValue = scrollY || defaultScrollY

      // Handle scroll events
      const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
          scrollYValue.value = event.contentOffset.y
          if (onScroll) {
            onScroll(event)
          }
        },
        onBeginDrag: onScrollBeginDrag,
        onEndDrag: onScrollEndDrag,
        onMomentumBegin: onMomentumScrollBegin,
        onMomentumEnd: onMomentumScrollEnd,
      })

      // Get padding based on spacing prop
      const getPadding = useCallback(() => {
        switch (spacing) {
          case "none":
            return 0
          case "xs":
            return theme.spacing.xs
          case "s":
            return theme.spacing.s
          case "l":
            return theme.spacing.l
          case "xl":
            return theme.spacing.xl
          default:
            return theme.spacing.m
        }
      }, [spacing, theme.spacing])

      // Combine content container styles
      const combinedContentContainerStyle = [
        spacing !== "none" && { padding: getPadding() },
        contentInset && {
          paddingTop: contentInset.top,
          paddingLeft: contentInset.left,
          paddingBottom: contentInset.bottom,
          paddingRight: contentInset.right,
        },
        { flexGrow: 1 },
        contentContainerStyle,
      ]

      // Render refresh control if onRefresh is provided
      const renderRefreshControl = () => {
        if (!onRefresh) return undefined

        return (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.backgroundSecondary}
          />
        )
      }

      // Render content
      const renderContent = () => {
        if (React.Children.count(children) === 0 && ListEmptyComponent && !isLoading) {
          return ListEmptyComponent
        }
        return children
      }

      return (
        <Box flex1 glass={glass} glassVariant={glassVariant}>
          <AnimatedScrollView
            ref={ref}
            contentContainerStyle={combinedContentContainerStyle}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={renderRefreshControl()}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            {...rest}
          >
            {renderContent()}
          </AnimatedScrollView>
        </Box>
      )
    },
  ),
)

GlassScrollView.displayName = "GlassScrollView"

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
