"use client";

import type React from "react";

import { BlurView } from "@react-native-community/blur";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
  type TextInputProps,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

import { useThemeStore } from "@/stores/themeStore";
import { Box, Text, type Theme } from "@/theme/theme";

export type GlassInputVariant = keyof Theme["inputVariants"];

export type GlassInputProps = {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: GlassInputVariant;
  blurType?: "light" | "dark" | "regular";
  blurAmount?: number;
  onChangeText?: (text: string) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onClear?: () => void;
  testID?: string;
} & Omit<TextInputProps, "style">;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const GlassInput = memo(
  ({
    label,
    helperText,
    error,
    leftIcon,
    rightIcon,
    variant = "glass",
    blurType = "light",
    blurAmount = 10,
    value,
    onChangeText,
    onFocus,
    onBlur,
    onClear,
    placeholder,
    secureTextEntry,
    keyboardType,
    autoCapitalize = "none",
    autoCorrect = false,
    editable = true,
    testID,
    ...rest
  }: GlassInputProps) => {
    const { theme, isDark } = useThemeStore();
    const inputRef = useRef<TextInput>(null);

    const [isFocused, setIsFocused] = useState(false);

    const focusAnim = useSharedValue(0);
    const labelPositionAnim = useSharedValue(value ? 1 : 0);

    const handleFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(true);
        focusAnim.value = withTiming(1, { duration: 200 });

        if (variant === "floating") {
          labelPositionAnim.value = withTiming(1, { duration: 200 });
        }

        onFocus?.(e);
      },
      [focusAnim, labelPositionAnim, onFocus, variant]
    );

    const handleBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(false);
        focusAnim.value = withTiming(0, { duration: 200 });

        if (variant === "floating" && !value) {
          labelPositionAnim.value = withTiming(0, { duration: 200 });
        }

        onBlur?.(e);
      },
      [focusAnim, labelPositionAnim, onBlur, value, variant]
    );

    useEffect(() => {
      if (variant === "floating") {
        if (value) {
          labelPositionAnim.value = withTiming(1, { duration: 200 });
        } else if (!isFocused) {
          labelPositionAnim.value = withTiming(0, { duration: 200 });
        }
      }
    }, [value, isFocused, labelPositionAnim, variant]);

    const containerAnimStyle = useAnimatedStyle(() => {
      const borderColor = interpolateColor(
        focusAnim.value,
        [0, 1],
        [
          error ? theme.colors.error : theme.colors.border,
          error ? theme.colors.error : theme.colors.primary,
        ]
      );

      return {
        borderColor,
        borderWidth: error || isFocused ? 2 : 1,
      };
    });

    const labelAnimStyle = useAnimatedStyle(() => {
      if (variant !== "floating") return {};

      return {
        transform: [
          {
            translateY: withTiming(labelPositionAnim.value === 1 ? -24 : 0, {
              duration: 200,
            }),
          },
          {
            scale: withTiming(labelPositionAnim.value === 1 ? 0.85 : 1, {
              duration: 200,
            }),
          },
        ],
        color: error
          ? theme.colors.error
          : isFocused
          ? theme.colors.primary
          : theme.colors.textSecondary,
      };
    });

    const inputVariant = variant === "floating" ? "glass" : variant;
    const effectiveBlurType = isDark ? "dark" : blurType;

    const getTextColor = useMemo(() => {
      if (!editable) return theme.colors.textTertiary;
      return theme.colors.textPrimary;
    }, [editable, theme.colors]);

    return (
      <Box width="100%">
        {label && variant !== "floating" && (
          <Text
            variant="bodySmall"
            color={error ? "error" : "textSecondary"}
            marginBottom="xs"
            fontWeight="500"
          >
            {label}
          </Text>
        )}

        <Animated.View style={[styles.container, containerAnimStyle]}>
          <Box
            variant={inputVariant}
            style={StyleSheet.absoluteFill}
            overflow="hidden"
          >
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType={effectiveBlurType}
              blurAmount={blurAmount}
              reducedTransparencyFallbackColor={theme.colors.glassBackground}
            />
          </Box>

          {label && variant === "floating" && (
            <Animated.Text
              style={[
                styles.floatingLabel,
                { color: theme.colors.textSecondary },
                labelAnimStyle,
              ]}
            >
              {label}
            </Animated.Text>
          )}

          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <AnimatedTextInput
            ref={inputRef}
            style={[
              styles.input,
              {
                color: getTextColor,
                paddingTop: variant === "floating" ? 12 : 0,
              },
            ]}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textTertiary}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            editable={editable}
            testID={testID}
            {...rest}
          />

          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </Animated.View>

        {(helperText || error) && (
          <Text
            variant="caption"
            color={error ? "error" : "textSecondary"}
            marginTop="xs"
          >
            {error || helperText}
          </Text>
        )}
      </Box>
    );
  }
);

GlassInput.displayName = "GlassInput";

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    borderRadius: 12,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 16,
    zIndex: 1,
  },
  floatingLabel: {
    position: "absolute",
    left: 12,
    top: 14,
    fontSize: 16,
    zIndex: 2,
  },
  leftIcon: {
    marginLeft: 12,
    marginRight: 8,
    zIndex: 1,
  },
  rightIcon: {
    marginRight: 12,
    marginLeft: 8,
    zIndex: 1,
  },
});
