import type React from "react"
import { Pressable, type ViewStyle } from "react-native"
import { createBox, createText } from "@shopify/restyle"
import { BlurView } from "@react-native-community/blur"
import type { Theme } from "@/theme/theme"

const Box = createBox<Theme>()
const Text = createText<Theme>()

type SegmentedControlProps = {
  options: string[]
  selectedIndex: number
  onSelectionChange: (index: number) => void
  style?: ViewStyle
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedIndex,
  onSelectionChange,
  style,
}) => {
  return (
    <Box flexDirection="row" backgroundColor="glassBackground" borderRadius="xl" padding="xs" style={style}>
      <BlurView
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 20,
        }}
        blurType="light"
        blurAmount={12}
      />
      {options.map((option, index) => (
        <Pressable
          key={option}
          onPress={() => onSelectionChange(index)}
          style={({ pressed }) => ({
            flex: 1,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Box
            backgroundColor={selectedIndex === index ? "backgroundTertiary" : "transparent"}
            borderRadius="l"
            paddingVertical="s"
            paddingHorizontal="m"
            marginHorizontal="xs"
            shadowColor={selectedIndex === index ? "shadow" : undefined}
            shadowOffset={selectedIndex === index ? { width: 0, height: 2 } : undefined}
            shadowOpacity={selectedIndex === index ? 1 : 0}
            shadowRadius={selectedIndex === index ? 4 : 0}
            elevation={selectedIndex === index ? 4 : 0}
          >
            <Text
              variant="body"
              textAlign="center"
              color={selectedIndex === index ? "primary" : "textSecondary"}
              fontWeight={selectedIndex === index ? "600" : "400"}
            >
              {option}
            </Text>
          </Box>
        </Pressable>
      ))}
    </Box>
  )
}
