"use client"

import type React from "react"
import { memo } from "react"
import { StyleSheet } from "react-native"
import { Box, Text, HStack } from "@/components/ui/core"

export interface ListSectionProps {
  /**
   * Content
   */
  title: string
  subtitle?: string
  rightContent?: React.ReactNode
  children?: React.ReactNode

  /**
   * Styling
   */
  variant?: "default" | "glass" | "card" | "minimal"
  divider?: boolean
  collapsible?: boolean
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export const ListSection = memo(
  ({
    // Content
    title,
    subtitle,
    rightContent,
    children,

    // Styling
    variant = "default",
    divider = false,
    collapsible = false,
    collapsed = false,
    onToggleCollapse,
  }: ListSectionProps) => {
    // Get container props based on variant
    const getContainerProps = () => {
      switch (variant) {
        case "glass":
          return {
            glass: true,
            glassVariant: "medium" as const,
            borderRadius: "m" as const,
            mb: "s" as const,
          }
        case "card":
          return {
            backgroundColor: "backgroundSecondary" as const,
            borderRadius: "m" as const,
            shadow: "small" as const,
            mb: "s" as const,
          }
        case "minimal":
          return {
            backgroundColor: "transparent" as const,
            mb: "xs" as const,
          }
        default:
          return {
            backgroundColor: "backgroundSecondary" as const,
            mb: "s" as const,
          }
      }
    }

    // Get header props based on variant
    const getHeaderProps = () => {
      switch (variant) {
        case "minimal":
          return {
            px: "s" as const,
            py: "xs" as const,
          }
        default:
          return {
            px: "m" as const,
            py: "s" as const,
          }
      }
    }

    return (
      <Box mb="m">
        <Box {...getContainerProps()}>
          <Box {...getHeaderProps()}>
            <HStack justify="between" centerVertical>
              <Box flex1>
                <Text
                  variant={variant === "minimal" ? "caption" : "subheader"}
                  color={variant === "minimal" ? "textSecondary" : "textPrimary"}
                  textTransform={variant === "minimal" ? "uppercase" : "none"}
                >
                  {title}
                </Text>
                {subtitle && (
                  <Text variant="caption" color="textSecondary" mt="xxs">
                    {subtitle}
                  </Text>
                )}
              </Box>
              {rightContent && <Box>{rightContent}</Box>}
            </HStack>
          </Box>

          {divider && <Box height={StyleSheet.hairlineWidth} backgroundColor="border" />}

          {!collapsed && children && <Box>{children}</Box>}
        </Box>
      </Box>
    )
  },
)

ListSection.displayName = "ListSection"
