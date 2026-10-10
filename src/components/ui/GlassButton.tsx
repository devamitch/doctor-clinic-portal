import type React from "react"
import { Pressable, type ViewStyle } from "react-native"
import { createBox, createText } from "@shopify/restyle"
import { BlurView } from "@react-native-community/blur"
import type { Theme } from "@/theme/theme"

const Box = createBox<Theme>()
const Text = createText<Theme>()

type GlassButtonProps = {
  title: string
  onPress: () => void
  variant?: "primary" | "glass" | "ghost"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  style?: ViewStyle
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  variant = "glass",
  size = "medium",
  disabled = false,
  style,
}) => {
  const getSizeProps = () => {
    switch (size) {
      case "small":
        return { paddingVertical: "s", paddingHorizontal: "m" }
      case "large":
        return { paddingVertical: "l", paddingHorizontal: "xl" }
      default:
        return { paddingVertical: "m", paddingHorizontal: "l" }
    }
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
    >
      <Box position="relative" borderRadius="l" overflow="hidden">
        {variant === "glass" && (
          <BlurView
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            blurType="light"
            blurAmount={8}
          />
        )}
        <Box variant={variant} {...getSizeProps()}>
          <Text
            variant="button"
            textAlign="center"
            color={variant === "primary" ? "backgroundTertiary" : "textPrimary"}
          >
            {title}
          </Text>
        </Box>
      </Box>
    </Pressable>
  )
}
