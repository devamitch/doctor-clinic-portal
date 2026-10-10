"use client"

import React from "react"
import { memo } from "react"
import { Box, type BoxProps } from "../core"
import type { Theme } from "@/app/theme-provider"

export interface GridProps extends Omit<BoxProps, "children"> {
  children?: React.ReactNode

  // Grid configuration
  columns?: number
  rows?: number

  // Spacing
  gap?: keyof Theme["spacing"]
  columnGap?: keyof Theme["spacing"]
  rowGap?: keyof Theme["spacing"]

  // Item sizing
  itemMinWidth?: number
  itemMaxWidth?: number
  itemHeight?: number

  // Responsive
  responsive?: boolean
  breakpoints?: {
    phone?: number
    tablet?: number
    desktop?: number
  }
}

export const Grid = memo(
  ({
    children,

    // Grid configuration
    columns = 2,
    rows,

    // Spacing
    gap = "m",
    columnGap,
    rowGap,

    // Item sizing
    itemMinWidth,
    itemMaxWidth,
    itemHeight,

    // Responsive
    responsive = false,
    breakpoints = {
      phone: 1,
      tablet: 2,
      desktop: 3,
    },

    ...restProps
  }: GridProps) => {
    const processedChildren = React.Children.toArray(children).filter(Boolean)

    const getItemWidth = () => {
      if (itemMinWidth || itemMaxWidth) {
        return {
          minWidth: itemMinWidth,
          maxWidth: itemMaxWidth,
        }
      }

      // Calculate width based on columns and gap
      const gapCount = columns - 1
      return {
        width: `${(100 - gapCount * 2) / columns}%`,
      }
    }

    const renderGridItems = () => {
      return processedChildren.map((child, index) => {
        const isLastInRow = (index + 1) % columns === 0
        const isLastRow = Math.floor(index / columns) === Math.floor((processedChildren.length - 1) / columns)

        return (
          <Box
            key={index}
            {...getItemWidth()}
            {...(itemHeight && { height: itemHeight })}
            {...(!isLastInRow && { mr: columnGap || gap })}
            {...(!isLastRow && { mb: rowGap || gap })}
          >
            {child}
          </Box>
        )
      })
    }

    return (
      <Box row wrap {...restProps}>
        {renderGridItems()}
      </Box>
    )
  },
)

Grid.displayName = "Grid"

// Grid item component for more control
export interface GridItemProps extends BoxProps {
  children?: React.ReactNode

  // Grid item span
  colSpan?: number
  rowSpan?: number

  // Grid item positioning
  colStart?: number
  colEnd?: number
  rowStart?: number
  rowEnd?: number
}

export const GridItem = memo(
  ({
    children,

    // Grid item span
    colSpan = 1,
    rowSpan = 1,

    // Grid item positioning
    colStart,
    colEnd,
    rowStart,
    rowEnd,

    ...restProps
  }: GridItemProps) => {
    return <Box {...restProps}>{children}</Box>
  },
)

GridItem.displayName = "GridItem"
