"use client"
import { memo } from "react"
import { Pressable } from "react-native"
import { Calendar, Clock, MapPin, Phone, Video, MessageCircle } from "lucide-react-native"
import { Box, Text, HStack, VStack } from "@/components/ui/core"
import { Avatar } from "@/components/ui/atoms/Avatar"
import { Badge } from "@/components/ui/atoms/Badge"
import { IconButton } from "@/components/ui/buttons/ButtonVariants"
import type { Appointment } from "@/types"
import { useThemeStore } from "@/stores/themeStore"

interface AppointmentCardProps {
  appointment: Appointment
  onPress?: () => void
  onCall?: () => void
  onVideo?: () => void
  onMessage?: () => void
  onReschedule?: () => void
  variant?: "default" | "compact" | "detailed"
}

export const AppointmentCard = memo(
  ({ appointment, onPress, onCall, onVideo, onMessage, onReschedule, variant = "default" }: AppointmentCardProps) => {
    const { theme } = useThemeStore()

    const getStatusColor = () => {
      switch (appointment.status) {
        case "upcoming":
          return "primary"
        case "completed":
          return "success"
        case "cancelled":
          return "error"
        case "in-progress":
          return "warning"
        default:
          return "secondary"
      }
    }

    const getStatusText = () => {
      switch (appointment.status) {
        case "upcoming":
          return "Upcoming"
        case "completed":
          return "Completed"
        case "cancelled":
          return "Cancelled"
        case "in-progress":
          return "In Progress"
        default:
          return "Unknown"
      }
    }

    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    }

    if (variant === "compact") {
      return (
        <Pressable onPress={onPress}>
          <Box glass glassVariant="medium" p="m" borderRadius="l" mb="s">
            <HStack spacing="m" centerVertical>
              <Avatar
                source={appointment.doctor.image}
                name={appointment.doctor.name}
                size="sm"
                verified={appointment.doctor.isVerified}
              />
              <VStack flex1 spacing="xs">
                <Text variant="body" color="textPrimary" numberOfLines={1}>
                  {appointment.doctor.name}
                </Text>
                <HStack spacing="xs" centerVertical>
                  <Calendar size={12} color={theme.colors.textSecondary} />
                  <Text variant="caption" color="textSecondary">
                    {formatDate(appointment.date)} • {appointment.time}
                  </Text>
                </HStack>
              </VStack>
              <Badge variant={getStatusColor()} size="sm">
                {getStatusText()}
              </Badge>
            </HStack>
          </Box>
        </Pressable>
      )
    }

    if (variant === "detailed") {
      return (
        <Pressable onPress={onPress}>
          <Box glass glassVariant="strong" p="l" borderRadius="xl" shadow="medium" mb="m">
            <VStack spacing="m">
              <HStack justify="between" centerVertical>
                <HStack spacing="m" centerVertical flex1>
                  <Avatar
                    source={appointment.doctor.image}
                    name={appointment.doctor.name}
                    size="lg"
                    verified={appointment.doctor.isVerified}
                  />
                  <VStack flex1 spacing="xs">
                    <Text variant="title" color="textPrimary">
                      {appointment.doctor.name}
                    </Text>
                    <Text variant="body" color="textSecondary">
                      {appointment.doctor.specialty}
                    </Text>
                    <HStack spacing="xs" centerVertical>
                      <MapPin size={14} color={theme.colors.textSecondary} />
                      <Text variant="caption" color="textSecondary">
                        {appointment.doctor.location}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
                <Badge variant={getStatusColor()}>{getStatusText()}</Badge>
              </HStack>

              <Box glass glassVariant="light" p="m" borderRadius="l">
                <VStack spacing="s">
                  <HStack spacing="m" centerVertical>
                    <Calendar size={16} color={theme.colors.primary} />
                    <Text variant="body" color="textPrimary">
                      {formatDate(appointment.date)}
                    </Text>
                  </HStack>
                  <HStack spacing="m" centerVertical>
                    <Clock size={16} color={theme.colors.primary} />
                    <Text variant="body" color="textPrimary">
                      {appointment.time} ({appointment.duration} min)
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              {appointment.notes && (
                <Box>
                  <Text variant="caption" color="textSecondary" mb="xs">
                    Notes:
                  </Text>
                  <Text variant="body" color="textPrimary">
                    {appointment.notes}
                  </Text>
                </Box>
              )}

              <HStack spacing="s" justify="between">
                {onCall && (
                  <IconButton
                    leftIcon={<Phone size={18} color={theme.colors.success} />}
                    onPress={onCall}
                    variant="ghost"
                    size="small"
                  />
                )}
                {onVideo && (
                  <IconButton
                    leftIcon={<Video size={18} color={theme.colors.primary} />}
                    onPress={onVideo}
                    variant="ghost"
                    size="small"
                  />
                )}
                {onMessage && (
                  <IconButton
                    leftIcon={<MessageCircle size={18} color={theme.colors.info} />}
                    onPress={onMessage}
                    variant="ghost"
                    size="small"
                  />
                )}
                {onReschedule && appointment.status === "upcoming" && (
                  <Box flex1 ml="m">
                    <Box
                      glass
                      glassVariant="light"
                      px="m"
                      py="s"
                      borderRadius="l"
                      center
                      pressable
                      onPress={onReschedule}
                    >
                      <Text variant="button" color="primary" fontSize={14}>
                        Reschedule
                      </Text>
                    </Box>
                  </Box>
                )}
              </HStack>
            </VStack>
          </Box>
        </Pressable>
      )
    }

    // Default variant
    return (
      <Pressable onPress={onPress}>
        <Box glass glassVariant="medium" p="l" borderRadius="l" mb="m">
          <HStack spacing="m">
            <Avatar
              source={appointment.doctor.image}
              name={appointment.doctor.name}
              size="md"
              verified={appointment.doctor.isVerified}
            />

            <VStack flex1 spacing="xs">
              <HStack justify="between" centerVertical>
                <Text variant="subheader" color="textPrimary" flex1 numberOfLines={1}>
                  {appointment.doctor.name}
                </Text>
                <Badge variant={getStatusColor()} size="sm">
                  {getStatusText()}
                </Badge>
              </HStack>

              <Text variant="body" color="textSecondary" numberOfLines={1}>
                {appointment.doctor.specialty}
              </Text>

              <HStack spacing="m" centerVertical>
                <HStack spacing="xs" centerVertical>
                  <Calendar size={14} color={theme.colors.textSecondary} />
                  <Text variant="bodySmall" color="textSecondary">
                    {formatDate(appointment.date)}
                  </Text>
                </HStack>
                <HStack spacing="xs" centerVertical>
                  <Clock size={14} color={theme.colors.textSecondary} />
                  <Text variant="bodySmall" color="textSecondary">
                    {appointment.time}
                  </Text>
                </HStack>
              </HStack>

              {appointment.status === "upcoming" && (
                <HStack spacing="s" mt="s">
                  <Box flex1>
                    <Box
                      glass
                      glassVariant="light"
                      px="m"
                      py="s"
                      borderRadius="l"
                      center
                      pressable
                      onPress={onReschedule}
                    >
                      <Text variant="button" color="primary" fontSize={14}>
                        Reschedule
                      </Text>
                    </Box>
                  </Box>
                  {onMessage && (
                    <IconButton
                      leftIcon={<MessageCircle size={16} color={theme.colors.primary} />}
                      onPress={onMessage}
                      variant="ghost"
                      size="small"
                    />
                  )}
                </HStack>
              )}
            </VStack>
          </HStack>
        </Box>
      </Pressable>
    )
  },
)

AppointmentCard.displayName = "AppointmentCard"
