"use client"

import { memo, useState, useCallback } from "react"
import { Pressable } from "react-native"
import { Mail, Lock, User, Phone, Search, CreditCard, Eye, EyeOff, X } from "lucide-react-native"
import { GlassInput, type GlassInputProps } from "../core/GlassInput"
import { useThemeStore } from "@/stores/themeStore"

// Email Input
export const EmailInput = memo((props: Omit<GlassInputProps, "keyboardType" | "leftIcon">) => {
  const { theme } = useThemeStore()
  return (
    <GlassInput
      keyboardType="email-address"
      leftIcon={<Mail size={20} color={theme.colors.textSecondary} />}
      autoCapitalize="none"
      {...props}
    />
  )
})

EmailInput.displayName = "EmailInput"

// Password Input
export const PasswordInput = memo((props: Omit<GlassInputProps, "secureTextEntry" | "leftIcon">) => {
  const { theme } = useThemeStore()
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword)
  }, [showPassword])

  const PasswordIcon = showPassword ? EyeOff : Eye

  return (
    <GlassInput
      secureTextEntry={!showPassword}
      leftIcon={<Lock size={20} color={theme.colors.textSecondary} />}
      rightIcon={
        <Pressable onPress={togglePasswordVisibility}>
          <PasswordIcon size={20} color={theme.colors.textSecondary} />
        </Pressable>
      }
      autoCapitalize="none"
      {...props}
    />
  )
})

PasswordInput.displayName = "PasswordInput"

// Name Input
export const NameInput = memo((props: Omit<GlassInputProps, "leftIcon">) => {
  const { theme } = useThemeStore()
  return (
    <GlassInput leftIcon={<User size={20} color={theme.colors.textSecondary} />} autoCapitalize="words" {...props} />
  )
})

NameInput.displayName = "NameInput"

// Phone Input
export const PhoneInput = memo((props: Omit<GlassInputProps, "keyboardType" | "leftIcon">) => {
  const { theme } = useThemeStore()
  return (
    <GlassInput keyboardType="phone-pad" leftIcon={<Phone size={20} color={theme.colors.textSecondary} />} {...props} />
  )
})

PhoneInput.displayName = "PhoneInput"

// Search Input
export const SearchInput = memo((props: Omit<GlassInputProps, "leftIcon">) => {
  const { theme } = useThemeStore()
  const [value, setValue] = useState(props.value || "")

  const handleClear = useCallback(() => {
    setValue("")
    props.onChangeText?.("")
    props.onClear?.()
  }, [props])

  const handleChangeText = useCallback(
    (text: string) => {
      setValue(text)
      props.onChangeText?.(text)
    },
    [props],
  )

  return (
    <GlassInput
      leftIcon={<Search size={20} color={theme.colors.textSecondary} />}
      rightIcon={
        value ? (
          <Pressable onPress={handleClear}>
            <X size={20} color={theme.colors.textSecondary} />
          </Pressable>
        ) : undefined
      }
      value={value}
      onChangeText={handleChangeText}
      variant="search"
      {...props}
    />
  )
})

SearchInput.displayName = "SearchInput"

// Credit Card Input
export const CreditCardInput = memo((props: Omit<GlassInputProps, "keyboardType" | "leftIcon">) => {
  const { theme } = useThemeStore()
  return (
    <GlassInput
      keyboardType="numeric"
      leftIcon={<CreditCard size={20} color={theme.colors.textSecondary} />}
      maxLength={19}
      {...props}
    />
  )
})

CreditCardInput.displayName = "CreditCardInput"
