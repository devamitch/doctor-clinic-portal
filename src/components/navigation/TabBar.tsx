import type React from "react"
import { Pressable, type ViewStyle } from "react-native"
import { createBox, createText } from "@shopify/restyle"
import { BlurView } from "@react-native-community/blur"
import { Home, Clock, User } from "lucide-react-native"
import type { Theme } from "@/theme/theme"
import { useThemeStore } from "@/stores/themeStore"

const Box = createBox<Theme>()
const Text = createText<Theme>()

type TabBarProps = {
  activeTab: string
  onTabPress: (tab: string) => void
  style?: ViewStyle
}

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "history", label: "History", icon: Clock },
  { id: "profile", label: "Profile", icon: User },
]

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabPress, style }) => {
  const { theme } = useThemeStore()

  return (
    <Box position="absolute" bottom={0} left={0} right={0} style={style}>
      <Box position="relative" overflow="hidden">
        <BlurView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          blurType="light"
          blurAmount={20}
        />
        <Box
          backgroundColor="glassBackgroundStrong"
          flexDirection="row"
          paddingTop="m"
          paddingBottom="xl"
          paddingHorizontal="l"
          borderTopWidth={1}
          borderTopColor="border"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <Pressable
                key={tab.id}
                onPress={() => onTabPress(tab.id)}
                style={({ pressed }) => ({
                  flex: 1,
                  alignItems: "center",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Box alignItems="center" paddingVertical="s">
                  <Icon
                    size={24}
                    color={isActive ? theme.colors.primary : theme.colors.textSecondary}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <Text
                    variant="caption"
                    color={isActive ? "primary" : "textSecondary"}
                    fontWeight={isActive ? "600" : "400"}
                    marginTop="xs"
                  >
                    {tab.label}
                  </Text>
                </Box>
              </Pressable>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
