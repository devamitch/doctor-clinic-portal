"use client"

import { useState, useCallback, memo } from "react"
import { ScrollView } from "react-native"
import { ArrowLeft, Edit, Settings, Bell, Shield, HelpCircle, LogOut } from "lucide-react-native"
import { Box, Text, HStack, VStack } from "@/components/ui/core"
import { GlassHeader } from "@/components/ui/navigation/GlassHeader"
import { Avatar } from "@/components/ui/atoms/Avatar"
import { ListItem } from "@/components/ui/lists/ListItem"
import { ListSection } from "@/components/ui/lists/ListSection"
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons/ButtonVariants"
import { useThemeStore } from "@/stores/themeStore"
import { useAuthStore } from "@/stores/authStore"
import { useToastContext } from "@/components/providers/ToastProvider"

export const ProfileScreen = memo(() => {
  const { theme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const { showInfo, showSuccess } = useToastContext()

  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      showSuccess("Refreshed", "Profile updated")
    }, 1500)
  }, [showSuccess])

  const handleLogout = useCallback(() => {
    logout()
    showInfo("Logged Out", "You have been logged out successfully")
  }, [logout, showInfo])

  const profileMenuItems = [
    {
      id: "edit-profile",
      title: "Edit Profile",
      subtitle: "Update your personal information",
      leftIcon: <Edit size={20} color={theme.colors.textSecondary} />,
      onPress: () => showInfo("Edit Profile", "Opening profile editor"),
      showChevron: true,
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Manage your notification preferences",
      leftIcon: <Bell size={20} color={theme.colors.textSecondary} />,
      onPress: () => showInfo("Notifications", "Opening notification settings"),
      showChevron: true,
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      subtitle: "Control your privacy settings",
      leftIcon: <Shield size={20} color={theme.colors.textSecondary} />,
      onPress: () => showInfo("Privacy", "Opening privacy settings"),
      showChevron: true,
    },
  ]

  const supportMenuItems = [
    {
      id: "help",
      title: "Help & Support",
      subtitle: "Get help and contact support",
      leftIcon: <HelpCircle size={20} color={theme.colors.textSecondary} />,
      onPress: () => showInfo("Help", "Opening help center"),
      showChevron: true,
    },
    {
      id: "settings",
      title: "App Settings",
      subtitle: "Configure app preferences",
      leftIcon: <Settings size={20} color={theme.colors.textSecondary} />,
      onPress: () => showInfo("Settings", "Opening app settings"),
      showChevron: true,
    },
  ]

  return (
    <Box flex1 backgroundColor="backgroundPrimary">
      {/* Header */}
      <GlassHeader
        title="Profile"
        leftIcon={<ArrowLeft size={24} color={theme.colors.textPrimary} />}
        onLeftPress={() => showInfo("Navigation", "Going back")}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack spacing="l" p="l">
          {/* Profile Header */}
          <Box glass glassVariant="medium" p="xl" borderRadius="l" center>
            <VStack spacing="m" centerHorizontal>
              <Avatar
                size="xlarge"
                name={user?.name || "User"}
                source={user?.avatar ? { uri: user.avatar } : undefined}
                showOnlineStatus={false}
              />

              <VStack spacing="xs" centerHorizontal>
                <Text variant="title" color="textPrimary" textAlign="center">
                  {user?.name || "John Doe"}
                </Text>
                <Text variant="body" color="textSecondary" textAlign="center">
                  {user?.email || "john.doe@example.com"}
                </Text>
                <Text variant="caption" color="textTertiary" textAlign="center">
                  Member since {new Date().getFullYear()}
                </Text>
              </VStack>

              <HStack spacing="m" mt="m">
                <PrimaryButton
                  text="Edit Profile"
                  onPress={() => showInfo("Edit", "Opening profile editor")}
                  size="small"
                />
                <SecondaryButton
                  text="View QR"
                  onPress={() => showInfo("QR Code", "Showing your QR code")}
                  size="small"
                />
              </HStack>
            </VStack>
          </Box>

          {/* Quick Stats */}
          <HStack spacing="m">
            <Box flex1 glass glassVariant="light" p="m" borderRadius="m" center>
              <VStack spacing="xs" centerHorizontal>
                <Text variant="display" color="primary" fontSize={20}>
                  12
                </Text>
                <Text variant="caption" color="textSecondary">
                  Appointments
                </Text>
              </VStack>
            </Box>

            <Box flex1 glass glassVariant="light" p="m" borderRadius="m" center>
              <VStack spacing="xs" centerHorizontal>
                <Text variant="display" color="success" fontSize={20}>
                  8
                </Text>
                <Text variant="caption" color="textSecondary">
                  Completed
                </Text>
              </VStack>
            </Box>

            <Box flex1 glass glassVariant="light" p="m" borderRadius="m" center>
              <VStack spacing="xs" centerHorizontal>
                <Text variant="display" color="textPrimary" fontSize={20}>
                  4.8
                </Text>
                <Text variant="caption" color="textSecondary">
                  Rating
                </Text>
              </VStack>
            </Box>
          </HStack>

          {/* Profile Settings */}
          <ListSection title="Profile Settings" variant="glass">
            {profileMenuItems.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                leftIcon={item.leftIcon}
                showChevron={item.showChevron}
                onPress={item.onPress}
                variant="minimal"
              />
            ))}
          </ListSection>

          {/* Support */}
          <ListSection title="Support" variant="glass">
            {supportMenuItems.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                leftIcon={item.leftIcon}
                showChevron={item.showChevron}
                onPress={item.onPress}
                variant="minimal"
              />
            ))}
          </ListSection>

          {/* Logout */}
          <Box glass glassVariant="light" p="m" borderRadius="m">
            <ListItem
              title="Logout"
              subtitle="Sign out of your account"
              leftIcon={<LogOut size={20} color={theme.colors.error} />}
              onPress={handleLogout}
              variant="minimal"
            />
          </Box>

          {/* Bottom spacing */}
          <Box height={100} />
        </VStack>
      </ScrollView>
    </Box>
  )
})

ProfileScreen.displayName = "ProfileScreen"
