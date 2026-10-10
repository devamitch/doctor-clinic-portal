"use client"
import { memo } from "react"
import { Box, type BoxProps } from "./Box"
import type { Theme } from "@/theme"

export interface SpacerProps extends Omit<BoxProps, "children"> {
  // Spacer size
  size?: keyof Theme["spacing"] | number

  // Spacer direction
  direction?: "horizontal" | "vertical" | "both"

  // Flex spacer (takes available space)
  flex?: boolean
}

export const Spacer = memo(
  ({
    // Spacer size
    size = "m",

    // Spacer direction
    direction = "vertical",

    // Flex spacer
    flex = false,

    ...restProps
  }: SpacerProps) => {
    const getSpacerProps = () => {
      if (flex) {
        return { flex: 1 }
      }

      const spacing = typeof size === "number" ? size : undefined
      const spacingKey = typeof size === "string" ? size : undefined

      switch (direction) {
        case "horizontal":
          return spacing ? { width: spacing } : { width: spacingKey }

        case "both":
          return spacing ? { width: spacing, height: spacing } : { width: spacingKey, height: spacingKey }

        default: // vertical
          return spacing ? { height: spacing } : { height: spacingKey }
      }
    }

    return <Box {...getSpacerProps()} {...restProps} />
  },
)

Spacer.displayName = "Spacer"
