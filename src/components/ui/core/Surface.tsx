"use client"

import type React from "react"
import { memo } from "react"
import { Box, type BoxProps } from "./Box"

export interface SurfaceProps extends BoxProps {
  children?: React.ReactNode

  // Surface levels
  level?: 0 | 1 | 2 | 3 | 4 | 5

  // Surface variants
  variant?: "glass" | "solid" | "gradient" | "transparent"

  // Quick presets
  modal?: boolean
  sheet?: boolean
  overlay?: boolean
  floating?: boolean
}

export const Surface = memo(
  ({
    children,

    // Surface levels
    level = 1,

    // Surface variants
    variant = "glass",

    // Quick presets
    modal = false,
    sheet = false,
    overlay = false,
    floating = false,

    ...restProps
  }: SurfaceProps) => {
    const getSurfaceProps = () => {
      // Handle presets first
      if (modal) {
        return {
          glass: true,
          glassVariant: "ultra" as const,
          shadow: "xl" as const,
          borderRadius: "xl",
          border: true,
        }
      }

      if (sheet) {
        return {
          glass: true,
          glassVariant: "strong" as const,
          shadow: "large" as const,
          borderTopLeftRadius: "xl",
          borderTopRightRadius: "xl",
          border: true,
        }
      }

      if (overlay) {
        return {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }
      }

      if (floating) {
        return {
          glass: true,
          glassVariant: "medium" as const,
          shadow: "medium" as const,
          borderRadius: "l",
        }
      }

      // Handle variants
      switch (variant) {
        case "solid":
          return {
            backgroundColor:
              level === 0 ? "backgroundPrimary" : level === 1 ? "backgroundSecondary" : "backgroundTertiary",
            shadow: level > 1 ? ("small" as const) : false,
          }

        case "gradient":
          return {
            gradient: true,
            shadow: level > 0 ? ("medium" as const) : false,
          }

        case "transparent":
          return {
            backgroundColor: "transparent",
          }

        default: // glass
          return {
            glass: true,
            glassVariant: level <= 1 ? ("light" as const) : level <= 3 ? ("medium" as const) : ("strong" as const),
            shadow:
              level > 0
                ? level <= 2
                  ? ("small" as const)
                  : level <= 4
                    ? ("medium" as const)
                    : ("large" as const)
                : false,
            border: level > 2,
          }
      }
    }

    const surfaceProps = getSurfaceProps()

    return (
      <Box {...surfaceProps} {...restProps}>
        {children}
      </Box>
    )
  },
)

Surface.displayName = "Surface"
