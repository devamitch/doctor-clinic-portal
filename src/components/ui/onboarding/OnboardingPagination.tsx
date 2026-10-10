"use client"

import type React from "react"
import { StyleSheet, View } from "react-native"
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated"
import { useThemeStore } from "@/stores/themeStore"

interface OnboardingPaginationProps {
  data: any[]
  scrollX: Animated.SharedValue<number>
  screenWidth: number
}

export const OnboardingPagination: React.FC<OnboardingPaginationProps> = ({ data, scrollX, screenWidth }) => {
  const { theme } = useThemeStore()

  const animatedStyles = data.map((_, index) => {
    return useAnimatedStyle(() => {
      const inputRange = [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth]

      const dotWidth = interpolate(scrollX.value, inputRange, [8, 24, 8], Extrapolate.CLAMP)

      const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolate.CLAMP)

      return {
        width: dotWidth,
        opacity,
      }
    })
  })

  return (
    <View style={styles.container}>
      {data.map((_, index) => {
        return (
          <Animated.View
            key={index}
            style={[styles.dot, { backgroundColor: theme.colors.primary }, animatedStyles[index]]}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
})
