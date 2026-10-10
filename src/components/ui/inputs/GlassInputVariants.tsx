"use client"

import type React from "react"
import { GlassTextInput, type GlassTextInputProps } from "../base/GlassTextInput"
import { Mail, Lock, User, Phone, Search, CreditCard } from "lucide-react-native"
import { useThemeStore } from "@/stores/themeStore"

// Email Input
export const GlassEmailInput: React.FC<Omit<GlassTextInputProps, "inputType" | "leftIcon">> = (props) => {
  const { theme } = useThemeStore()

  return (
    <GlassTextInput
      {...props}
      inputType="email"
      leftIcon={<Mail size={20} color={theme.colors.textSecondary} />}
      validationRules={{
        required: true,
        email: true,
        ...props.validationRules,
      }}
      placeholder="Enter your email"
      autoCapitalize="none"
      autoCorrect={false}
    />
  )
}

// Password Input
export const GlassPasswordInput: React.FC<
  Omit<GlassTextInputProps, "inputType" | "leftIcon" | "showPasswordToggle">
> = (props) => {
  const { theme } = useThemeStore()

  return (
    <GlassTextInput
      {...props}
      inputType="password"
      leftIcon={<Lock size={20} color={theme.colors.textSecondary} />}
      showPasswordToggle={true}
      validationRules={{
        required: true,
        minLength: 8,
        ...props.validationRules,
      }}
      placeholder="Enter your password"
      autoCapitalize="none"
      autoCorrect={false}
    />
  )
}

// Name Input
export const GlassNameInput: React.FC<Omit<GlassTextInputProps, "leftIcon">> = (props) => {
  const { theme } = useThemeStore()

  return (
    <GlassTextInput
      {...props}
      leftIcon={<User size={20} color={theme.colors.textSecondary} />}
      validationRules={{
        required: true,
        minLength: 2,
        ...props.validationRules,
      }}
      placeholder="Enter your name"
      autoCapitalize="words"
    />
  )
}

// Phone Input
export const GlassPhoneInput: React.FC<Omit<GlassTextInputProps, "inputType" | "leftIcon">> = (props) => {
  const { theme } = useThemeStore()

  return (
    <GlassTextInput
      {...props}
      inputType="phone"
      leftIcon={<Phone size={20} color={theme.colors.textSecondary} />}
      validationRules={{
        required: true,
        phone: true,
        ...props.validationRules,
      }}
      placeholder="Enter your phone number"
    />
  )
}

// Search Input
export const GlassSearchInput: React.FC<Omit<GlassTextInputProps, "inputType" | "leftIcon" | "clearable">> = (
  props,
) => {
  const { theme } = useThemeStore()

  return (
    <GlassTextInput
      {...props}
      inputType="search"
      leftIcon={<Search size={20} color={theme.colors.textSecondary} />}
      clearable={true}
      placeholder="Search..."
      returnKeyType="search"
    />
  )
}

// Credit Card Input
export const GlassCreditCardInput: React.FC<Omit<GlassTextInputProps, "leftIcon">> = (props) => {
  const { theme } = useThemeStore()

  return (
    <GlassTextInput
      {...props}
      leftIcon={<CreditCard size={20} color={theme.colors.textSecondary} />}
      validationRules={{
        required: true,
        pattern: /^[0-9\s]{13,19}$/,
        ...props.validationRules,
      }}
      placeholder="1234 5678 9012 3456"
      maxLength={19}
      keyboardType="numeric"
    />
  )
}
