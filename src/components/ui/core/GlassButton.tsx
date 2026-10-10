"use client";

import type React from "react";

import { BlurView } from "@react-native-community/blur";
import { memo, useCallback, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import {
  RectButton,
  BorderlessButton,
  type BaseButtonProps,
} from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from "react-native-reanimated";

import { useThemeStore } from "@/stores/themeStore";
import { Text } from "@/theme/theme";

// Enhanced button size and variant types
export type GlassButtonSize = "small" | "medium" | "large" | "xl";
export type GlassButtonVariant =
  | "glass"
  | "glassStrong"
  | "gradient"
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "ghost"
  | "borderless"
  | "icon"
  | "fab"
  | "ternary"
  | "fourth";

// Predefined gradient colors
export const EnabledPrimaryColors = [
  "#7c0953",
  "#830f4e",
  "#982240",
  "#bb402a",
  "#ea690c",
  "#ff7b00",
];

export const EnabledPrimaryColorLocations = [0.1, 0.2063, 0.3, 0.5, 0.6, 0.7];
export const DisabledColors = ["#AEAEAE", "#898989", "#6A6A6A"];
export const DisabledColorsLocations = [0.2196, 0.4063, 0.6852];
export const EnabledSecondaryColors = ["#0d0c0b", "#000000"];
export const EnabledTernaryColors = ["#252525", "#121212", "#0B0B0B"];

export type GlassButtonProps = {
  // Content props
  text?: React.ReactNode | string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;

  // Event handlers
  onPress?:
    | ((pointerInside?: boolean) => void | Promise<void>)
    | (() => void | Promise<void>);
  onLongPress?: () => void;

  // Appearance
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  fullWidth?: boolean;
  iconPosition?: "left" | "right";

  // State
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  showLoadingText?: boolean;

  // Colors and styling
  backgroundColor?: string;
  textColor?: string;
  loadingColor?: string;
  gradientColors?: string[];
  gradientLocations?: number[];
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;

  // Glass effects
  blurType?: "light" | "dark" | "regular";
  blurAmount?: number;
  glassOpacity?: number;
  glassIntensity?: number;

  // Animation
  pressAnimationScale?: number;
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };

  // Button behavior
  hapticFeedback?: boolean;
  soundFeedback?: boolean;
  underlayColor?: string;
  activeOpacity?: number;
  borderless?: boolean;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
} & Omit<BaseButtonProps, "onPress">;

const AnimatedRectButton = Animated.createAnimatedComponent(RectButton);
const AnimatedBorderlessButton =
  Animated.createAnimatedComponent(BorderlessButton);

