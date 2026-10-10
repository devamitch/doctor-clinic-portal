"use client"

import { useState, useCallback, memo } from "react"
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react-native"
import { Box, Text, VStack, HStack } from "@/components/ui/core"
import { GlassInput } from "@/components/ui/core/GlassInput"
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons/ButtonVariants"
import { useAuthStore } from "@/stores/authStore"
import { useToastContext } from "@/components/providers/ToastProvider"

export const RegisterScreen = memo(() => {
  const { register } = useAuthStore()
  const { showSuccess, showError } = useToastContext()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = useCallback(() => {
    if (!name || !email || !password || !confirmPassword) {
      showError("Error", "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      showError("Error", "Passwords do not match")
      return
    }

    setLoading(true)
    setTimeout(() => {
      register({ email, name })
      showSuccess("Success", "Your account has been created")
      setLoading(false)
    }, 1500)
  }, [name, email, password, confirmPassword, register, showSuccess, showError])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev)
  }, [])

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <Box flex1 backgroundColor="backgroundPrimary" p="xl">
          <VStack spacing="xl" flex1 justify="center">
            {/* Logo and Title */}
            <VStack spacing="m" centerHorizontal mb="xl">
              <Box
                width={80}
                height={80}
                borderRadius={40}
                backgroundColor="primary"
                center
                mb="m"
                glass
                glassVariant="strong"
              >
                <Text variant="display" color="backgroundTertiary" fontSize={36}>
                  MC
                </Text>
              </Box>
              <Text variant="header" color="textPrimary" textAlign="center">
                Create Account
              </Text>
              <Text variant="body" color="textSecondary" textAlign="center">
                Sign up to get started with MyClinic
              </Text>
            </VStack>

            {/* Form */}
            <VStack spacing="l">
              <GlassInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                leftIcon={<User size={20} color="#8E8E93" />}
              />

              <GlassInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={20} color="#8E8E93" />}
              />

              <GlassInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                secureTextEntry={!showPassword}
                leftIcon={<Lock size={20} color="#8E8E93" />}
                rightIcon={showPassword ? <EyeOff size={20} color="#8E8E93" /> : <Eye size={20} color="#8E8E93" />}
                onRightIconPress={togglePasswordVisibility}
              />

              <GlassInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                leftIcon={<Lock size={20} color="#8E8E93" />}
                rightIcon={
                  showConfirmPassword ? <EyeOff size={20} color="#8E8E93" /> : <Eye size={20} color="#8E8E93" />
                }
                onRightIconPress={toggleConfirmPasswordVisibility}
              />
            </VStack>

            {/* Terms */}
            <Text variant="caption" color="textSecondary" textAlign="center">
              By signing up, you agree to our{" "}
              <Text variant="caption" color="primary">
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text variant="caption" color="primary">
                Privacy Policy
              </Text>
            </Text>

            {/* Actions */}
            <VStack spacing="m" mt="l">
              <PrimaryButton
                text="Create Account"
                onPress={handleRegister}
                loading={loading}
                rightIcon={<ArrowRight size={20} color="#FFFFFF" />}
                fullWidth
              />

              <HStack spacing="s" centerHorizontal>
                <Text variant="body" color="textSecondary">
                  Already have an account?
                </Text>
                <Text variant="button" color="primary" pressable>
                  Sign In
                </Text>
              </HStack>
            </VStack>

            {/* Social Login */}
            <VStack spacing="m" mt="l">
              <HStack centerVertical mb="m">
                <Box flex1 height={1} backgroundColor="border" />
                <Text variant="caption" color="textSecondary" mx="m">
                  Or continue with
                </Text>
                <Box flex1 height={1} backgroundColor="border" />
              </HStack>

              <HStack spacing="m">
                <Box flex1>
                  <SecondaryButton text="Google" onPress={() => {}} fullWidth />
                </Box>
                <Box flex1>
                  <SecondaryButton text="Apple" onPress={() => {}} fullWidth />
                </Box>
              </HStack>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

RegisterScreen.displayName = "RegisterScreen"
