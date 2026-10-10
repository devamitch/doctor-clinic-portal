"use client"

import { useState, useCallback, memo } from "react"
import { ScrollView } from "react-native"
import { Activity, Plus, Heart, Droplet, Weight, Thermometer, ArrowLeft } from "lucide-react-native"
import { Box, Text, HStack, VStack } from "@/components/ui/core"
import { PrimaryButton } from "@/components/ui/buttons/ButtonVariants"
import { GlassFlatList } from "@/components/ui/lists/GlassFlatList"
import { GlassHeader } from "@/components/ui/navigation/GlassHeader"
import { GlassRefreshControl } from "@/components/ui/feedback/GlassRefreshControl"
import { useThemeStore } from "@/stores/themeStore"
import { useToastContext } from "@/components/providers/ToastProvider"

interface HealthMetric {
  id: string
  type: "heart_rate" | "blood_pressure" | "weight" | "temperature" | "blood_sugar"
  value: string
  unit: string
  date: string
  time: string
  status: "normal" | "warning" | "critical"
}

const mockMetrics: HealthMetric[] = [
  {
    id: "1",
    type: "heart_rate",
    value: "72",
    unit: "bpm",
    date: "Today",
    time: "9:30 AM",
    status: "normal",
  },
  {
    id: "2",
    type: "blood_pressure",
    value: "120/80",
    unit: "mmHg",
    date: "Today",
    time: "9:32 AM",
    status: "normal",
  },
  {
    id: "3",
    type: "weight",
    value: "165",
    unit: "lbs",
    date: "Yesterday",
    time: "8:15 AM",
    status: "normal",
  },
  {
    id: "4",
    type: "temperature",
    value: "98.6",
    unit: "°F",
    date: "Yesterday",
    time: "8:20 AM",
    status: "normal",
  },
  {
    id: "5",
    type: "blood_sugar",
    value: "110",
    unit: "mg/dL",
    date: "May 15, 2023",
    time: "7:45 AM",
    status: "normal",
  },
  {
    id: "6",
    type: "heart_rate",
    value: "75",
    unit: "bpm",
    date: "May 14, 2023",
    time: "10:15 AM",
    status: "normal",
  },
  {
    id: "7",
    type: "blood_pressure",
    value: "125/85",
    unit: "mmHg",
    date: "May 14, 2023",
    time: "10:20 AM",
    status: "warning",
  },
]