export const GlassButton = memo(
  ({
    // Content
    text,
    leftIcon,
    rightIcon,
    children,

    // Events
    onPress,
    onLongPress,

    // Appearance
    variant = "glass",
    size = "medium",
    fullWidth = false,
    iconPosition = "left",

    // State
    disabled = false,
    loading = false,
    loadingText = "Loading...",
    showLoadingText = false,

    // Colors
    backgroundColor,
    textColor,
    loadingColor,
    gradientColors,
    gradientLocations,
    style,
    textStyle,

    // Glass effects
    blurType = "light",
    blurAmount = 10,
    glassOpacity = 0.3,
    glassIntensity = 0.9,

    // Animation
    pressAnimationScale = 0.97,
    springConfig = {
      damping: 10,
      stiffness: 100,
      mass: 0.5,
    },

    // Behavior
    hapticFeedback = true,
    soundFeedback = true,
    underlayColor,
    activeOpacity = 0.8,
    borderless = true,

    // Accessibility
    accessibilityLabel,
    accessibilityHint,
    testID,

    // Other props
    rippleColor,
    exclusive = true,
    delayLongPress = 600,
    ...restProps
  }: GlassButtonProps) => {
    const { theme, isDark } = useThemeStore();

    // Animation values
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const loadingOpacity = useSharedValue(0);
    const glowIntensity = useSharedValue(0);

    // Handle button press with haptic feedback
    const handlePress = useCallback(async () => {
      if (!disabled && !loading) {
        try {
          if (hapticFeedback) {
            // Add haptic feedback here if needed
          }
          await onPress?.();
        } catch (error) {
          console.error("Button press error:", error);
        }
      }
    }, [disabled, loading, onPress, hapticFeedback]);

    // Handle active state changes
    const handleActiveStateChange = useCallback(
      (active: boolean) => {
        if (disabled || loading) return;

        scale.value = withSpring(
          active ? pressAnimationScale : 1,
          springConfig
        );
        glowIntensity.value = withTiming(active ? 1 : 0, { duration: 150 });
      },
      [disabled, loading, pressAnimationScale, springConfig]
    );

    // Handle loading state changes
    useEffect(() => {
      opacity.value = withTiming(disabled ? 0.6 : 1, { duration: 200 });
      loadingOpacity.value = withTiming(loading ? 1 : 0, { duration: 300 });
    }, [disabled, loading]);

    // Get variant-specific configurations
    const variantConfig = useMemo(() => {
      const config = {
        useBlur: true,
        useGradient: false,
        backgroundColor: backgroundColor || theme.colors.glassBackground,
        textColor: textColor || theme.colors.textPrimary,
        borderWidth: 0,
        borderColor: "transparent",
        gradientColors: gradientColors || [
          theme.colors.primary,
          theme.colors.primaryDark,
        ],
        gradientLocations: gradientLocations,
        shadowConfig: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        },
      };

      switch (variant) {
        case "primary":
          return {
            ...config,
            useGradient: true,
            gradientColors: EnabledPrimaryColors,
            gradientLocations: EnabledPrimaryColorLocations,
            textColor: "#FFFFFF",
            shadowConfig: {
              ...config.shadowConfig,
              shadowColor: theme.colors.primary,
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            },
          };

        case "secondary":
          return {
            ...config,
            backgroundColor: theme.colors.glassBackgroundStrong,
            borderWidth: 1,
            borderColor: theme.colors.borderStrong,
            textColor: theme.colors.primary,
          };

        case "success":
          return {
            ...config,
            useGradient: true,
            gradientColors: [theme.colors.success, "#2ECC71"],
            textColor: "#FFFFFF",
            shadowConfig: {
              ...config.shadowConfig,
              shadowColor: theme.colors.success,
              shadowOpacity: 0.3,
            },
          };

        case "danger":
          return {
            ...config,
            useGradient: true,
            gradientColors: [theme.colors.error, "#E74C3C"],
            textColor: "#FFFFFF",
            shadowConfig: {
              ...config.shadowConfig,
              shadowColor: theme.colors.error,
              shadowOpacity: 0.3,
            },
          };

        case "warning":
          return {
            ...config,
            useGradient: true,
            gradientColors: [theme.colors.warning, "#F39C12"],
            textColor: "#FFFFFF",
            shadowConfig: {
              ...config.shadowConfig,
              shadowColor: theme.colors.warning,
              shadowOpacity: 0.3,
            },
          };

        case "info":
          return {
            ...config,
            useGradient: true,
            gradientColors: [theme.colors.info, "#64D2FF"],
            textColor: "#FFFFFF",
          };

        case "ghost":
          return {
            ...config,
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: theme.colors.border,
            textColor: theme.colors.textPrimary,
          };

        case "borderless":
          return {
            ...config,
            useBlur: false,
            backgroundColor: "transparent",
            textColor: theme.colors.primary,
          };

        case "icon":
          return {
            ...config,
            backgroundColor: theme.colors.glassBackgroundStrong,
            borderWidth: 1,
            borderColor: theme.colors.border,
          };

        case "fab":
          return {
            ...config,
            useGradient: true,
            gradientColors: [theme.colors.primary, theme.colors.primaryDark],
            textColor: "#FFFFFF",
            shadowConfig: {
              ...config.shadowConfig,
              shadowColor: theme.colors.primary,
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 16,
            },
          };

        case "ternary":
          return {
            ...config,
            useGradient: true,
            gradientColors: EnabledTernaryColors,
            textColor: "#FFFFFF",
          };

        case "fourth":
          return {
            ...config,
            useGradient: true,
            gradientColors: [
              "#ff7b00",
              "#F8886A",
              "#933920",
              "#252525",
              "#121212",
              "#0B0B0B",
              "#121212",
              "#252525",
              "#933920",
              "#F8886A",
              "#ff7b00",
            ],
            gradientLocations: [
              0.1 / 9,
              0.5 / 9,
              3 / 9,
              4.147 / 9,
              4.15 / 9,
              4.155 / 9,
              4.157 / 9,
              4.2 / 9,
              6 / 9,
              8.965 / 9,
              9 / 9,
            ],
            textColor: "#FFFFFF",
          };

        case "glassStrong":
          return {
            ...config,
            backgroundColor: theme.colors.glassBackgroundStrong,
            borderWidth: 1,
            borderColor: theme.colors.borderStrong,
          };

        case "gradient":
          return {
            ...config,
            useGradient: true,
          };

        default: // glass
          return config;
      }
    }, [
      variant,
      theme,
      backgroundColor,
      textColor,
      gradientColors,
      gradientLocations,
    ]);

    // Get size-specific configurations
    const sizeConfig = useMemo(() => {
      switch (size) {
        case "small":
          return {
            height: 36,
            paddingHorizontal: 12,
            borderRadius: 18,
            fontSize: 14,
            iconSize: 16,
          };
        case "large":
          return {
            height: 56,
            paddingHorizontal: 32,
            borderRadius: 28,
            fontSize: 18,
            iconSize: 24,
          };
        case "xl":
          return {
            height: 64,
            paddingHorizontal: 40,
            borderRadius: 32,
            fontSize: 20,
            iconSize: 28,
          };
        default: // medium
          return {
            height: 48,
            paddingHorizontal: 24,
            borderRadius: 24,
            fontSize: 16,
            iconSize: 20,
          };
      }
    }, [size]);

    // Special handling for icon buttons
    const isIconButton =
      variant === "icon" || (!text && !children && (leftIcon || rightIcon));
    const iconButtonSize = isIconButton
      ? {
          width: sizeConfig.height,
          height: sizeConfig.height,
          paddingHorizontal: 0,
        }
      : {};

    // Animated styles
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    const glowAnimatedStyle = useAnimatedStyle(() => ({
      shadowOpacity: interpolate(
        glowIntensity.value,
        [0, 1],
        [
          variantConfig.shadowConfig.shadowOpacity,
          variantConfig.shadowConfig.shadowOpacity * 2,
        ]
      ),
    }));

    const loadingOverlayStyle = useAnimatedStyle(() => ({
      opacity: loadingOpacity.value,
      transform: [
        { scale: interpolate(loadingOpacity.value, [0, 1], [0.8, 1]) },
      ],
    }));

    const contentStyle = useAnimatedStyle(() => ({
      opacity: interpolate(loadingOpacity.value, [0, 1], [1, 0]),
    }));

    // Render background based on variant
    const renderBackground = () => {
      if (variantConfig.useGradient) {
        return (
          <LinearGradient
            colors={disabled ? DisabledColors : variantConfig.gradientColors}
            locations={
              disabled
                ? DisabledColorsLocations
                : variantConfig.gradientLocations
            }
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            angle={variant === "fourth" ? 21.33 : 150.33}
            useAngle={true}
          />
        );
      }

      if (variantConfig.useBlur) {
        return (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={isDark ? "dark" : blurType}
            blurAmount={blurAmount}
            reducedTransparencyFallbackColor={variantConfig.backgroundColor}
          />
        );
      }

      return null;
    };

    // Render content
    const renderContent = () => (
      <>
        <Animated.View style={[styles.contentContainer, contentStyle]}>
          {leftIcon && iconPosition === "left" && (
            <View style={styles.iconLeft}>{leftIcon}</View>
          )}

          {(text || children) && (
            <View style={styles.textContainer}>
              {text ? (
                <Text
                  style={[
                    styles.text,
                    {
                      color: variantConfig.textColor,
                      fontSize: sizeConfig.fontSize,
                    },
                    textStyle,
                  ]}
                >
                  {text}
                </Text>
              ) : (
                children
              )}
            </View>
          )}

          {rightIcon && iconPosition === "right" && (
            <View style={styles.iconRight}>{rightIcon}</View>
          )}
        </Animated.View>

        {/* Loading overlay */}
        <Animated.View
          style={[styles.loadingOverlay, loadingOverlayStyle]}
          pointerEvents="none"
        >
          <ActivityIndicator
            color={loadingColor || variantConfig.textColor}
            size={size === "small" ? "small" : "small"}
          />
          {showLoadingText && (
            <Text
              style={[
                styles.loadingText,
                { color: variantConfig.textColor },
                textStyle,
              ]}
            >
              {loadingText}
            </Text>
          )}
        </Animated.View>
      </>
    );

    // Common button props
    const commonProps = {
      onPress: handlePress,
      onActiveStateChange: handleActiveStateChange,
      onLongPress,
      exclusive,
      delayLongPress,
      enabled: !disabled && !loading,
      rippleColor:
        rippleColor ||
        (variant !== "borderless" ? "rgba(255, 255, 255, 0.3)" : undefined),
      accessibilityLabel,
      accessibilityHint,
      testID,
      ...restProps,
    };

    const buttonStyle = [
      styles.button,
      {
        height: sizeConfig.height,
        borderRadius: sizeConfig.borderRadius,
        paddingHorizontal: sizeConfig.paddingHorizontal,
        width: fullWidth ? "100%" : "auto",
        backgroundColor: variantConfig.backgroundColor,
        borderWidth: variantConfig.borderWidth,
        borderColor: variantConfig.borderColor,
        ...variantConfig.shadowConfig,
        ...iconButtonSize,
      },
      style,
    ];

    // Render based on variant
    if (variant === "borderless") {
      return (
        <AnimatedBorderlessButton
          {...commonProps}
          borderless={borderless}
          activeOpacity={activeOpacity}
          style={buttonStyle}
        >
          <Animated.View style={[styles.buttonContent, animatedStyle]}>
            <View
              style={styles.contentWrapper}
              accessible
              accessibilityRole="button"
            >
              {renderContent()}
            </View>
          </Animated.View>
        </AnimatedBorderlessButton>
      );
    }

    // Default to RectButton with glass effects
    return (
      <AnimatedRectButton
        {...commonProps}
        underlayColor={underlayColor || variantConfig.backgroundColor}
        activeOpacity={activeOpacity}
        style={[buttonStyle, glowAnimatedStyle]}
      >
        <View
          style={[
            styles.buttonContent,
            { borderRadius: sizeConfig.borderRadius, overflow: "hidden" },
          ]}
        >
          {renderBackground()}
          <Animated.View style={[styles.contentWrapper, animatedStyle]}>
            <View accessible accessibilityRole="button">
              {renderContent()}
            </View>
          </Animated.View>
        </View>
      </AnimatedRectButton>
    );
  }
);

GlassButton.displayName = "GlassButton";

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    overflow: "hidden",
  },
  buttonContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
});
