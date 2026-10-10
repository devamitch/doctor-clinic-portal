"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  Platform,
  TextInput as RNTextInput,
  StyleSheet,
  View,
  type NativeSyntheticEvent,
  type TextInputProps as RNTextInputProps,
  type StyleProp,
  type TextInputContentSizeChangeEventData,
  type TextInputFocusEventData,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { BorderlessButton } from "react-native-gesture-handler"
import { BlurView } from "@react-native-community/blur"
import LinearGradient from "react-native-linear-gradient"
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { AlertCircle, Check, Eye, EyeOff, X } from "lucide-react-native"
import { createText } from "@shopify/restyle"
import type { Theme } from "@/theme/theme"
import { useThemeStore } from "@/stores/themeStore"

const Text = createText<Theme>()
const AnimatedRNTextInput = Animated.createAnimatedComponent(RNTextInput)

export interface GlassTextInputProps extends Omit<RNTextInputProps, "style"> {
  // Basic props
  label?: string
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  error?: string
  helperText?: string
  disabled?: boolean
  required?: boolean

  // Glass variants
  variant?: "glass" | "glassStrong" | "gradient" | "floating"
  inputType?: "text" | "email" | "password" | "number" | "phone" | "url" | "search"
  multiline?: boolean
  numberOfLines?: number

  // Icons and actions
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  clearable?: boolean
  showPasswordToggle?: boolean
  onClear?: () => void
  onRightIconPress?: () => void
  onLeftIconPress?: () => void

  // Validation
  validationRules?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    email?: boolean
    phone?: boolean
    url?: boolean
    custom?: (value: string) => boolean | string
  }
  validateOnChange?: boolean
  validateOnBlur?: boolean
  showValidationIcon?: boolean

  // Styling
  containerStyle?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
  labelStyle?: StyleProp<TextStyle>
  errorStyle?: StyleProp<TextStyle>
  helperStyle?: StyleProp<TextStyle>

  // Glass effects
  blurType?: "light" | "dark" | "regular"
  blurAmount?: number
  gradientColors?: string[]
  glassOpacity?: number

  // Animation configuration
  animationDuration?: number
  springConfig?: {
    damping?: number
    stiffness?: number
    mass?: number
  }

  // Advanced features
  autoValidate?: boolean
  debounceValidation?: number
  maxLength?: number
  showCharacterCount?: boolean
  autoCapitalize?: "none" | "sentences" | "words" | "characters"
  autoCorrect?: boolean
  autoFocus?: boolean
  selectTextOnFocus?: boolean
  blurOnSubmit?: boolean
  returnKeyType?: "done" | "go" | "next" | "search" | "send"

  // Callbacks
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  onSubmitEditing?: () => void
  onValidationChange?: (isValid: boolean, error?: string) => void
  onContentSizeChange?: (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => void

  // Accessibility
  accessibilityLabel?: string
  accessibilityHint?: string
  testID?: string
}

