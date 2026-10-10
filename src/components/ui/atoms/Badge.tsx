"use client"

import type React from "react"
import { memo } from "react"
import { Box, Text } from "@/components/ui/core"

interface BadgeProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info"
  size?: "sm" | "md" | "lg"
}

export const Badge = memo(({ children, variant = "primary", size = "md" }: BadgeProps) => {
  const getVariantProps = () => {
    switch (variant) {
      case "secondary":
        return { backgroundColor: "glassBackgroundStrong", color: "textSecondary" }
      case "success":
        return { backgroundColor: "success", color: "backgroundTertiary" }
      case "warning":
        return { backgroundColor: "warning", color: "backgroundTertiary" }
      case "error":
        return { backgroundColor: "error", color: "backgroundTertiary" }
      case "info":
        return { backgroundColor: "info", color: "backgroundTertiary" }
      default:
        return { backgroundColor: "primary", color: "backgroundTertiary" }
    }
  }

  const getSizeProps = () => {
    switch (size) {
      case "sm":
        return { px: "xs", py: "xxs", fontSize: 10 }
      case "lg":
        return { px: "m", py: "xs", fontSize: 14 }
      default:
        return { px: "s", py: "xs", fontSize: 12 }
    }
  }

  const variantProps = getVariantProps()
  const sizeProps = getSizeProps()

  return (
    <Box borderRadius="round" center {...variantProps} {...sizeProps}>
      <Text variant="caption" color={variantProps.color} fontSize={sizeProps.fontSize} bold>
        {children}
      </Text>
    </Box>
  )
})

Badge.displayName = "Badge"
