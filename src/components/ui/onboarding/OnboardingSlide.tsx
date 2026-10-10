"use client"

import type React from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import { Box, Text } from "@/theme/theme"
import { GradientBackground } from "@/components/layout/GradientBackground"

const { width: screenWidth } = Dimensions.get("window")

export interface OnboardingSlideProps {
  title: string
  subtitle: string
  image: React.ReactNode
  backgroundColor?: string
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ title, subtitle, image, backgroundColor }) => {
  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <GradientBackground />

      <Box flex={1} justifyContent="center" alignItems="center" padding="xl">
        {/* Image/Icon Section */}
        <Box flex={0.6} justifyContent="center" alignItems="center">
          {image}
        </Box>

        {/* Content Section */}
        <Box flex={0.4} justifyContent="flex-start" alignItems="center" paddingTop="xl">
          <Text
            variant="heading"
            color="textPrimary"
            textAlign="center"
            marginBottom="m"
            fontSize={28}
            fontWeight="700"
          >
            {title}
          </Text>

          <Text variant="body" color="textSecondary" textAlign="center" lineHeight={24} paddingHorizontal="l">
            {subtitle}
          </Text>
        </Box>
      </Box>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
