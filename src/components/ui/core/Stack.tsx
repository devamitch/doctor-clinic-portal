"use client";

import type { Theme } from "@/theme";

import React, { memo } from "react";

import { Box, type BoxProps } from "./Box";

export type StackProps = {
  children?: React.ReactNode;

  // Stack direction
  direction?: "horizontal" | "vertical";

  // Spacing between items
  spacing?: keyof Theme["spacing"];

  // Alignment
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";

  // Wrapping
  wrap?: boolean;

  // Dividers
  divider?: React.ReactNode;
  showDividers?: boolean;
} & Omit<BoxProps, "children">;

export const Stack = memo(
  ({
    children,

    // Stack direction
    direction = "vertical",

    // Spacing between items
    spacing = "m",

    // Alignment
    align = "stretch",
    justify = "start",

    // Wrapping
    wrap = false,

    // Dividers
    divider,
    showDividers = false,

    ...restProps
  }: StackProps) => {
    const isHorizontal = direction === "horizontal";

    const getAlignItems = () => {
      switch (align) {
        case "start":
          return "flex-start";
        case "center":
          return "center";
        case "end":
          return "flex-end";
        case "stretch":
          return "stretch";
        default:
          return "stretch";
      }
    };

    const getJustifyContent = () => {
      switch (justify) {
        case "start":
          return "flex-start";
        case "center":
          return "center";
        case "end":
          return "flex-end";
        case "between":
          return "space-between";
        case "around":
          return "space-around";
        case "evenly":
          return "space-evenly";
        default:
          return "flex-start";
      }
    };

    const stackProps = {
      flexDirection: isHorizontal ? ("row" as const) : ("column" as const),
      alignItems: getAlignItems(),
      justifyContent: getJustifyContent(),
      ...(wrap && { flexWrap: "wrap" as const }),
      ...restProps,
    };

    // Process children to add spacing and dividers
    const processedChildren = React.Children.toArray(children).filter(Boolean);

    if (processedChildren.length === 0) {
      return <Box {...stackProps} />;
    }

    const childrenWithSpacing = processedChildren.map((child, index) => {
      const isLast = index === processedChildren.length - 1;
      const spacingProp = isHorizontal ? { mr: spacing } : { mb: spacing };

      return (
        <React.Fragment key={index}>
          <Box {...(!isLast ? spacingProp : {})}>{child}</Box>
          {!isLast && showDividers && divider && (
            <Box {...spacingProp}>{divider}</Box>
          )}
        </React.Fragment>
      );
    });

    return <Box {...stackProps}>{childrenWithSpacing}</Box>;
  }
);

Stack.displayName = "Stack";

// Convenience components
export const HStack = memo((props: Omit<StackProps, "direction">) => (
  <Stack direction="horizontal" {...props} />
));
HStack.displayName = "HStack";

export const VStack = memo((props: Omit<StackProps, "direction">) => (
  <Stack direction="vertical" {...props} />
));
VStack.displayName = "VStack";
