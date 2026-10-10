"use client";

import type React from "react";

import { memo } from "react";

import { Box, type BoxProps } from "./Box";

export type ContainerProps = {
  children?: React.ReactNode;

  // Container sizes
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";

  // Container behavior
  centered?: boolean;
  safeArea?: boolean;
  scrollable?: boolean;

  // Padding presets
  padded?: boolean;
  paddingSize?: "xs" | "sm" | "md" | "lg" | "xl";
} & BoxProps;

export const Container = memo(
  ({
    children,

    // Container sizes
    size = "full",

    // Container behavior
    centered = false,
    safeArea = false,
    scrollable = false,

    // Padding presets
    padded = true,
    paddingSize = "md",

    ...restProps
  }: ContainerProps) => {
    const getContainerWidth = () => {
      switch (size) {
        case "xs":
          return 320;
        case "sm":
          return 480;
        case "md":
          return 768;
        case "lg":
          return 1024;
        case "xl":
          return 1280;
        default:
          return "100%";
      }
    };

    const getPadding = () => {
      if (!padded) return undefined;

      switch (paddingSize) {
        case "xs":
          return "xs";
        case "sm":
          return "s";
        case "lg":
          return "l";
        case "xl":
          return "xl";
        default:
          return "m";
      }
    };

    const containerProps = {
      width: getContainerWidth(),
      ...(centered && { alignSelf: "center" as const }),
      ...(padded && { p: getPadding() }),
      ...(safeArea && { paddingTop: "xl" }),
      ...restProps,
    };

    return <Box {...containerProps}>{children}</Box>;
  }
);

Container.displayName = "Container";
