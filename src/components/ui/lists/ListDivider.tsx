"use client"

import { memo } from "react"
import { StyleSheet } from "react-native"
import { Box } from "@/components/ui/core"

export interface ListDividerProps {
  /**
   * Styling
   */
  variant?: "line" | "spacer" | "dotted"
  spacing?: "none" | "xs" | "s" | "m" | "l" | "xl"
  inset?: boolean | number
  color?: string
}

export const ListDivider = memo(
  ({
    // Styling
    variant = "line",
    spacing = "s",
    inset = false,
    color,
  }: ListDividerProps) => {
    // Get margin based on spacing
    const getMargin = () => {
      switch (spacing) {
        case "none":
          return { my: 0 as const }
        case "xs":
          return { my: "xs" as const }
        case "s":
          return { my: "s" as const }
        case "l":
          return { my: "l" as const }
        case "xl":
          return { my: "xl" as const }
        default:
          return { my: "m" as const }
      }
    }

    // Get horizontal inset
    const getInset = () => {
      if (inset === false) return {}
      if (typeof inset === "number") return { mx: inset }
      return { mx: "l" as const }
    }

    // Render divider based on variant
    switch (variant) {
      case "spacer":
        return <Box height={spacing === "none" ? 1 : 8} />
      case "dotted":
        return (
          <Box
            height={StyleSheet.hairlineWidth}
            backgroundColor={color || "border"}
            {...getMargin()}
            {...getInset()}
            style={{ borderStyle: "dotted" }}
          />
        )
      default:
        return (
          <Box height={StyleSheet.hairlineWidth} backgroundColor={color || "border"} {...getMargin()} {...getInset()} />
        )
    }
  },
)

ListDivider.displayName = "ListDivider"