export const HealthMetricsScreen = memo(() => {
  const { theme } = useThemeStore()
  const { showInfo, showSuccess } = useToastContext()

  const [metrics, setMetrics] = useState<HealthMetric[]>(mockMetrics)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedMetricType, setSelectedMetricType] = useState<string | null>(null)

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      showSuccess("Refreshed", "Health metrics updated")
    }, 1500)
  }, [showSuccess])

  const handleAddMetric = useCallback(() => {
    showInfo("Add Metric", "Opening metric input form")
  }, [showInfo])

  const handleMetricPress = useCallback(
    (metric: HealthMetric) => {
      showInfo("Metric Details", `Viewing ${getMetricName(metric.type)} details`)
    },
    [showInfo],
  )

  const handleFilterByType = useCallback((type: string | null) => {
    setSelectedMetricType(type)
  }, [])

  const getMetricName = (type: string) => {
    switch (type) {
      case "heart_rate":
        return "Heart Rate"
      case "blood_pressure":
        return "Blood Pressure"
      case "weight":
        return "Weight"
      case "temperature":
        return "Temperature"
      case "blood_sugar":
        return "Blood Sugar"
      default:
        return type
    }
  }

  const getMetricIcon = useCallback(
    (type: string) => {
      switch (type) {
        case "heart_rate":
          return <Heart size={24} color={theme.colors.error} />
        case "blood_pressure":
          return <Activity size={24} color={theme.colors.primary} />
        case "weight":
          return <Weight size={24} color={theme.colors.success} />
        case "temperature":
          return <Thermometer size={24} color={theme.colors.warning} />
        case "blood_sugar":
          return <Droplet size={24} color={theme.colors.info} />
        default:
          return <Activity size={24} color={theme.colors.textSecondary} />
      }
    },
    [theme],
  )

  const filteredMetrics = selectedMetricType ? metrics.filter((metric) => metric.type === selectedMetricType) : metrics

  const metricTypes = Array.from(new Set(metrics.map((metric) => metric.type)))

  const renderMetric = useCallback(
    ({ item: metric }: { item: HealthMetric }) => (
      <Box
        glass
        glassVariant="medium"
        p="m"
        borderRadius="m"
        mb="m"
        pressable
        onPress={() => handleMetricPress(metric)}
      >
        <HStack spacing="m" centerVertical>
          <Box
            width={50}
            height={50}
            borderRadius={25}
            backgroundColor={
              metric.status === "normal" ? "backgroundSecondary" : metric.status === "warning" ? "warning" : "error"
            }
            center
            glass
            glassVariant="light"
          >
            {getMetricIcon(metric.type)}
          </Box>

          <VStack spacing="xxs" flex1>
            <Text variant="subheader" color="textPrimary">
              {getMetricName(metric.type)}
            </Text>
            <Text variant="caption" color="textSecondary">
              {metric.date} at {metric.time}
            </Text>
          </VStack>

          <VStack spacing="xxs" alignItems="flex-end">
            <Text variant="title" color="textPrimary">
              {metric.value}
            </Text>
            <Text variant="caption" color="textSecondary">
              {metric.unit}
            </Text>
          </VStack>
        </HStack>
      </Box>
    ),
    [getMetricIcon, handleMetricPress],
  )

  const renderHeader = useCallback(() => {
    return (
      <VStack spacing="m" mb="m">
        <HStack justify="between" centerVertical>
          <Text variant="title" color="textPrimary">
            Health Metrics
          </Text>
          <PrimaryButton
            text="Add New"
            leftIcon={<Plus size={18} color="#FFFFFF" />}
            onPress={handleAddMetric}
            size="small"
          />
        </HStack>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack spacing="s">
            <Box
              glass={selectedMetricType !== null}
              glassVariant="medium"
              backgroundColor={selectedMetricType === null ? "primary" : undefined}
              px="m"
              py="s"
              borderRadius="l"
              pressable
              onPress={() => handleFilterByType(null)}
            >
              <Text variant="bodySmall" color={selectedMetricType === null ? "backgroundTertiary" : "textSecondary"}>
                All Metrics
              </Text>
            </Box>

            {metricTypes.map((type) => (
              <Box
                key={type}
                glass={selectedMetricType !== type}
                glassVariant="medium"
                backgroundColor={selectedMetricType === type ? "primary" : undefined}
                px="m"
                py="s"
                borderRadius="l"
                pressable
                onPress={() => handleFilterByType(type)}
              >
                <Text variant="bodySmall" color={selectedMetricType === type ? "backgroundTertiary" : "textSecondary"}>
                  {getMetricName(type)}
                </Text>
              </Box>
            ))}
          </HStack>
        </ScrollView>

        {/* Quick Stats */}
        <HStack spacing="m">
          <Box flex1 glass glassVariant="light" p="m" borderRadius="m" center>
            <VStack spacing="xs" centerHorizontal>
              <Heart size={20} color={theme.colors.error} />
              <Text variant="display" color="error" fontSize={20}>
                72
              </Text>
              <Text variant="caption" color="textSecondary">
                Heart Rate
              </Text>
            </VStack>
          </Box>

          <Box flex1 glass glassVariant="light" p="m" borderRadius="m" center>
            <VStack spacing="xs" centerHorizontal>
              <Activity size={20} color={theme.colors.primary} />
              <Text variant="display" color="primary" fontSize={20}>
                120/80
              </Text>
              <Text variant="caption" color="textSecondary">
                Blood Pressure
              </Text>
            </VStack>
          </Box>

          <Box flex1 glass glassVariant="light" p="m" borderRadius="m" center>
            <VStack spacing="xs" centerHorizontal>
              <Weight size={20} color={theme.colors.success} />
              <Text variant="display" color="success" fontSize={20}>
                165
              </Text>
              <Text variant="caption" color="textSecondary">
                Weight
              </Text>
            </VStack>
          </Box>
        </HStack>

        {/* Weekly Trend */}
        <Box glass glassVariant="medium" p="m" borderRadius="m">
          <VStack spacing="s">
            <Text variant="subheader" color="textPrimary">
              Weekly Trend
            </Text>
            <Box height={120} backgroundColor="backgroundSecondary" borderRadius="m" p="s">
              {/* Placeholder for chart */}
              <HStack spacing="none" height="100%" alignItems="flex-end">
                <Box flex1 backgroundColor="primary" height="60%" borderRadius="s" mx="xxs" />
                <Box flex1 backgroundColor="primary" height="70%" borderRadius="s" mx="xxs" />
                <Box flex1 backgroundColor="primary" height="65%" borderRadius="s" mx="xxs" />
                <Box flex1 backgroundColor="primary" height="80%" borderRadius="s" mx="xxs" />
                <Box flex1 backgroundColor="primary" height="75%" borderRadius="s" mx="xxs" />
                <Box flex1 backgroundColor="warning" height="85%" borderRadius="s" mx="xxs" />
                <Box flex1 backgroundColor="error" height="90%" borderRadius="s" mx="xxs" />
              </HStack>
              <HStack spacing="none" mt="xxs" justifyContent="space-between">
                <Text variant="caption" color="textTertiary" fontSize={10}>
                  Mon
                </Text>
                <Text variant="caption" color="textTertiary" fontSize={10}>
                  Tue
                </Text>
                <Text variant="caption" color="textTertiary" fontSize={10}>
                  Wed
                </Text>
                <Text variant="caption" color="textTertiary" fontSize={10}>
                  Thu
                </Text>
                <Text variant="caption" color="textTertiary" fontSize={10}>
                  Fri
                </Text>
                <Text variant="caption" color="textTertiary" fontSize={10}>
                  Sat
                </Text>
                <Text variant="caption" color="textTertiary" fontSize={10}>
                  Sun
                </Text>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    )
  }, [
    getMetricIcon,
    handleAddMetric,
    handleFilterByType,
    metricTypes,
    selectedMetricType,
    theme.colors.error,
    theme.colors.primary,
    theme.colors.success,
  ])

  return (
    <Box flex1 backgroundColor="backgroundPrimary">
      <GlassHeader
        title="Health Metrics"
        leftIcon={<ArrowLeft size={24} color={theme.colors.textPrimary} />}
        onLeftPress={() => showInfo("Navigation", "Going back")}
      />

      <GlassFlatList
        data={filteredMetrics}
        renderItem={renderMetric}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={<GlassRefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        emptyText="No health metrics found"
      />
    </Box>
  )
})

HealthMetricsScreen.displayName = "HealthMetricsScreen"
