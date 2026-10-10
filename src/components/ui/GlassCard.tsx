import type React from "react"
import type { ViewStyle } from "react-native"
import { createBox } from "@shopify/restyle"
import { BlurView } from "@react-native-community/blur"
import type { Theme } from "@/theme/theme"

const Box = createBox<Theme>()

type GlassCardProps = {
  children: React.ReactNode
  variant?: "glass" | "glassStrong" | "elevated"
  blurType?: "light" | "dark" | "regular"
  blurAmount?: number
  style?: ViewStyle
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = "glass",
  blurType = "light",
  blurAmount = 10,
  style,
}) => {
  return (
    <Box style={style}>
      <BlurView
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 16,
        }}
        blurType={blurType}
        blurAmount={blurAmount}
      />
      <Box variant={variant}>{children}</Box>
    </Box>
  )
}
