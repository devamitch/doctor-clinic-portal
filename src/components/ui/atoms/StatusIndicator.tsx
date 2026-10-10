"use client"
import { memo } from "react"
import { Box, Text } from "@/components/ui/core"

interface StatusIndicatorProps {
  status: "online" | "offline" | "busy" | "away"
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export const StatusIndicator = memo(({ status, showText = false, size = "md" }: StatusIndicatorProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "success"
      case "busy":
        return "error"
      case "away":
        return "warning"
      default:
        return "textTertiary"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "Online"
      case "busy":
        return "Busy"
      case "away":
        return "Away"
      default:
        return "Offline"
    }
  }

  const sizes = {
    sm: 6,
    md: 8,
    lg: 10,
  }

  const indicatorSize = sizes[size]

  if (showText) {
    return (
      <Box row centerVertical>
        <Box
          width={indicatorSize}
          height={indicatorSize}
          borderRadius={indicatorSize / 2}
          backgroundColor={getStatusColor()}
          mr="xs"
        />
        <Text variant="caption" color="textSecondary">
          {getStatusText()}
        </Text>
      </Box>
    )
  }

  return (
    <Box
      width={indicatorSize}
      height={indicatorSize}
      borderRadius={indicatorSize / 2}
      backgroundColor={getStatusColor()}
    />
  )
})

StatusIndicator.displayName = "StatusIndicator"
