"use client";

import type React from "react";

import { memo } from "react";
import { StyleSheet, View, Pressable } from "react-native";

import { Theme } from "@/theme/theme";

import { Box, type BoxProps } from "./Box";
import { Text } from "./Text";

export type CardProps = {
  children?: React.ReactNode;

  // Card variants
  variant?: "glass" | "glassStrong" | "elevated" | "flat" | "outlined";

  // Header content
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;

  // Footer content
  footer?: React.ReactNode;

  // Interaction
  pressable?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;

  // Layout
  padding?: keyof Theme["spacing"];
  headerPadding?: keyof Theme["spacing"];
  bodyPadding?: keyof Theme["spacing"];
  footerPadding?: keyof Theme["spacing"];

  // Styling
  headerDivider?: boolean;
  footerDivider?: boolean;
} & Omit<BoxProps, "onPress">;

export const Card = memo(
  ({
    children,

    // Card variants
    variant = "glass",

    // Header content
    title,
    subtitle,
    headerAction,

    // Footer content
    footer,

    // Interaction
    pressable = false,
    onPress,
    onLongPress,
    disabled = false,

    // Layout
    padding = "l",
    headerPadding,
    bodyPadding,
    footerPadding,

    // Styling
    headerDivider = false,
    footerDivider = false,

    ...restProps
  }: CardProps) => {
    const getCardProps = () => {
      switch (variant) {
        case "glassStrong":
          return {
            glass: true,
            glassVariant: "strong" as const,
            border: true,
            shadow: "medium" as const,
          };
        case "elevated":
          return {
            backgroundColor: "surfaceElevated",
            shadow: "large" as const,
          };
        case "flat":
          return {
            backgroundColor: "backgroundTertiary",
          };
        case "outlined":
          return {
            backgroundColor: "backgroundTertiary",
            border: true,
          };
        default: // glass
          return {
            glass: true,
            glassVariant: "medium" as const,
            shadow: "small" as const,
          };
      }
    };

    const cardProps = getCardProps();
    const hasHeader = title || subtitle || headerAction;
    const hasFooter = footer;

    const CardContainer = pressable ? Pressable : View;

    return (
      <CardContainer
        onPress={pressable ? onPress : undefined}
        onLongPress={pressable ? onLongPress : undefined}
        disabled={disabled}
        style={[pressable && styles.pressable, { opacity: disabled ? 0.6 : 1 }]}
      >
        <Box borderRadius="l" overflow="hidden" {...cardProps} {...restProps}>
          {/* Header */}
          {hasHeader && (
            <>
              <Box row centerVertical p={headerPadding || padding}>
                <Box flex1>
                  {title && (
                    <Text
                      variant="title"
                      color="textPrimary"
                      mb={subtitle ? "xs" : undefined}
                    >
                      {title}
                    </Text>
                  )}
                  {subtitle && (
                    <Text variant="bodySmall" color="textSecondary">
                      {subtitle}
                    </Text>
                  )}
                </Box>
                {headerAction && <Box ml="m">{headerAction}</Box>}
              </Box>
              {headerDivider && (
                <Box
                  height={StyleSheet.hairlineWidth}
                  backgroundColor="border"
                  mx={padding}
                />
              )}
            </>
          )}

          {/* Body */}
          {children && <Box p={bodyPadding || padding}>{children}</Box>}

          {/* Footer */}
          {hasFooter && (
            <>
              {footerDivider && (
                <Box
                  height={StyleSheet.hairlineWidth}
                  backgroundColor="border"
                  mx={padding}
                />
              )}
              <Box p={footerPadding || padding}>{footer}</Box>
            </>
          )}
        </Box>
      </CardContainer>
    );
  }
);

Card.displayName = "Card";

const styles = StyleSheet.create({
  pressable: {
    transform: [{ scale: 1 }],
  },
});
