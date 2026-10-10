"use client"

import { useState, useCallback, memo } from "react"
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react-native"
import { Box, Text, VStack, HStack } from "@/components/ui/core"
import { GlassInput } from "@/components/ui/core/GlassInput"
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons/ButtonVariants"
import { useAuthStore } from "@/stores/authStore"
import { useToastContext } from "@/components/providers/ToastProvider"

export const LoginScreen = memo(() => {
  const { login } = useAuthStore()
  const { showSuccess, showError } = useToastContext()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = useCallback(() => {
    if (!email || !password) {
      showError("Error", "Please enter both email and password")
      return
    }

    setLoading(true)
    setTimeout(() => {
      login({ email, name: "John Doe" })
      showSuccess("Success", "You have successfully logged in")
      setLoading(false)
    }, 1500)
  }, [email, password, login, showSuccess, showError])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev)
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
                Welcome Back
              </Text>
              <Text variant="body" color="textSecondary" textAlign="center">
                Sign in to your MyClinic account
              </Text>
            </VStack>

            {/* Form */}
            <VStack spacing="l">
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
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                leftIcon={<Lock size={20} color="#8E8E93" />}
                rightIcon={showPassword ? <EyeOff size={20} color="#8E8E93" /> : <Eye size={20} color="#8E8E93" />}
                onRightIconPress={togglePasswordVisibility}
              />

              <Text variant="button" color="primary" textAlign="right" pressable>
                Forgot Password?
              </Text>
            </VStack>

            {/* Actions */}
            <VStack spacing="m" mt="xl">
              <PrimaryButton
                text="Sign In"
                onPress={handleLogin}
                loading={loading}
                rightIcon={<ArrowRight size={20} color="#FFFFFF" />}
                fullWidth
              />

              <HStack spacing="s" centerHorizontal>
                <Text variant="body" color="textSecondary">
                  Don't have an account?
                </Text>
                <Text variant="button" color="primary" pressable>
                  Sign Up
                </Text>
              </HStack>
            </VStack>

            {/* Social Login */}
            <VStack spacing="m" mt="xl">
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

LoginScreen.displayName = "LoginScreen"
