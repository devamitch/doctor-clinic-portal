"use client"
import { memo } from "react"
import { Pressable } from "react-native"
import { Star, MapPin, Clock, Heart } from "lucide-react-native"
import { Box, Text, HStack, VStack } from "@/components/ui/core"
import { Avatar } from "@/components/ui/atoms/Avatar"
import { Badge } from "@/components/ui/atoms/Badge"
import { StatusIndicator } from "@/components/ui/atoms/StatusIndicator"
import { IconButton } from "@/components/ui/buttons/ButtonVariants"
import type { Doctor } from "@/types"
import { useThemeStore } from "@/stores/themeStore"

interface DoctorCardProps {
  doctor: Doctor
  onPress: () => void
  onFavorite?: () => void
  isFavorite?: boolean
  variant?: "default" | "compact" | "featured"
}

export const DoctorCard = memo(
  ({ doctor, onPress, onFavorite, isFavorite = false, variant = "default" }: DoctorCardProps) => {
    const { theme } = useThemeStore()

    const renderStars = (rating: number) => {
      return Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={12}
          color={index < Math.floor(rating) ? theme.colors.starFilled : theme.colors.starEmpty}
          fill={index < Math.floor(rating) ? theme.colors.starFilled : "transparent"}
        />
      ))
    }

    if (variant === "compact") {
      return (
        <Pressable onPress={onPress}>
          <Box glass glassVariant="medium" p="m" borderRadius="l" mb="s">
            <HStack spacing="m" centerVertical>
              <Avatar
                source={doctor.image}
                name={doctor.name}
                size="md"
                online={doctor.isOnline}
                verified={doctor.isVerified}
              />
              <VStack flex1 spacing="xs">
                <Text variant="subheader" color="textPrimary" numberOfLines={1}>
                  {doctor.name}
                </Text>
                <Text variant="bodySmall" color="textSecondary" numberOfLines={1}>
                  {doctor.specialty}
                </Text>
                <HStack spacing="xs" centerVertical>
                  {renderStars(doctor.rating)}
                  <Text variant="caption" color="textSecondary" ml="xs">
                    {doctor.rating} ({doctor.reviewCount})
                  </Text>
                </HStack>
              </VStack>
              {onFavorite && (
                <IconButton
                  leftIcon={<Heart size={16} color={isFavorite ? theme.colors.error : theme.colors.textSecondary} />}
                  onPress={onFavorite}
                  size="small"
                  variant="ghost"
                />
              )}
            </HStack>
          </Box>
        </Pressable>
      )
    }

    if (variant === "featured") {
      return (
        <Pressable onPress={onPress}>
          <Box glass glassVariant="strong" p="l" borderRadius="xl" shadow="medium">
            <VStack spacing="m">
              <HStack justify="between" centerVertical>
                <Avatar
                  source={doctor.image}
                  name={doctor.name}
                  size="lg"
                  online={doctor.isOnline}
                  verified={doctor.isVerified}
                />
                {onFavorite && (
                  <IconButton
                    leftIcon={<Heart size={20} color={isFavorite ? theme.colors.error : theme.colors.textSecondary} />}
                    onPress={onFavorite}
                    variant="ghost"
                  />
                )}
              </HStack>

              <VStack spacing="xs">
                <Text variant="title" color="textPrimary">
                  {doctor.name}
                </Text>
                <Text variant="body" color="textSecondary">
                  {doctor.specialty}
                </Text>

                <HStack spacing="m" centerVertical>
                  <HStack spacing="xs" centerVertical>
                    <Clock size={14} color={theme.colors.textSecondary} />
                    <Text variant="caption" color="textSecondary">
                      {doctor.experience}
                    </Text>
                  </HStack>
                  <HStack spacing="xs" centerVertical>
                    {renderStars(doctor.rating)}
                    <Text variant="caption" color="textSecondary">
                      {doctor.rating}
                    </Text>
                  </HStack>
                </HStack>

                {doctor.location && (
                  <HStack spacing="xs" centerVertical>
                    <MapPin size={14} color={theme.colors.textSecondary} />
                    <Text variant="caption" color="textSecondary" numberOfLines={1}>
                      {doctor.location}
                    </Text>
                  </HStack>
                )}
              </VStack>

              <HStack justify="between" centerVertical>
                <VStack>
                  <Text variant="caption" color="textSecondary">
                    Consultation Fee
                  </Text>
                  <Text variant="subheader" color="primary">
                    ${doctor.consultationFee}
                  </Text>
                </VStack>

                <Badge variant={doctor.isOnline ? "success" : "secondary"}>
                  {doctor.isOnline ? "Available" : "Offline"}
                </Badge>
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
              source={doctor.image}
              name={doctor.name}
              size="lg"
              online={doctor.isOnline}
              verified={doctor.isVerified}
            />

            <VStack flex1 spacing="xs">
              <HStack justify="between" centerVertical>
                <Text variant="subheader" color="textPrimary" flex1 numberOfLines={1}>
                  {doctor.name}
                </Text>
                {onFavorite && (
                  <IconButton
                    leftIcon={<Heart size={16} color={isFavorite ? theme.colors.error : theme.colors.textSecondary} />}
                    onPress={onFavorite}
                    size="small"
                    variant="ghost"
                  />
                )}
              </HStack>

              <HStack spacing="m" centerVertical>
                <HStack spacing="xs" centerVertical>
                  <MapPin size={14} color={theme.colors.textSecondary} />
                  <Text variant="bodySmall" color="textSecondary" numberOfLines={1}>
                    {doctor.specialty}
                  </Text>
                </HStack>
                <Text variant="bodySmall" color="textTertiary">
                  |
                </Text>
                <HStack spacing="xs" centerVertical>
                  <Clock size={14} color={theme.colors.textSecondary} />
                  <Text variant="bodySmall" color="textSecondary">
                    {doctor.experience}
                  </Text>
                </HStack>
              </HStack>

              <HStack spacing="xs" centerVertical mb="m">
                {renderStars(doctor.rating)}
                <Text variant="bodySmall" color="textSecondary">
                  {doctor.rating} ({doctor.reviewCount})
                </Text>
              </HStack>

              <HStack justify="between" centerVertical>
                <StatusIndicator status={doctor.isOnline ? "online" : "offline"} showText size="sm" />

                <Box glass glassVariant="light" px="m" py="s" borderRadius="l">
                  <Text variant="button" color="primary" fontSize={14}>
                    Book Now
                  </Text>
                </Box>
              </HStack>
            </VStack>
          </HStack>
        </Box>
      </Pressable>
    )
  },
)

DoctorCard.displayName = "DoctorCard"
