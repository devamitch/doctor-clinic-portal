"use client"
import { memo } from "react"
import { Box, Text, HStack, VStack } from "@/components/ui/core"
import type { TimeSlot } from "@/types"
import { useThemeStore } from "@/stores/themeStore"

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[]
  selectedSlot?: string
  onSlotSelect: (slotId: string) => void
  title?: string
}

export const TimeSlotPicker = memo(
  ({ timeSlots, selectedSlot, onSlotSelect, title = "Available Time Slots" }: TimeSlotPickerProps) => {
    const { theme } = useThemeStore()

    const groupedSlots = timeSlots.reduce(
      (acc, slot) => {
        if (!acc[slot.type]) {
          acc[slot.type] = []
        }
        acc[slot.type].push(slot)
        return acc
      },
      {} as Record<string, TimeSlot[]>,
    )

    const getTimeTypeTitle = (type: string) => {
      switch (type) {
        case "morning":
          return "Morning"
        case "afternoon":
          return "Afternoon"
        case "evening":
          return "Evening"
        default:
          return type
      }
    }

    const renderTimeSlot = (slot: TimeSlot) => {
      const isSelected = selectedSlot === slot.id
      const isAvailable = slot.available

      return (
        <Box
          key={slot.id}
          glass={!isSelected}
          glassVariant={isSelected ? "strong" : "light"}
          backgroundColor={isSelected ? "primary" : undefined}
          p="m"
          borderRadius="l"
          center
          pressable={isAvailable}
          onPress={isAvailable ? () => onSlotSelect(slot.id) : undefined}
          opacity={isAvailable ? 1 : 0.5}
          minWidth={80}
        >
          <Text
            variant="button"
            color={isSelected ? "backgroundTertiary" : isAvailable ? "textPrimary" : "textTertiary"}
            fontSize={14}
          >
            {slot.time}
          </Text>
        </Box>
      )
    }

    return (
      <VStack spacing="l">
        <Text variant="title" color="textPrimary">
          {title}
        </Text>

        {Object.entries(groupedSlots).map(([type, slots]) => (
          <VStack key={type} spacing="m">
            <Text variant="subheader" color="textSecondary" fontSize={16}>
              {getTimeTypeTitle(type)}
            </Text>

            <Box flexDirection="row" flexWrap="wrap" gap="s">
              {slots.map(renderTimeSlot)}
            </Box>
          </VStack>
        ))}

        <Box glass glassVariant="light" p="m" borderRadius="l">
          <HStack spacing="m" centerVertical>
            <Box width={12} height={12} borderRadius={6} backgroundColor="success" />
            <Text variant="caption" color="textSecondary">
              Available
            </Text>

            <Box width={12} height={12} borderRadius={6} backgroundColor="textTertiary" ml="l" />
            <Text variant="caption" color="textSecondary">
              Booked
            </Text>
          </HStack>
        </Box>
      </VStack>
    )
  },
)

TimeSlotPicker.displayName = "TimeSlotPicker"
