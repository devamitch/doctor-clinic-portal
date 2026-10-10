"use client"

import { useState, useCallback, memo } from "react"
import { ArrowLeft, Bell, BellOff, Trash2 } from "lucide-react-native"
import { Box, Text, HStack } from "@/components/ui/core"
import { GlassHeader } from "@/components/ui/navigation/GlassHeader"
import { GlassFlatList } from "@/components/ui/lists"
import { ListItem } from "@/components/ui/lists/ListItem"
import { EmptyState } from "@/components/ui/lists/EmptyState"
import { IconButton } from "@/components/ui/buttons/ButtonVariants"
import { useThemeStore } from "@/stores/themeStore"
import { useToastContext } from "@/components/providers/ToastProvider"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  type: "appointment" | "reminder" | "message" | "system"
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Appointment Reminder",
    message: "Your appointment with Dr. Smith is tomorrow at 10:00 AM",
    time: "10 min ago",
    type: "appointment",
    read: false,
  },
  {
    id: "2",
    title: "New Message",
    message: "Dr. Johnson sent you a message regarding your recent visit",
    time: "1 hour ago",
    type: "message",
    read: false,
  },
  {
    id: "3",
    title: "Medication Reminder",
    message: "Time to take your medication: Amoxicillin 500mg",
    time: "3 hours ago",
    type: "reminder",
    read: true,
  },
  {
    id: "4",
    title: "Appointment Confirmed",
    message: "Your appointment with Dr. Williams has been confirmed",
    time: "Yesterday",
    type: "appointment",
    read: true,
  },
  {
    id: "5",
    title: "System Update",
    message: "MyClinic app has been updated to version 2.0",
    time: "2 days ago",
    type: "system",
    read: true,
  },
]

export const NotificationsScreen = memo(() => {
  const { theme } = useThemeStore()
  const { showInfo, showSuccess } = useToastContext()

  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      showSuccess("Refreshed", "Notifications updated")
    }, 1500)
  }, [showSuccess])

  const handleNotificationPress = useCallback(
    (notification: Notification) => {
      if (!notification.read) {
        setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))
      }

      switch (notification.type) {
        case "appointment":
          showInfo("Appointment", "Opening appointment details")
          break
        case "message":
          showInfo("Message", "Opening message")
          break
        case "reminder":
          showInfo("Reminder", "Opening medication details")
          break
        case "system":
          showInfo("System", "Opening system notification")
          break
      }
    },
    [showInfo],
  )

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    showSuccess("Success", "All notifications marked as read")
  }, [showSuccess])

  const handleClearAll = useCallback(() => {
    setNotifications([])
    showSuccess("Success", "All notifications cleared")
  }, [showSuccess])

  const getNotificationIcon = useCallback(
    (type: string) => {
      switch (type) {
        case "appointment":
          return <Bell size={20} color={theme.colors.primary} />
        case "message":
          return <Bell size={20} color={theme.colors.info} />
        case "reminder":
          return <Bell size={20} color={theme.colors.warning} />
        case "system":
          return <Bell size={20} color={theme.colors.textSecondary} />
        default:
          return <Bell size={20} color={theme.colors.textSecondary} />
      }
    },
    [theme],
  )

  const renderNotification = useCallback(
    ({ item: notification }: { item: Notification }) => (
      <ListItem
        title={notification.title}
        subtitle={notification.message}
        description={notification.time}
        leftIcon={getNotificationIcon(notification.type)}
        onPress={() => handleNotificationPress(notification)}
        variant={notification.read ? "minimal" : "highlighted"}
      />
    ),
    [getNotificationIcon, handleNotificationPress],
  )

  const renderHeader = useCallback(() => {
    const unreadCount = notifications.filter((n) => !n.read).length

    return (
      <Box mb="m">
        <HStack justify="between" centerVertical mb="m">
          <Text variant="title" color="textPrimary">
            Notifications
          </Text>
          <Text variant="caption" color="textSecondary">
            {unreadCount} unread
          </Text>
        </HStack>

        {notifications.length > 0 && (
          <HStack spacing="m">
            <Box flex1>
              <IconButton
                text="Mark All Read"
                leftIcon={<BellOff size={18} color={theme.colors.textPrimary} />}
                onPress={handleMarkAllRead}
                variant="glass"
                fullWidth
              />
            </Box>
            <Box flex1>
              <IconButton
                text="Clear All"
                leftIcon={<Trash2 size={18} color={theme.colors.textPrimary} />}
                onPress={handleClearAll}
                variant="glass"
                fullWidth
              />
            </Box>
          </HStack>
        )}
      </Box>
    )
  }, [notifications, theme.colors.textPrimary, handleMarkAllRead, handleClearAll])

  return (
    <Box flex1 backgroundColor="backgroundPrimary">
      {/* Header */}
      <GlassHeader
        title="Notifications"
        leftIcon={<ArrowLeft size={24} color={theme.colors.textPrimary} />}
        onLeftPress={() => showInfo("Navigation", "Going back")}
      />

      {/* Notifications List */}
      <Box p="l">
        <GlassFlatList
          data={notifications}
          renderItem={renderNotification}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState
              icon={<BellOff size={48} color={theme.colors.textTertiary} />}
              title="No Notifications"
              message="You don't have any notifications yet"
              variant="glass"
            />
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
          spacing="m"
          itemSpacing="s"
          showsVerticalScrollIndicator={false}
        />
      </Box>
    </Box>
  )
})

NotificationsScreen.displayName = "NotificationsScreen"
