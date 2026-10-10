"use client"

import type React from "react"
import { memo } from "react"
import { createText, type TextProps as RestyleTextProps } from "@shopify/restyle"
import type { Theme } from "@/theme/theme"

const RestyleText = createText<Theme>()

export interface TextProps extends RestyleTextProps<Theme> {
  children?: React.ReactNode

  // Typography shortcuts
  h1?: boolean
  h2?: boolean
  h3?: boolean
  h4?: boolean
  body?: boolean
  caption?: boolean
  overline?: boolean

  // Style shortcuts
  bold?: boolean
  semiBold?: boolean
  medium?: boolean
  light?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean

  // Color shortcuts
  primary?: boolean
  secondary?: boolean
  success?: boolean
  error?: boolean
  warning?: boolean
  info?: boolean
  muted?: boolean

  // Alignment shortcuts
  center?: boolean
  left?: boolean
  right?: boolean
  justify?: boolean

  // Size shortcuts
  xs?: boolean
  sm?: boolean
  md?: boolean
  lg?: boolean
  xl?: boolean
  xxl?: boolean

  // Spacing shortcuts
  noMargin?: boolean
  noWrap?: boolean

  // Interaction
  pressable?: boolean
  onPress?: () => void
  disabled?: boolean
}

export const Text = memo(
  ({
    children,

    // Typography shortcuts
    h1 = false,
    h2 = false,
    h3 = false,
    h4 = false,
    body = false,
    caption = false,
    overline = false,

    // Style shortcuts
    bold = false,
    semiBold = false,
    medium = false,
    light = false,
    italic = false,
    underline = false,
    strikethrough = false,

    // Color shortcuts
    primary = false,
    secondary = false,
    success = false,
    error = false,
    warning = false,
    info = false,
    muted = false,

    // Alignment shortcuts
    center = false,
    left = false,
    right = false,
    justify = false,

    // Size shortcuts
    xs = false,
    sm = false,
    md = false,
    lg = false,
    xl = false,
    xxl = false,

    // Spacing shortcuts
    noMargin = false,
    noWrap = false,

    // Interaction
    pressable = false,
    onPress,
    disabled = false,

    ...restProps
  }: TextProps) => {
    // Build variant prop
    const variant = (() => {
      if (h1) return "display"
      if (h2) return "header"
      if (h3) return "subheader"
      if (h4) return "title"
      if (body) return "body"
      if (caption) return "caption"
      if (overline) return "overline"
      return restProps.variant || "body"
    })()

    // Build font weight
    const fontWeight = (() => {
      if (bold) return "700"
      if (semiBold) return "600"
      if (medium) return "500"
      if (light) return "300"
      return restProps.fontWeight
    })()

    // Build color
    const color = (() => {
      if (primary) return "primary"
      if (secondary) return "textSecondary"
      if (success) return "success"
      if (error) return "error"
      if (warning) return "warning"
      if (info) return "info"
      if (muted) return "textTertiary"
      return restProps.color || "textPrimary"
    })()

    // Build text align
    const textAlign = (() => {
      if (center) return "center"
      if (left) return "left"
      if (right) return "right"
      if (justify) return "justify"
      return restProps.textAlign
    })()

    // Build font size
    const fontSize = (() => {
      if (xs) return 10
      if (sm) return 12
      if (md) return 14
      if (lg) return 18
      if (xl) return 24
      if (xxl) return 32
      return restProps.fontSize
    })()

    // Build text decoration
    const textDecorationLine = (() => {
      if (underline && strikethrough) return "underline line-through"
      if (underline) return "underline"
      if (strikethrough) return "line-through"
      return restProps.textDecorationLine || "none"
    })()

    const textProps = {
      variant,
      color,
      fontWeight,
      textAlign,
      fontSize,
      textDecorationLine,
      fontStyle: italic ? "italic" : restProps.fontStyle,
      ...(noMargin && { margin: 0 }),
      ...(noWrap && { numberOfLines: 1 }),
      ...restProps,
    }

    if (pressable && onPress) {
      return (
        <RestyleText
          {...textProps}
          style={[{ opacity: disabled ? 0.6 : 1 }, restProps.style]}
          onPress={disabled ? undefined : onPress}
        >
          {children}
        </RestyleText>
      )
    }

    return <RestyleText {...textProps}>{children}</RestyleText>
  },
)

Text.displayName = "Text"
