"use client"

import React, { memo } from "react"
import { Box, Text, VStack } from "@/components/ui/core"
import { PrimaryButton } from "@/components/ui/buttons/ButtonVariants"

export interface EmptyStateProps {
  /**
   * Content
   */
  title?: string
  message: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void

  /**
   * Styling
   */
  variant?: "default" | "glass" | "card" | "minimal"
  size?: "small" | "medium" | "large"
}

export const EmptyState = memo(
  ({
    // Content
    title,
    message,
    icon,
    actionLabel,
    onAction,

    // Styling
    variant = "default",
    size = "medium",
  }: EmptyStateProps) => {
    // Get container props based on variant
    const getContainerProps = () => {
      switch (variant) {
        case "glass":
          return {
            glass: true,
            glassVariant: "medium" as const,
            borderRadius: "l" as const,
          }
        case "card":
          return {
            backgroundColor: "backgroundSecondary" as const,
            borderRadius: "l" as const,
            shadow: "small" as const,
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

    // Get padding based on size
    const getPadding = () => {
      switch (size) {
        case "small":
          return { p: "m" as const }
        case "large":
          return { p: "xl" as const }
        default:
          return { p: "l" as const }
      }
    }

    // Get icon size based on component size
    const getIconSize = () => {
      switch (size) {
        case "small":
          return 32
        case "large":
          return 64
        default:
          return 48
      }
    }

    return (
      <Box {...getContainerProps()} {...getPadding()} center flex1>
        <VStack spacing="m" centerHorizontal>
          {icon && (
            <Box mb="m" center>
              {React.cloneElement(icon as React.ReactElement, { size: getIconSize() })}
            </Box>
          )}

          {title && (
            <Text variant={size === "small" ? "body" : "title"} color="textPrimary" textAlign="center" fontWeight="600">
              {title}
            </Text>
          )}

          <Text
            variant={size === "small" ? "bodySmall" : "body"}
            color="textSecondary"
            textAlign="center"
            mb={actionLabel ? "m" : undefined}
          >
            {message}
          </Text>

          {actionLabel && onAction && (
            <PrimaryButton text={actionLabel} onPress={onAction} size={size === "small" ? "small" : "medium"} />
          )}
        </VStack>
      </Box>
    )
  },
)

EmptyState.displayName = "EmptyState"
