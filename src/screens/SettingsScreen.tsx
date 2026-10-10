"use client"

import { useState, useCallback, memo } from "react"
import { ArrowLeft, Moon, Sun, Bell, Globe, Lock, HelpCircle, LogOut } from "lucide-react-native"
import { Box, VStack } from "@/components/ui/core"
import { GlassHeader } from "@/components/ui/navigation/GlassHeader"
import { ListItem } from "@/components/ui/lists/ListItem"
import { ListSection } from "@/components/ui/lists/ListSection"
import { useThemeStore } from "@/stores/themeStore"
import { useAuthStore } from "@/stores/authStore"
import { useToastContext } from "@/components/providers/ToastProvider"

export const SettingsScreen = memo(() => {
  const { theme, isDark, toggleTheme } = useThemeStore()
  const { logout } = useAuthStore()
  const { showInfo, showSuccess } = useToastContext()

  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [biometricsEnabled, setBiometricsEnabled] = useState(false)
  const [locationEnabled, setLocationEnabled] = useState(true)

  const handleLogout = useCallback(() => {
    logout()
    showSuccess("Logged Out", "You have been logged out successfully")
  }, [logout, showSuccess])

  const handleLanguagePress = useCallback(() => {
    showInfo("Language", "Opening language selection")
  }, [showInfo])

  const handlePrivacyPress = useCallback(() => {
    showInfo("Privacy", "Opening privacy settings")
  }, [showInfo])

  const handleHelpPress = useCallback(() => {
    showInfo("Help", "Opening help center")
  }, [showInfo])

  const handleAboutPress = useCallback(() => {
    showInfo("About", "Opening about page")
  }, [showInfo])

  return (
    <Box flex1 backgroundColor="backgroundPrimary">
      {/* Header */}
      <GlassHeader
        title="Settings"
        leftIcon={<ArrowLeft size={24} color={theme.colors.textPrimary} />}
        onLeftPress={() => showInfo("Navigation", "Going back")}
      />

      <Box p="l">
        <VStack spacing="l">
          {/* App Settings */}
          <ListSection title="App Settings" variant="glass">
            <ListItem
              title="Dark Mode"
              subtitle="Toggle dark/light theme"
              leftIcon={
                isDark ? (
                  <Moon size={20} color={theme.colors.textSecondary} />
                ) : (
                  <Sun size={20} color={theme.colors.textSecondary} />
                )
              }
              rightElement={
                <Box
                  width={50}
                  height={30}
                  borderRadius={15}
                  backgroundColor={isDark ? "primary" : "border"}
                  pressable
                  onPress={toggleTheme}
                  center
                >
                  <Box
                    position="absolute"
                    left={isDark ? 25 : 5}
                    width={20}
                    height={20}
                    borderRadius={10}
                    backgroundColor="backgroundTertiary"
                  />
                </Box>
              }
              onPress={toggleTheme}
              variant="minimal"
            />

            <ListItem
              title="Notifications"
              subtitle={notificationsEnabled ? "Enabled" : "Disabled"}
              leftIcon={<Bell size={20} color={theme.colors.textSecondary} />}
              rightElement={
                <Box
                  width={50}
                  height={30}
                  borderRadius={15}
                  backgroundColor={notificationsEnabled ? "primary" : "border"}
                  pressable
                  onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                  center
                >
                  <Box
                    position="absolute"
                    left={notificationsEnabled ? 25 : 5}
                    width={20}
                    height={20}
                    borderRadius={10}
                    backgroundColor="backgroundTertiary"
                  />
                </Box>
              }
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              variant="minimal"
            />

            <ListItem
              title="Language"
              subtitle="English (US)"
              leftIcon={<Globe size={20} color={theme.colors.textSecondary} />}
              showChevron
              onPress={handleLanguagePress}
              variant="minimal"
            />
          </ListSection>

          {/* Security */}
          <ListSection title="Security" variant="glass">
            <ListItem
              title="Biometric Authentication"
              subtitle={biometricsEnabled ? "Enabled" : "Disabled"}
              leftIcon={<Lock size={20} color={theme.colors.textSecondary} />}
              rightElement={
                <Box
                  width={50}
                  height={30}
                  borderRadius={15}
                  backgroundColor={biometricsEnabled ? "primary" : "border"}
                  pressable
                  onPress={() => setBiometricsEnabled(!biometricsEnabled)}
                  center
                >
                  <Box
                    position="absolute"
                    left={biometricsEnabled ? 25 : 5}
                    width={20}
                    height={20}
                    borderRadius={10}
                    backgroundColor="backgroundTertiary"
                  />
                </Box>
              }
              onPress={() => setBiometricsEnabled(!biometricsEnabled)}
              variant="minimal"
            />

            <ListItem
              title="Location Services"
              subtitle={locationEnabled ? "Enabled" : "Disabled"}
              leftIcon={<Globe size={20} color={theme.colors.textSecondary} />}
              rightElement={
                <Box
                  width={50}
                  height={30}
                  borderRadius={15}
                  backgroundColor={locationEnabled ? "primary" : "border"}
                  pressable
                  onPress={() => setLocationEnabled(!locationEnabled)}
                  center
                >
                  <Box
                    position="absolute"
                    left={locationEnabled ? 25 : 5}
                    width={20}
                    height={20}
                    borderRadius={10}
                    backgroundColor="backgroundTertiary"
                  />
                </Box>
              }
              onPress={() => setLocationEnabled(!locationEnabled)}
              variant="minimal"
            />

            <ListItem
              title="Privacy Settings"
              subtitle="Manage your data and privacy"
              leftIcon={<Lock size={20} color={theme.colors.textSecondary} />}
              showChevron
              onPress={handlePrivacyPress}
              variant="minimal"
            />
          </ListSection>

          {/* Support */}
          <ListSection title="Support" variant="glass">
            <ListItem
              title="Help Center"
              subtitle="Get help and contact support"
              leftIcon={<HelpCircle size={20} color={theme.colors.textSecondary} />}
              showChevron
              onPress={handleHelpPress}
              variant="minimal"
            />

            <ListItem
              title="About MyClinic"
              subtitle="Version 1.0.0"
              leftIcon={<HelpCircle size={20} color={theme.colors.textSecondary} />}
              showChevron
              onPress={handleAboutPress}
              variant="minimal"
            />
          </ListSection>

          {/* Account */}
          <Box glass glassVariant="light" p="m" borderRadius="m">
            <ListItem
              title="Logout"
              subtitle="Sign out of your account"
              leftIcon={<LogOut size={20} color={theme.colors.error} />}
              onPress={handleLogout}
              variant="minimal"
            />
          </Box>
        </VStack>
      </Box>
    </Box>
  )
})

SettingsScreen.displayName = "SettingsScreen"
