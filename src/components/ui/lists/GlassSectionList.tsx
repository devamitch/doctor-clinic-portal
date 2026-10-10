"use client"

import type React from "react"
import { forwardRef, memo, useCallback } from "react"
import {
  SectionList,
  type SectionListProps,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  type SectionListRenderItem,
} from "react-native"
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated"
import { Box, Text } from "@/components/ui/core"
import { useThemeStore } from "@/stores/themeStore"

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList)

export interface GlassSectionListProps<T, S> extends Omit<SectionListProps<T, S>, "renderItem"> {
  /**
   * Glass effect for the container
   */
  glass?: boolean
  glassVariant?: "light" | "medium" | "strong"

  /**
   * Render item function
   */
  renderItem: SectionListRenderItem<T, S>

  /**
   * Content container styling
   */
  contentContainerStyle?: SectionListProps<T, S>["contentContainerStyle"]
  contentInset?: { top?: number; left?: number; bottom?: number; right?: number }

  /**
   * Padding and spacing
   */
  spacing?: "none" | "xs" | "s" | "m" | "l" | "xl"
  itemSpacing?: "none" | "xs" | "s" | "m" | "l" | "xl"
  sectionSpacing?: "none" | "xs" | "s" | "m" | "l" | "xl"

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
   * Section styling
   */
  stickyHeaderIndices?: number[]
  stickySectionHeadersEnabled?: boolean
  renderSectionHeader?: SectionListProps<T, S>["renderSectionHeader"]
  sectionStyle?: "default" | "glass" | "card" | "minimal"

  /**
   * Separator
   */
  ItemSeparatorComponent?: React.ComponentType<any> | null
  SectionSeparatorComponent?: React.ComponentType<any> | null
  showItemSeparators?: boolean
  showSectionSeparators?: boolean
}

export const GlassSectionList = memo(
  forwardRef<SectionList, GlassSectionListProps<any, any>>(
    (
      {
        glass = false,
        glassVariant = "light",
        renderItem,
        contentContainerStyle,
        contentInset,
        spacing = "m",
        itemSpacing = "s",
        sectionSpacing = "m",
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
        stickySectionHeadersEnabled = true,
        renderSectionHeader,
        sectionStyle = "default",
        ItemSeparatorComponent,
        SectionSeparatorComponent,
        showItemSeparators = false,
        showSectionSeparators = false,
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

      // Get section spacing
      const getSectionSpacing = useCallback(() => {
        switch (sectionSpacing) {
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
      }, [sectionSpacing, theme.spacing])

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

      // Default section header component
      const defaultSectionHeader = ({ section }: { section: { title: string } }) => {
        switch (sectionStyle) {
          case "glass":
            return (
              <Box glass glassVariant="medium" px="m" py="s" mb="s" borderRadius="m">
                <Text variant="subheader" color="textPrimary">
                  {section.title}
                </Text>
              </Box>
            )
          case "card":
            return (
              <Box backgroundColor="backgroundSecondary" px="m" py="s" mb="s" borderRadius="m" shadow="small">
                <Text variant="subheader" color="textPrimary">
                  {section.title}
                </Text>
              </Box>
            )
          case "minimal":
            return (
              <Box px="s" py="xs" mb="xs">
                <Text variant="caption" color="textSecondary" textTransform="uppercase">
                  {section.title}
                </Text>
              </Box>
            )
          default:
            return (
              <Box backgroundColor="backgroundSecondary" px="m" py="s" mb="s">
                <Text variant="subheader" color="textPrimary">
                  {section.title}
                </Text>
              </Box>
            )
        }
      }

      // Default item separator component
      const defaultItemSeparatorComponent = () => (
        <Box height={StyleSheet.hairlineWidth} backgroundColor="border" my={getItemSpacing()} />
      )

      // Default section separator component
      const defaultSectionSeparatorComponent = () => <Box height={getSectionSpacing()} />

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
          <AnimatedSectionList
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
            ItemSeparatorComponent={
              showItemSeparators ? ItemSeparatorComponent || defaultItemSeparatorComponent : undefined
            }
            SectionSeparatorComponent={
              showSectionSeparators ? SectionSeparatorComponent || defaultSectionSeparatorComponent : undefined
            }
            renderSectionHeader={renderSectionHeader || defaultSectionHeader}
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

GlassSectionList.displayName = "GlassSectionList"
