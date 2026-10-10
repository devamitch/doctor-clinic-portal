"use client";
import type { Theme } from "@/context/theme-context";

import { memo } from "react";
import { StyleSheet } from "react-native";

import { Box, type BoxProps } from "./Box";

export type DividerProps = {
  // Divider orientation
  orientation?: "horizontal" | "vertical";

  // Divider variants
  variant?: "solid" | "dashed" | "dotted" | "glass";

  // Divider thickness
  thickness?: number;

  // Divider length
  length?: number | string;

  // Spacing around divider
  spacing?: keyof Theme["spacing"];

  // Color
  color?: string;

  // Glass effect
  glass?: boolean;
} & Omit<BoxProps, "children">;

export const Divider = memo(
  ({
    // Divider orientation
    orientation = "horizontal",

    // Divider variants
    variant = "solid",

    // Divider thickness
    thickness,

    // Divider length
    length = "100%",

    // Spacing around divider
    spacing = "m",

    // Color
    color,

    // Glass effect
    glass = false,

    ...restProps
  }: DividerProps) => {
    const isHorizontal = orientation === "horizontal";
    const defaultThickness = thickness || StyleSheet.hairlineWidth;

    const getDividerStyle = () => {
      const baseStyle = {
        backgroundColor: color || (glass ? "transparent" : "border"),
        ...(isHorizontal
          ? {
              width: length,
              height: defaultThickness,
              marginVertical: spacing,
            }
          : {
              height: length,
              width: defaultThickness,
              marginHorizontal: spacing,
            }),
      };

      switch (variant) {
        case "dashed":
          return {
            ...baseStyle,
            borderStyle: "dashed",
            borderWidth: defaultThickness,
            backgroundColor: "transparent",
            borderColor: color || "border",
          };

        case "dotted":
          return {
            ...baseStyle,
            borderStyle: "dotted",
            borderWidth: defaultThickness,
            backgroundColor: "transparent",
            borderColor: color || "border",
          };

        case "glass":
          return {
            ...baseStyle,
            backgroundColor: "transparent",
          };

        default: // solid
          return baseStyle;
      }
    };

    const dividerStyle = getDividerStyle();

    return (
      <Box
        {...dividerStyle}
        {...(glass && {
          glass: true,
          glassVariant: "light" as const,
          border: true,
        })}
        {...restProps}
      />
    );
  }
);

Divider.displayName = "Divider";
