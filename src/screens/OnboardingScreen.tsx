"use client"

import { useState, useCallback, useRef, memo } from "react"
import { FlatList, Dimensions, StyleSheet } from "react-native"
import { Box, Text, HStack } from "@/components/ui/core"
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons/ButtonVariants"
import { useAuthStore } from "@/stores/authStore"

const { width } = Dimensions.get("window")

interface OnboardingSlide {
  id: string
  title: string
  description: string
  image: string
}

const slides: OnboardingSlide[] = [
  {
    id: "1",
    title: "Find Your Doctor",
    description: "Easily find and book appointments with top specialists in your area",
    image: "/placeholder.svg?height=300&width=300&text=Doctor",
  },
  {
    id: "2",
    title: "Online Consultations",
    description: "Connect with healthcare professionals through video calls from anywhere",
    image: "/placeholder.svg?height=300&width=300&text=Video",
  },
  {
    id: "3",
    title: "Track Your Health",
    description: "Monitor your health metrics and get personalized insights",
    image: "/placeholder.svg?height=300&width=300&text=Health",
  },
  {
    id: "4",
    title: "Secure & Private",
    description: "Your health data is encrypted and protected with the highest security standards",
    image: "/placeholder.svg?height=300&width=300&text=Security",
  },
]

export const OnboardingScreen = memo(() => {
  const { completeOnboarding } = useAuthStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true })
      setCurrentIndex(currentIndex + 1)
    } else {
      completeOnboarding()
    }
  }, [currentIndex, completeOnboarding])

  const handleSkip = useCallback(() => {
    completeOnboarding()
  }, [completeOnboarding])

  const handleScroll = useCallback(
    (event: any) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x
      const newIndex = Math.round(contentOffsetX / width)
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex)
      }
    },
    [currentIndex],
  )

  const renderSlide = useCallback(
    ({ item }: { item: OnboardingSlide }) => (
      <Box width={width} p="xl" center>
        <Box
          width={300}
          height={300}
          borderRadius={150}
          backgroundColor="backgroundSecondary"
          center
          mb="xl"
          glass
          glassVariant="medium"
        >
          <Box width={200} height={200} borderRadius={100} backgroundColor="primary" center glass glassVariant="strong">
            <Text variant="display" color="backgroundTertiary" fontSize={36}>
              {item.id}
            </Text>
          </Box>
        </Box>

        <Text variant="header" color="textPrimary" textAlign="center" mb="m">
          {item.title}
        </Text>
        <Text variant="body" color="textSecondary" textAlign="center">
          {item.description}
        </Text>
      </Box>
    ),
    [],
  )

  const renderPagination = () => (
    <HStack spacing="s" centerHorizontal mb="xl">
      {slides.map((_, index) => (
        <Box
          key={index}
          width={index === currentIndex ? 24 : 8}
          height={8}
          borderRadius={4}
          backgroundColor={index === currentIndex ? "primary" : "border"}
          glass={index === currentIndex}
          glassVariant={index === currentIndex ? "medium" : undefined}
        />
      ))}
    </HStack>
  )

  return (
    <Box flex1 backgroundColor="backgroundPrimary">
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.flatListContent}
      />

      <Box p="xl">
        {renderPagination()}

        <PrimaryButton
          text={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          fullWidth
        />

        {currentIndex < slides.length - 1 && (
          <Box mt="m">
            <SecondaryButton text="Skip" onPress={handleSkip} fullWidth />
          </Box>
        )}
      </Box>
    </Box>
  )
})

OnboardingScreen.displayName = "OnboardingScreen"

const styles = StyleSheet.create({
  flatListContent: {
    alignItems: "center",
  },
})
