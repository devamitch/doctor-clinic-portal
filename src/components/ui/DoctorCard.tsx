import type React from "react"
import { Image, Pressable, type ViewStyle } from "react-native"
import { createBox, createText } from "@shopify/restyle"
import { BlurView } from "@react-native-community/blur"
import { Star, Clock, MapPin } from "lucide-react-native"
import type { Theme } from "@/theme/theme"

const Box = createBox<Theme>()
const Text = createText<Theme>()

type DoctorCardProps = {
  doctor: {
    id: string
    name: string
    specialty: string
    experience: string
    rating: number
    reviewCount: number
    image: string
    location?: string
  }
  onPress: () => void
  style?: ViewStyle
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress, style }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        color={index < Math.floor(rating) ? "#FFD700" : "#E5E5E5"}
        fill={index < Math.floor(rating) ? "#FFD700" : "transparent"}
      />
    ))
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
    >
      <Box position="relative" borderRadius="xl" overflow="hidden">
        <BlurView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          blurType="light"
          blurAmount={15}
        />
        <Box
          backgroundColor="glassBackgroundStrong"
          borderRadius="xl"
          padding="l"
          flexDirection="row"
          alignItems="center"
        >
          <Box width={80} height={80} borderRadius="l" overflow="hidden" marginRight="m">
            <Image source={{ uri: doctor.image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
          </Box>

          <Box flex={1}>
            <Box flexDirection="row" alignItems="center" marginBottom="xs">
              <Text variant="subheader" color="textPrimary" flex={1}>
                {doctor.name}
              </Text>
              <Box
                backgroundColor="primary"
                borderRadius="round"
                width={20}
                height={20}
                alignItems="center"
                justifyContent="center"
              >
                <Text variant="caption" color="backgroundTertiary" fontSize={10}>
                  ✓
                </Text>
              </Box>
            </Box>

            <Box flexDirection="row" alignItems="center" marginBottom="xs">
              <MapPin size={14} color="#666666" />
              <Text variant="bodySmall" color="textSecondary" marginLeft="xs">
                {doctor.specialty}
              </Text>
              <Text variant="bodySmall" color="textTertiary" marginLeft="s">
                |
              </Text>
              <Clock size={14} color="#666666" style={{ marginLeft: 8 }} />
              <Text variant="bodySmall" color="textSecondary" marginLeft="xs">
                {doctor.experience}
              </Text>
            </Box>

            <Box flexDirection="row" alignItems="center" marginBottom="m">
              <Box flexDirection="row" marginRight="xs">
                {renderStars(doctor.rating)}
              </Box>
              <Text variant="bodySmall" color="textSecondary">
                {doctor.rating} ({doctor.reviewCount})
              </Text>
            </Box>

            <Box
              backgroundColor="glassBackground"
              borderRadius="l"
              paddingVertical="s"
              paddingHorizontal="m"
              alignSelf="flex-start"
            >
              <Text variant="button" color="primary" fontSize={14}>
                Re-Schedule
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Pressable>
  )
}
