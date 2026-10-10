"use client"

import type React from "react"
import { forwardRef, memo, useCallback } from "react"
import {
  FlatList,
  type FlatListProps,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  type ListRenderItem,
} from "react-native"
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated"
import { Box, Text } from "@/components/ui/core"
import { useThemeStore } from "@/stores/themeStore"

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

export interface GlassFlatListProps<T> extends Omit<FlatListProps<T>, "renderItem"> {
  /**
   * Glass effect for the container
   */
  glass?: boolean
  glassVariant?: "light" | "medium" | "strong"

  /**
   * Render item function
   */
  renderItem: ListRenderItem<T>

  /**
   * Content container styling
   */
  contentContainerStyle?: FlatListProps<T>["contentContainerStyle"]
  contentInset?: { top?: number; left?: number; bottom?: number; right?: number }

  /**
   * Padding and spacing
   */
  spacing?: "none" | "xs" | "s" | "m" | "l" | "xl"
  itemSpacing?: "none" | "xs" | "s" | "m" | "l" | "xl"

  /**
   * Pull to refresh functionality
   */
  refreshing?: boolean
  onRefresh?: () => void

  /**
   * Infinite scroll
   */
  onEndReached?: () => void
  onEndReachedThreshold?: number
  loadingMore?: boolean

  /**
   * Scroll position
   */
  scrollY?: Animated.SharedValue<number>

  /**
   * Empty state
   */
  ListEmptyComponent?: React.ReactElement
  emptyText?: string
  isLoading?: boolean

  /**
   * Section headers
   */
  stickyHeaderIndices?: number[]
  stickySectionHeadersEnabled?: boolean

  /**
   * Separator
   */
  ItemSeparatorComponent?: React.ComponentType<any> | null
  showSeparators?: boolean
}

export const GlassFlatList = memo(
  forwardRef<FlatList, GlassFlatListProps<any>>(
    (
      {
        glass = false,
        glassVariant = "light",
        renderItem,
        contentContainerStyle,
        contentInset,
        spacing = "m",
        itemSpacing = "s",
        refreshing = false,
        onRefresh,
        onEndReached,
        onEndReachedThreshold = 0.5,
        loadingMore = false,
        scrollY,
        ListEmptyComponent,
        emptyText = "No items found",
        isLoading = false,
        stickyHeaderIndices,
        stickySectionHeadersEnabled = false,
        ItemSeparatorComponent,
        showSeparators = false,
        ListHeaderComponent,
        ListFooterComponent,
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
        },
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

      // Get item spacing
      const getItemSpacing = useCallback(() => {
        switch (itemSpacing) {
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
      }, [itemSpacing, theme.spacing])

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

      // Default empty component
      const defaultEmptyComponent = (
        <Box flex1 center p="xl">
          <Text variant="body" color="textSecondary" textAlign="center">
            {emptyText}
          </Text>
        </Box>
      )

      // Default separator component
      const defaultSeparatorComponent = () => (
        <Box height={StyleSheet.hairlineWidth} backgroundColor="border" my={getItemSpacing()} />
      )

      // Loading footer component
      const renderFooter = () => {
        if (!loadingMore) return ListFooterComponent || null

        return (
          <>
            {ListFooterComponent}
            <Box p="m" center>
              <ActivityIndicator color={theme.colors.primary} />
            </Box>
          </>
        )
      }

      return (
        <Box flex1 glass={glass} glassVariant={glassVariant}>
          <AnimatedFlatList
            ref={ref}
            contentContainerStyle={combinedContentContainerStyle}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={renderRefreshControl()}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            ListEmptyComponent={isLoading ? null : ListEmptyComponent || defaultEmptyComponent}
            ItemSeparatorComponent={showSeparators ? ItemSeparatorComponent || defaultSeparatorComponent : undefined}
            stickyHeaderIndices={stickyHeaderIndices}
            stickySectionHeadersEnabled={stickySectionHeadersEnabled}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={renderFooter()}
            renderItem={renderItem}
            {...rest}
          />
        </Box>
      )
    },
  ),
)

GlassFlatList.displayName = "GlassFlatList"
