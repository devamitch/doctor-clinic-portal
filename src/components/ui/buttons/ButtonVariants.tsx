"use client"

import { memo } from "react"
import { Plus, Heart, Settings, Phone, Mail, Check, X, ArrowRight } from "lucide-react-native"
import { GlassButton, type GlassButtonProps } from "../core/GlassButton"
import { useThemeStore } from "@/stores/themeStore"

// Base button variant props
export interface ButtonVariantProps extends Omit<GlassButtonProps, "variant"> {
  size?: "small" | "medium" | "large" | "xl"
  fullWidth?: boolean
}

// Primary Button - Uses enhanced gradient system
export const PrimaryButton = memo((props: ButtonVariantProps) => {
  return <GlassButton variant="primary" {...props} />
})
PrimaryButton.displayName = "PrimaryButton"

// Secondary Button - Glass with border
export const SecondaryButton = memo((props: ButtonVariantProps) => {
  return <GlassButton variant="secondary" {...props} />
})
SecondaryButton.displayName = "SecondaryButton"

// Success Button
export const SuccessButton = memo((props: ButtonVariantProps) => {
  return <GlassButton variant="success" {...props} />
})
SuccessButton.displayName = "SuccessButton"

// Danger Button
export const DangerButton = memo((props: ButtonVariantProps) => {
  return <GlassButton variant="danger" {...props} />
})
DangerButton.displayName = "DangerButton"

// Warning Button
export const WarningButton = memo((props: ButtonVariantProps) => {
  return <GlassButton variant="warning" {...props} />
})
WarningButton.displayName = "WarningButton"

// Info Button
export const InfoButton = memo((props: ButtonVariantProps) => {
  return <GlassButton variant="info" {...props} />
})
InfoButton.displayName = "InfoButton"

// Ghost Button
export const GhostButton = memo((props: ButtonVariantProps) => {
  return <GlassButton variant="ghost" {...props} />
})
GhostButton.displayName = "GhostButton"

// Icon Button
export const IconButton = memo((props: ButtonVariantProps) => {
  return <GlassButton variant="icon" {...props} />
})
IconButton.displayName = "IconButton"

// Floating Action Button
export const FABButton = memo((props: ButtonVariantProps) => {
  return <GlassButton variant="fab" {...props} />
})
FABButton.displayName = "FABButton"

// Ternary Button - Custom gradient variant
export const TernaryButton = memo((props: ButtonVariantProps) => {
  return <GlassButton variant="ternary" {...props} />
})
TernaryButton.displayName = "TernaryButton"

// Fourth Button - Complex gradient variant
export const FourthButton = memo((props: ButtonVariantProps) => {
  return <GlassButton variant="fourth" {...props} />
})
FourthButton.displayName = "FourthButton"

// Text Button - Borderless variant
export const TextButton = memo((props: ButtonVariantProps) => {
  return <GlassButton variant="borderless" {...props} />
})
TextButton.displayName = "TextButton"

// Specialized Action Buttons with icons
export const CallButton = memo((props: Omit<ButtonVariantProps, "leftIcon">) => {
  const { theme } = useThemeStore()
  return <GlassButton variant="success" leftIcon={<Phone size={20} color="#FFFFFF" />} {...props} />
})
CallButton.displayName = "CallButton"

export const EmailButton = memo((props: Omit<ButtonVariantProps, "leftIcon">) => {
  const { theme } = useThemeStore()
  return <GlassButton variant="info" leftIcon={<Mail size={20} color="#FFFFFF" />} {...props} />
})
EmailButton.displayName = "EmailButton"

export const LikeButton = memo((props: Omit<ButtonVariantProps, "leftIcon">) => {
  const { theme } = useThemeStore()
  return <GlassButton variant="danger" leftIcon={<Heart size={20} color="#FFFFFF" />} {...props} />
})
LikeButton.displayName = "LikeButton"

export const SettingsButton = memo((props: Omit<ButtonVariantProps, "leftIcon">) => {
  const { theme } = useThemeStore()
  return <GlassButton variant="ghost" leftIcon={<Settings size={20} color={theme.colors.textPrimary} />} {...props} />
})
SettingsButton.displayName = "SettingsButton"

export const ConfirmButton = memo((props: Omit<ButtonVariantProps, "leftIcon">) => {
  const { theme } = useThemeStore()
  return <GlassButton variant="success" leftIcon={<Check size={20} color="#FFFFFF" />} {...props} />
})
ConfirmButton.displayName = "ConfirmButton"

export const CancelButton = memo((props: Omit<ButtonVariantProps, "leftIcon">) => {
  const { theme } = useThemeStore()
  return <GlassButton variant="danger" leftIcon={<X size={20} color="#FFFFFF" />} {...props} />
})
CancelButton.displayName = "CancelButton"

export const NextButton = memo((props: Omit<ButtonVariantProps, "rightIcon">) => {
  const { theme } = useThemeStore()
  return (
    <GlassButton
      variant="primary"
      rightIcon={<ArrowRight size={20} color="#FFFFFF" />}
      iconPosition="right"
      {...props}
    />
  )
})
NextButton.displayName = "NextButton"

export const AddButton = memo((props: Omit<ButtonVariantProps, "leftIcon">) => {
  const { theme } = useThemeStore()
  return <GlassButton variant="fab" leftIcon={<Plus size={24} color="#FFFFFF" />} {...props} />
})
AddButton.displayName = "AddButton"

// Size-specific button variants
export const SmallButton = memo((props: Omit<ButtonVariantProps, "size">) => {
  return <GlassButton size="small" {...props} />
})
SmallButton.displayName = "SmallButton"

export const LargeButton = memo((props: Omit<ButtonVariantProps, "size">) => {
  return <GlassButton size="large" {...props} />
})
LargeButton.displayName = "LargeButton"

export const XLButton = memo((props: Omit<ButtonVariantProps, "size">) => {
  return <GlassButton size="xl" {...props} />
})
XLButton.displayName = "XLButton"

// Full-width button variants
export const FullWidthPrimaryButton = memo((props: Omit<ButtonVariantProps, "fullWidth">) => {
  return <PrimaryButton fullWidth {...props} />
})
FullWidthPrimaryButton.displayName = "FullWidthPrimaryButton"

export const FullWidthSecondaryButton = memo((props: Omit<ButtonVariantProps, "fullWidth">) => {
  return <SecondaryButton fullWidth {...props} />
})
FullWidthSecondaryButton.displayName = "FullWidthSecondaryButton"
