"use client"

import { memo, useCallback, useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { Box, Text } from "@/theme/theme"
import { GlassContainer } from "../core/GlassContainer"
import { EmailInput, PasswordInput, NameInput, PhoneInput } from "../inputs/InputVariants"
import { PrimaryButton, SecondaryButton } from "../buttons/ButtonVariants"

type FormData = {
  name: string
  email: string
  phone: string
  password: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

interface GlassFormProps {
  onSubmit: (data: FormData) => void
  loading?: boolean
}

/**
 * A form component with glass morphism effects
 * Optimized with React.memo and useCallback for performance
 */
export const GlassForm = memo(({ onSubmit, loading = false }: GlassFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})

  // Update form data
  const updateField = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))

      // Clear error when user types
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors],
  )

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {}
    let isValid = true

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
      isValid = false
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required"
      isValid = false
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }, [formData])

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      onSubmit(formData)
    }
  }, [formData, onSubmit, validateForm])

  // Reset form
  const handleReset = useCallback(() => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
    })
    setErrors({})
  }, [])

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <Box padding="l">
        <GlassContainer variant="glassStrong">
          <Box padding="l">
            <Text variant="header" color="textPrimary" marginBottom="l" textAlign="center">
              Create Account
            </Text>

            <Box marginBottom="m">
              <NameInput
                label="Full Name"
                value={formData.name}
                onChangeText={(text) => updateField("name", text)}
                error={errors.name}
                placeholder="Enter your full name"
              />
            </Box>

            <Box marginBottom="m">
              <EmailInput
                label="Email Address"
                value={formData.email}
                onChangeText={(text) => updateField("email", text)}
                error={errors.email}
                placeholder="Enter your email"
              />
            </Box>

            <Box marginBottom="m">
              <PhoneInput
                label="Phone Number"
                value={formData.phone}
                onChangeText={(text) => updateField("phone", text)}
                error={errors.phone}
                placeholder="Enter your phone number"
              />
            </Box>

            <Box marginBottom="xl">
              <PasswordInput
                label="Password"
                value={formData.password}
                onChangeText={(text) => updateField("password", text)}
                error={errors.password}
                helperText="Password must be at least 8 characters"
                placeholder="Create a password"
              />
            </Box>

            <Box flexDirection="row" justifyContent="space-between" marginTop="l">
              <Box flex={1} marginRight="s">
                <SecondaryButton label="Reset" onPress={handleReset} size="medium" fullWidth disabled={loading} />
              </Box>
              <Box flex={1} marginLeft="s">
                <PrimaryButton
                  label="Create Account"
                  onPress={handleSubmit}
                  size="medium"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                />
              </Box>
            </Box>
          </Box>
        </GlassContainer>
      </Box>
    </ScrollView>
  )
})

GlassForm.displayName = "GlassForm"

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
})
