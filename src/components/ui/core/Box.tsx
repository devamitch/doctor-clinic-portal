"use client";

import type { Theme } from "@/theme/theme";
import type React from "react";

import { BlurView } from "@react-native-community/blur";
import { createBox, type BoxProps as RestyleBoxProps } from "@shopify/restyle";
import { memo } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { withComponentErrorBoundary } from "@/hoc/withErrorBoundary";
import { useThemeStore } from "@/stores/themeStore";
import { getAlphaColor, getSafeColor } from "@/theme/colors";

const RestyleBox = createBox<Theme>();

export type BoxProps = {
  children?: React.ReactNode;

  // Glass effects
  glass?: boolean;
  glassVariant?: "light" | "medium" | "strong" | "ultra";
  blurType?: "light" | "dark" | "regular";
  blurAmount?: number;

  // Gradient effects
  gradient?: boolean;
  gradientColors?: string[];
  gradientDirection?: "horizontal" | "vertical" | "diagonal";
  gradientLocations?: number[];

  // Shadow effects
  shadow?: boolean | "small" | "medium" | "large" | "xl";
  shadowColor?: string;

  // Border effects
  border?: boolean;
  borderGlow?: boolean;

  // Animation
  animated?: boolean;

  // Layout helpers
  center?: boolean;
  centerHorizontal?: boolean;
  centerVertical?: boolean;

  // Common layouts
  row?: boolean;
  column?: boolean;
  wrap?: boolean;

  // Spacing shortcuts
  p?: keyof Theme["spacing"];
  px?: keyof Theme["spacing"];
  py?: keyof Theme["spacing"];
  pt?: keyof Theme["spacing"];
  pb?: keyof Theme["spacing"];
  pl?: keyof Theme["spacing"];
  pr?: keyof Theme["spacing"];
  m?: keyof Theme["spacing"];
  mx?: keyof Theme["spacing"];
  my?: keyof Theme["spacing"];
  mt?: keyof Theme["spacing"];
  mb?: keyof Theme["spacing"];
  ml?: keyof Theme["spacing"];
  mr?: keyof Theme["spacing"];

  // Size shortcuts
  size?: number;
  square?: number;
  circle?: number;

  // Common styles
  fullWidth?: boolean;
  fullHeight?: boolean;
  flex1?: boolean;

  // Interaction
  pressable?: boolean;
  onPress?: () => void;
  disabled?: boolean;
} & RestyleBoxProps<Theme> &
  Omit<ViewProps, "style">;

