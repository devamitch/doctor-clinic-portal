import type { Theme } from "@/theme/theme";
import type React from "react";

import { BlurView } from "@react-native-community/blur";
import { memo } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { __DEV__ } from "@/constants/env";
import { withComponentErrorBoundary } from "@/hoc/withErrorBoundary";
import { useThemeStore } from "@/stores/themeStore";
import { getSafeColor, getAlphaColor } from "@/theme/colors";

import { Box } from "./Box";

export type GlassContainerProps = ViewProps & {
  children: React.ReactNode;
  variant?: keyof Theme["cardVariants"] | "gradient";
  blurType?: "light" | "dark" | "regular";
  blurAmount?: number;
  gradientColors?: string[];
  intensity?: number;
  style?: ViewProps["style"];
};

const GlassContainerComponent = memo(
  ({
    children,
    variant = "glass",
    blurType = "light",
    blurAmount = 10,
    gradientColors,
    intensity = 0.9,
    style,
    ...rest
  }: GlassContainerProps) => {
    const { theme, isDark } = useThemeStore();

    const useGradient = variant === "gradient";
    const colors = gradientColors || [
      getSafeColor(theme.colors, "gradientStart", "#87CEEB"),
      getSafeColor(theme.colors, "gradientEnd", "#E0F6FF"),
    ];
    const effectiveBlurType = isDark ? "dark" : blurType;

    const renderBackground = () => {
      try {
        if (useGradient) {
          return (
            <LinearGradient
              colors={colors}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          );
        }

        const fallbackColor = getSafeColor(
          theme.colors,
          "glassBackground",
          "#F5F5F5"
        );
        const alphaFallback = getAlphaColor(fallbackColor, 0.4);

        return (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={effectiveBlurType}
            blurAmount={blurAmount}
            reducedTransparencyFallbackColor={alphaFallback}
          />
        );
      } catch (error) {
        if (__DEV__) {
          console.warn("GlassContainer background render error:", error);
        }
        // Fallback to solid background
        return (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: getSafeColor(
                  theme.colors,
                  "glassBackground",
                  "#F5F5F5"
                ),
              },
            ]}
          />
        );
      }
    };

    return (
      <Box
        {...rest}
        glass={variant !== "gradient"}
        glassVariant={variant === "gradient" ? "medium" : variant}
        style={[styles.container, style]}
        overflow="hidden"
      >
        {renderBackground()}
        <View style={[styles.content, { opacity: intensity }]}>{children}</View>
      </Box>
    );
  }
);

GlassContainerComponent.displayName = "GlassContainer";

export const GlassContainer = withComponentErrorBoundary(
  GlassContainerComponent
);

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});
