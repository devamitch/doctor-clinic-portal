"use client"
import { memo } from "react"
import { Image, StyleSheet } from "react-native"
import { Box, Text } from "@/components/ui/core"
import { useThemeStore } from "@/stores/themeStore"

interface AvatarProps {
  source?: string
  name?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  online?: boolean
  verified?: boolean
}

export const Avatar = memo(({ source, name, size = "md", online = false, verified = false }: AvatarProps) => {
  const { theme } = useThemeStore()

  const sizes = {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80,
  }

  const avatarSize = sizes[size]
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?"

  return (
    <Box position="relative">
      <Box
        width={avatarSize}
        height={avatarSize}
        borderRadius={avatarSize / 2}
        backgroundColor="glassBackground"
        center
        overflow="hidden"
        border
      >
        {source ? (
          <Image
            source={{ uri: source }}
            style={[styles.image, { width: avatarSize, height: avatarSize }]}
            resizeMode="cover"
          />
        ) : (
          <Text variant="button" color="textPrimary" fontSize={avatarSize * 0.4}>
            {initials}
          </Text>
        )}
      </Box>

      {/* Online indicator */}
      {online && (
        <Box
          position="absolute"
          bottom={0}
          right={0}
          width={avatarSize * 0.25}
          height={avatarSize * 0.25}
          borderRadius={avatarSize * 0.125}
          backgroundColor="success"
          borderWidth={2}
          borderColor="backgroundTertiary"
        />
      )}

      {/* Verified badge */}
      {verified && (
        <Box
          position="absolute"
          top={-2}
          right={-2}
          width={avatarSize * 0.3}
          height={avatarSize * 0.3}
          borderRadius={avatarSize * 0.15}
          backgroundColor="primary"
          center
        >
          <Text color="backgroundTertiary" fontSize={avatarSize * 0.15}>
            ✓
          </Text>
        </Box>
      )}
    </Box>
  )
})

Avatar.displayName = "Avatar"

const styles = StyleSheet.create({
  image: {
    borderRadius: 100,
  },
})