const BoxComponent = memo(
  ({
    children,

    // Glass effects
    glass = false,
    glassVariant = "medium",
    blurType = "light",
    blurAmount,

    // Gradient effects
    gradient = false,
    gradientColors,
    gradientDirection = "diagonal",
    gradientLocations,

    // Shadow effects
    shadow = false,
    shadowColor,

    // Border effects
    border = false,
    borderGlow = false,

    // Animation
    animated = false,

    // Layout helpers
    center = false,
    centerHorizontal = false,
    centerVertical = false,

    // Common layouts
    row = false,
    column = false,
    wrap = false,

    // Spacing shortcuts
    p,
    px,
    py,
    pt,
    pb,
    pl,
    pr,
    m,
    mx,
    my,
    mt,
    mb,
    ml,
    mr,

    // Size shortcuts
    size,
    square,
    circle,

    // Common styles
    fullWidth = false,
    fullHeight = false,
    flex1 = false,

    // Interaction
    pressable = false,
    onPress,
    disabled = false,

    ...restProps
  }: BoxProps) => {
    const { theme, isDark } = useThemeStore();

    // Build spacing props
    const spacingProps = {
      ...(p && { padding: p }),
      ...(px && { paddingHorizontal: px }),
      ...(py && { paddingVertical: py }),
      ...(pt && { paddingTop: pt }),
      ...(pb && { paddingBottom: pb }),
      ...(pl && { paddingLeft: pl }),
      ...(pr && { paddingRight: pr }),
      ...(m && { margin: m }),
      ...(mx && { marginHorizontal: mx }),
      ...(my && { marginVertical: my }),
      ...(mt && { marginTop: mt }),
      ...(mb && { marginBottom: mb }),
      ...(ml && { marginLeft: ml }),
      ...(mr && { marginRight: mr }),
    };

    // Build layout props
    const layoutProps = {
      ...(row && { flexDirection: "row" as const }),
      ...(column && { flexDirection: "column" as const }),
      ...(wrap && { flexWrap: "wrap" as const }),
      ...(center && {
        alignItems: "center" as const,
        justifyContent: "center" as const,
      }),
      ...(centerHorizontal && { alignItems: "center" as const }),
      ...(centerVertical && { justifyContent: "center" as const }),
      ...(fullWidth && { width: "100%" }),
      ...(fullHeight && { height: "100%" }),
      ...(flex1 && { flex: 1 }),
    };

    // Build size props
    const sizeProps = {
      ...(size && { width: size, height: size }),
      ...(square && { width: square, height: square }),
      ...(circle && {
        width: circle,
        height: circle,
        borderRadius: circle / 2,
      }),
    };

    // Build shadow props
    const shadowProps = (() => {
      if (!shadow) return {};

      const shadowConfigs = {
        small: { shadowRadius: 2, shadowOpacity: 0.1, elevation: 2 },
        medium: { shadowRadius: 4, shadowOpacity: 0.15, elevation: 4 },
        large: { shadowRadius: 8, shadowOpacity: 0.2, elevation: 8 },
        xl: { shadowRadius: 16, shadowOpacity: 0.25, elevation: 16 },
      };

      const config =
        typeof shadow === "string"
          ? shadowConfigs[shadow]
          : shadowConfigs.medium;

      return {
        shadowColor:
          shadowColor || getSafeColor(theme.colors, "shadow", "#000000"),
        shadowOffset: { width: 0, height: 2 },
        ...config,
      };
    })();

    // Build border props
    const borderProps = (() => {
      if (!border && !borderGlow) return {};

      return {
        ...(border && {
          borderWidth: 1,
          borderColor: getSafeColor(theme.colors, "border", "#E0E0E0"),
        }),
        ...(borderGlow && {
          borderWidth: 1,
          borderColor: getSafeColor(theme.colors, "primary", "#007AFF"),
          shadowColor: getSafeColor(theme.colors, "primary", "#007AFF"),
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 4,
        }),
      };
    })();

    // Get glass background color safely
    const getGlassBackground = (): keyof typeof theme.colors => {
      switch (glassVariant) {
        case "light":
          return "glassBackgroundLight";
        case "strong":
          return "glassBackgroundStrong";
        case "ultra":
          return "surfaceElevated";
        default:
          return "glassBackground";
      }
    };

    // Get blur amount
    const getBlurAmount = () => {
      if (blurAmount) return blurAmount;

      switch (glassVariant) {
        case "light":
          return 5;
        case "strong":
          return 15;
        case "ultra":
          return 25;
        default:
          return 10;
      }
    };

    // Get gradient start/end points
    const getGradientPoints = () => {
      switch (gradientDirection) {
        case "horizontal":
          return { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } };
        case "vertical":
          return { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
        default: // diagonal
          return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
      }
    };

    // Render background effects
    const renderBackground = () => {
      try {
        if (gradient) {
          const colors = gradientColors || [
            getSafeColor(theme.colors, "gradientStart", "#87CEEB"),
            getSafeColor(theme.colors, "gradientEnd", "#E0F6FF"),
          ];
          const points = getGradientPoints();

          return (
            <LinearGradient
              colors={colors}
              locations={gradientLocations}
              style={StyleSheet.absoluteFill}
              {...points}
            />
          );
        }

        if (glass) {
          const baseColor = getSafeColor(
            theme.colors,
            getGlassBackground(),
            "#F5F5F5"
          );
          const alphaColor = getAlphaColor(baseColor, 0.4);

          return (
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType={isDark ? "dark" : blurType}
              blurAmount={getBlurAmount()}
              reducedTransparencyFallbackColor={alphaColor}
            />
          );
        }

        return null;
      } catch (error) {
        if (__DEV__) {
          console.warn("Box background render error:", error);
        }
        return null;
      }
    };

    const boxProps = {
      ...spacingProps,
      ...layoutProps,
      ...sizeProps,
      ...shadowProps,
      ...borderProps,
      ...(glass && { backgroundColor: getGlassBackground() }),
      ...restProps,
    };

    if (pressable && onPress) {
      return (
        <RestyleBox
          {...boxProps}
          style={[
            glass && styles.glassContainer,
            { opacity: disabled ? 0.6 : 1 },
          ]}
          onTouchEnd={disabled ? undefined : onPress}
        >
          {renderBackground()}
          <View style={styles.content}>{children}</View>
        </RestyleBox>
      );
    }

    return (
      <RestyleBox
        {...boxProps}
        style={[
          glass && styles.glassContainer,
          { opacity: disabled ? 0.6 : 1 },
        ]}
      >
        {renderBackground()}
        {glass || gradient ? (
          <View style={styles.content}>{children}</View>
        ) : (
          children
        )}
      </RestyleBox>
    );
  }
);

BoxComponent.displayName = "Box";

export const Box = withComponentErrorBoundary(BoxComponent);

const styles = StyleSheet.create({
  glassContainer: {
    overflow: "hidden",
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});