export const GlassTextInput: React.FC<GlassTextInputProps> = ({
  // Basic props
  label,
  placeholder,
  value = "",
  onChangeText,
  error,
  helperText,
  disabled = false,
  required = false,

  // Glass variants
  variant = "glass",
  inputType = "text",
  multiline = false,
  numberOfLines = 1,

  // Icons and actions
  leftIcon,
  rightIcon,
  clearable = false,
  showPasswordToggle = false,
  onClear,
  onRightIconPress,
  onLeftIconPress,

  // Validation
  validationRules,
  validateOnChange = false,
  validateOnBlur = true,
  showValidationIcon = true,

  // Styling
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,

  // Glass effects
  blurType = "light",
  blurAmount = 10,
  gradientColors,
  glassOpacity = 0.3,

  // Animation configuration
  animationDuration = 200,
  springConfig = {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },

  // Advanced features
  autoValidate = false,
  debounceValidation = 300,
  maxLength,
  showCharacterCount = false,
  autoCapitalize = "none",
  autoCorrect = false,
  autoFocus = false,
  selectTextOnFocus = false,
  blurOnSubmit = true,
  returnKeyType = "done",

  // Callbacks
  onFocus,
  onBlur,
  onSubmitEditing,
  onValidationChange,
  onContentSizeChange,

  // Accessibility
  accessibilityLabel,
  accessibilityHint,
  testID,

  ...restProps
}) => {
  const { theme } = useThemeStore()

  // Refs
  const inputRef = useRef<RNTextInput>(null)
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // State
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [internalValue, setInternalValue] = useState(value || "")
  const [validationError, setValidationError] = useState<string | undefined>(error)
  const [isValid, setIsValid] = useState(true)
  const [inputHeight, setInputHeight] = useState(0)

  // Animation values
  const focusAnimationValue = useSharedValue(0)
  const labelAnimation = useSharedValue(0)
  const errorAnimationValue = useSharedValue(0)
  const borderAnimation = useSharedValue(0)
  const scaleAnimation = useSharedValue(1)
  const shakeAnimation = useSharedValue(0)
  const glowAnimation = useSharedValue(0)
  const characterCountAnimation = useSharedValue(0)

  // Validation function
  const validateInput = useCallback(
    (text: string): { isValid: boolean; error?: string } => {
      if (!validationRules) return { isValid: true }

      // Required validation
      if (validationRules.required && !text.trim()) {
        return { isValid: false, error: "This field is required" }
      }

      // Min length validation
      if (validationRules.minLength && text.length < validationRules.minLength) {
        return {
          isValid: false,
          error: `Minimum ${validationRules.minLength} characters required`,
        }
      }

      // Max length validation
      if (validationRules.maxLength && text.length > validationRules.maxLength) {
        return {
          isValid: false,
          error: `Maximum ${validationRules.maxLength} characters allowed`,
        }
      }

      // Email validation
      if (validationRules.email || inputType === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (text && !emailRegex.test(text)) {
          return { isValid: false, error: "Please enter a valid email address" }
        }
      }

      // Phone validation
      if (validationRules.phone || inputType === "phone") {
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
        if (text && !phoneRegex.test(text.replace(/\s/g, ""))) {
          return { isValid: false, error: "Please enter a valid phone number" }
        }
      }

      // URL validation
      if (validationRules.url || inputType === "url") {
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
        if (text && !urlRegex.test(text)) {
          return { isValid: false, error: "Please enter a valid URL" }
        }
      }

      // Pattern validation
      if (validationRules.pattern && text && !validationRules.pattern.test(text)) {
        return { isValid: false, error: "Invalid format" }
      }

      // Custom validation
      if (validationRules.custom) {
        const customResult = validationRules.custom(text)
        if (typeof customResult === "string") {
          return { isValid: false, error: customResult }
        }
        if (!customResult) {
          return { isValid: false, error: "Invalid input" }
        }
      }

      return { isValid: true }
    },
    [validationRules, inputType],
  )

  // Handle validation with debounce
  const handleValidation = useCallback(
    (text: string) => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current)
      }

      validationTimeoutRef.current = setTimeout(() => {
        const validation = validateInput(text)
        setIsValid(validation.isValid)
        setValidationError(validation.error)
        onValidationChange?.(validation.isValid, validation.error)

        if (!validation.isValid) {
          shakeAnimation.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(0, { duration: 50 }),
          )
          errorAnimationValue.value = withTiming(1, { duration: animationDuration })
        } else {
          errorAnimationValue.value = withTiming(0, { duration: animationDuration })
        }
      }, debounceValidation)
    },
    [validateInput, onValidationChange, debounceValidation, animationDuration, shakeAnimation, errorAnimationValue],
  )

  // Handle text change
  const handleChangeText = useCallback(
    (text: string) => {
      setInternalValue(text)
      onChangeText?.(text)

      if (validateOnChange || autoValidate) {
        handleValidation(text)
      }

      if (showCharacterCount && maxLength) {
        const progress = text.length / maxLength
        characterCountAnimation.value = withTiming(progress, { duration: 200 })
      }
    },
    [
      onChangeText,
      validateOnChange,
      autoValidate,
      handleValidation,
      showCharacterCount,
      maxLength,
      characterCountAnimation,
    ],
  )

  // Handle focus
  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true)
      focusAnimationValue.value = withTiming(1, { duration: animationDuration })
      borderAnimation.value = withTiming(1, { duration: animationDuration })
      scaleAnimation.value = withSpring(1.02, springConfig)
      glowAnimation.value = withTiming(1, { duration: animationDuration })

      if (variant === "floating") {
        labelAnimation.value = withSpring(1, springConfig)
      }

      onFocus?.(e)
    },
    [
      focusAnimationValue,
      borderAnimation,
      scaleAnimation,
      glowAnimation,
      labelAnimation,
      animationDuration,
      springConfig,
      variant,
      onFocus,
    ],
  )

  // Handle blur
  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false)
      focusAnimationValue.value = withTiming(0, { duration: animationDuration })
      borderAnimation.value = withTiming(0, { duration: animationDuration })
      scaleAnimation.value = withSpring(1, springConfig)
      glowAnimation.value = withTiming(0, { duration: animationDuration })

      if (variant === "floating" && !internalValue) {
        labelAnimation.value = withSpring(0, springConfig)
      }

      if (validateOnBlur) {
        handleValidation(internalValue)
      }

      onBlur?.(e)
    },
    [
      focusAnimationValue,
      borderAnimation,
      scaleAnimation,
      glowAnimation,
      labelAnimation,
      animationDuration,
      springConfig,
      internalValue,
      validateOnBlur,
      handleValidation,
      variant,
      onBlur,
    ],
  )

  // Handle clear
  const handleClear = useCallback(() => {
    setInternalValue("")
    onChangeText?.("")
    onClear?.()
    inputRef.current?.focus()
  }, [onChangeText, onClear])

  // Handle password toggle
  const handlePasswordToggle = useCallback(() => {
    setIsPasswordVisible(!isPasswordVisible)
  }, [isPasswordVisible])

  // Handle content size change for multiline
  const handleContentSizeChange = useCallback(
    (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      if (multiline) {
        setInputHeight(e.nativeEvent.contentSize.height)
      }
      onContentSizeChange?.(e)
    },
    [multiline, onContentSizeChange],
  )

  // Update internal value when prop changes
  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value || "")
      if (variant === "floating") {
        if (value) {
          labelAnimation.value = withSpring(1, springConfig)
        } else if (!isFocused) {
          labelAnimation.value = withSpring(0, springConfig)
        }
      }
    }
  }, [value, labelAnimation, springConfig, isFocused, internalValue, variant])

  // Update error state when prop changes
  useEffect(() => {
    setValidationError(error)
    setIsValid(!error)
    if (error) {
      errorAnimationValue.value = withTiming(1, { duration: animationDuration })
    } else {
      errorAnimationValue.value = withTiming(0, { duration: animationDuration })
    }
  }, [error, errorAnimationValue, animationDuration])

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnimation.value }, { translateX: shakeAnimation.value }],
    }
  })

  const borderAnimatedStyle = useAnimatedStyle(() => {
    const borderColorValue = interpolateColor(
      borderAnimation.value,
      [0, 1],
      [
        validationError ? theme.colors.error : theme.colors.border,
        validationError ? theme.colors.error : theme.colors.primary,
      ],
    )

    const borderWidth = interpolate(borderAnimation.value, [0, 1], [1, 2])

    const shadowOpacity = interpolate(glowAnimation.value, [0, 1], [0, 0.3])

    return {
      borderColor: borderColorValue,
      borderWidth,
      shadowColor: theme.colors.primary,
      shadowOpacity,
      shadowRadius: interpolate(glowAnimation.value, [0, 1], [0, 8]),
      shadowOffset: { width: 0, height: 0 },
      elevation: Platform.OS === "android" ? interpolate(glowAnimation.value, [0, 1], [0, 4]) : 0,
    }
  })

  const staticLabelStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        focusAnimationValue.value,
        [0, 1],
        [theme.colors.textSecondary, validationError ? theme.colors.error : theme.colors.primary],
      ),
    }
  })

  const floatingLabelAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(labelAnimation.value, [0, 1], [16, -8])
    const scale = interpolate(labelAnimation.value, [0, 1], [1, 0.85])

    return {
      transform: [{ translateY }, { scale }],
      color: interpolateColor(
        focusAnimationValue.value,
        [0, 1],
        [theme.colors.textSecondary, validationError ? theme.colors.error : theme.colors.primary],
      ),
    }
  })

  const errorAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: errorAnimationValue.value,
      transform: [{ translateY: interpolate(errorAnimationValue.value, [0, 1], [-10, 0]) }],
    }
  })

  const characterCountAnimatedStyle = useAnimatedStyle(() => {
    if (!showCharacterCount || !maxLength) return {}

    const color = interpolateColor(
      characterCountAnimation.value,
      [0, 0.8, 1],
      [theme.colors.textSecondary, theme.colors.textSecondary, theme.colors.error],
    )

    return { color }
  })

  // Get keyboard type
  const getKeyboardType = () => {
    switch (inputType) {
      case "email":
        return "email-address"
      case "number":
        return "numeric"
      case "phone":
        return "phone-pad"
      case "url":
        return "url"
      default:
        return "default"
    }
  }

  // Get secure text entry
  const getSecureTextEntry = () => {
    if (inputType === "password" || showPasswordToggle) {
      return !isPasswordVisible
    }
    return false
  }

  // Render validation icon
  const renderValidationIcon = () => {
    if (!showValidationIcon || (!validationError && (isValid || !internalValue))) return null

    if (validationError) {
      return <AlertCircle size={20} color={theme.colors.error} />
    } else if (isValid && internalValue) {
      return <Check size={20} color={theme.colors.success} />
    }

    return null
  }

  // Render right icon
  const renderRightIcon = () => {
    const icons = []

    // Validation icon
    if (showValidationIcon) {
      const validationIcon = renderValidationIcon()
      if (validationIcon) {
        icons.push(
          <View key="validation" style={styles.iconContainer}>
            {validationIcon}
          </View>,
        )
      }
    }

    // Clear button
    if (clearable && internalValue) {
      icons.push(
        <BorderlessButton key="clear" onPress={handleClear} style={styles.iconButton} rippleColor="transparent">
          <X size={20} color={theme.colors.textSecondary} />
        </BorderlessButton>,
      )
    }

    // Password toggle
    if ((inputType === "password" || showPasswordToggle) && internalValue) {
      icons.push(
        <BorderlessButton
          key="password"
          onPress={handlePasswordToggle}
          style={styles.iconButton}
          rippleColor="transparent"
        >
          {isPasswordVisible ? (
            <EyeOff size={20} color={theme.colors.textSecondary} />
          ) : (
            <Eye size={20} color={theme.colors.textSecondary} />
          )}
        </BorderlessButton>,
      )
    }

    // Custom right icon
    if (rightIcon) {
      icons.push(
        <BorderlessButton key="custom" onPress={onRightIconPress} style={styles.iconButton} rippleColor="transparent">
          {rightIcon}
        </BorderlessButton>,
      )
    }

    return icons.length > 0 ? <View style={styles.rightIconsContainer}>{icons}</View> : null
  }

  // Get container style based on variant
  const getContainerStyle = () => {
    const baseStyle = {
      backgroundColor: disabled ? theme.colors.glassBackgroundLight : "transparent",
    }

    switch (variant) {
      case "glassStrong":
        return [styles.glassStrongContainer, baseStyle]
      case "gradient":
        return [styles.gradientContainer, baseStyle]
      case "floating":
        return [styles.floatingContainer, baseStyle]
      default:
        return [styles.glassContainer, baseStyle]
    }
  }

  const renderBackground = () => {
    if (variant === "gradient") {
      return (
        <LinearGradient
          colors={gradientColors || [theme.colors.gradientStart, theme.colors.gradientEnd]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )
    }

    return (
      <BlurView
        style={StyleSheet.absoluteFillObject}
        blurType={blurType}
        blurAmount={blurAmount}
        reducedTransparencyFallbackColor={theme.colors.glassBackground}
      />
    )
  }

  return (
    <Animated.View style={[styles.wrapper, containerAnimatedStyle, containerStyle]}>
      {/* Static Label for non-floating variants */}
      {label && variant !== "floating" && (
        <Animated.Text style={[styles.label, staticLabelStyle, labelStyle]}>
          {label}
          {required && <Text style={[styles.required, { color: theme.colors.error }]}> *</Text>}
        </Animated.Text>
      )}

      {/* Input Container */}
      <Animated.View style={[getContainerStyle(), borderAnimatedStyle]}>
        {renderBackground()}

        {/* Floating Label */}
        {label && variant === "floating" && (
          <Animated.Text style={[styles.floatingLabel, floatingLabelAnimatedStyle, labelStyle]}>
            {label}
            {required && <Text style={[styles.required, { color: theme.colors.error }]}> *</Text>}
          </Animated.Text>
        )}

        {/* Left Icon */}
        {leftIcon && (
          <BorderlessButton onPress={onLeftIconPress} style={styles.leftIconButton} rippleColor="transparent">
            {leftIcon}
          </BorderlessButton>
        )}

        {/* Text Input */}
        <AnimatedRNTextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              color: disabled ? theme.colors.textTertiary : theme.colors.textPrimary,
              height: multiline ? Math.max(40, inputHeight) : 40,
              paddingTop: variant === "floating" ? 8 : 8,
            },
            inputStyle,
          ]}
          value={internalValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmitEditing}
          onContentSizeChange={handleContentSizeChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          keyboardType={getKeyboardType()}
          secureTextEntry={getSecureTextEntry()}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoFocus={autoFocus}
          selectTextOnFocus={selectTextOnFocus}
          blurOnSubmit={blurOnSubmit}
          returnKeyType={returnKeyType}
          editable={!disabled}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          testID={testID}
          {...restProps}
        />

        {/* Right Icons */}
        {renderRightIcon()}
      </Animated.View>

      {/* Helper Text / Error / Character Count */}
      <View style={styles.bottomContainer}>
        <View style={styles.helperContainer}>
          {/* Error Text */}
          {validationError && (
            <Animated.Text style={[styles.errorText, { color: theme.colors.error }, errorAnimatedStyle, errorStyle]}>
              {validationError}
            </Animated.Text>
          )}

          {/* Helper Text */}
          {!validationError && helperText && (
            <Text style={[styles.helperText, { color: theme.colors.textSecondary }, helperStyle]}>{helperText}</Text>
          )}
        </View>

        {/* Character Count */}
        {showCharacterCount && maxLength && (
          <Animated.Text style={[styles.characterCount, characterCountAnimatedStyle]}>
            {internalValue.length}/{maxLength}
          </Animated.Text>
        )}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  required: {
    fontSize: 14,
  },
  glassContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 50,
    overflow: "hidden",
    borderWidth: 1,
  },
  glassStrongContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    minHeight: 56,
    overflow: "hidden",
    borderWidth: 1,
  },
  gradientContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    minHeight: 56,
    overflow: "hidden",
    borderWidth: 1,
  },
  floatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    minHeight: 64,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
  },
  floatingLabel: {
    position: "absolute",
    left: 16,
    top: 20,
    fontSize: 16,
    fontWeight: "400",
    zIndex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    textAlignVertical: "top",
    minHeight: 24,
    zIndex: 1,
  },
  leftIconButton: {
    marginRight: 12,
    padding: 4,
    zIndex: 1,
  },
  rightIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  iconContainer: {
    marginLeft: 8,
    padding: 4,
  },
  iconButton: {
    marginLeft: 8,
    padding: 4,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 6,
    minHeight: 20,
  },
  helperContainer: {
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  characterCount: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
    lineHeight: 16,
  },
})
