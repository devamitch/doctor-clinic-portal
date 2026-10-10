"use client"

import { useState, useCallback, memo } from "react"
import { ArrowLeft, Plus, Clock, Calendar, AlertCircle } from "lucide-react-native"
import { Box, Text, HStack, VStack } from "@/components/ui/core"
import { GlassFlatList } from "@/components/ui/lists/GlassFlatList"
import { GlassHeader } from "@/components/ui/navigation/GlassHeader"
import { GlassRefreshControl } from "@/components/ui/feedback/GlassRefreshControl"
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons/ButtonVariants"
import { useThemeStore } from "@/stores/themeStore"
import { useToastContext } from "@/components/providers/ToastProvider"

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  timeOfDay: string[]
  startDate: string
  endDate?: string
  instructions?: string
  refillDate?: string
  status: "active" | "completed" | "paused"
  takenToday: boolean
}

const mockMedications: Medication[] = [
  {
    id: "1",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    timeOfDay: ["Morning"],
    startDate: "2023-01-15",
    instructions: "Take with food",
    refillDate: "2023-06-15",
    status: "active",
    takenToday: true,
  },
  {
    id: "2",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    timeOfDay: ["Morning", "Evening"],
    startDate: "2023-02-10",
    instructions: "Take with meals",
    refillDate: "2023-06-10",
    status: "active",
    takenToday: false,
  },
  {
    id: "3",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    timeOfDay: ["Evening"],
    startDate: "2023-03-05",
    instructions: "Take at bedtime",
    refillDate: "2023-06-05",
    status: "active",
    takenToday: true,
  },
  {
    id: "4",
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    timeOfDay: ["Morning", "Afternoon", "Evening"],
    startDate: "2023-05-01",
    endDate: "2023-05-10",
    instructions: "Take until completed",
    status: "completed",
    takenToday: false,
  },
]

export const MedicationScreen = memo(() => {
  const { theme } = useThemeStore()
  const { showInfo, showSuccess } = useToastContext()

  const [medications, setMedications] = useState<Medication[]>(mockMedications)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "completed" | "paused">("all")

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      showSuccess("Refreshed", "Medication list updated")
    }, 1500)
  }, [showSuccess])

  const handleAddMedication = useCallback(() => {
    showInfo("Add Medication", "Opening medication form")
  }, [showInfo])

  const handleMedicationPress = useCallback(
    (medication: Medication) => {
      showInfo("Medication Details", `Viewing ${medication.name} details`)
    },
    [showInfo],
  )

  const handleMarkAsTaken = useCallback(
    (id: string) => {
      setMedications((prev) => prev.map((med) => (med.id === id ? { ...med, takenToday: !med.takenToday } : med)))
      const medication = medications.find((med) => med.id === id)
      if (medication) {
        showSuccess(
          medication.takenToday ? "Marked as not taken" : "Marked as taken",
          `${medication.name} ${medication.takenToday ? "removed from" : "added to"} today's log`,
        )
      }
    },
    [medications, showSuccess],
  )

  const handleFilterByStatus = useCallback((status: "all" | "active" | "completed" | "paused") => {
    setSelectedStatus(status)
  }, [])

  const filteredMedications =
    selectedStatus === "all" ? medications : medications.filter((med) => med.status === selectedStatus)

  const activeMedications = medications.filter((med) => med.status === "active")
  const takenCount = activeMedications.filter((med) => med.takenToday).length
  const totalActive = activeMedications.length

  const renderMedication = useCallback(
    ({ item: medication }: { item: Medication }) => (
      <Box glass glassVariant="medium" p="m" borderRadius="m" mb="m">
        <VStack spacing="s">
          <HStack spacing="m" centerVertical>
            <Box
              width={50}
              height={50}
              borderRadius={25}
              backgroundColor={
                medication.status === "active" ? (medication.takenToday ? "success" : "primary") : "textTertiary"
              }
              center
              glass
              glassVariant="light"
            >
              <Text variant="title" color="backgroundTertiary" fontSize={18}>
                {medication.name.charAt(0).toUpperCase()}
              </Text>
            </Box>

            <VStack spacing="xxs" flex1>
              <Text variant="subheader" color="textPrimary">
                {medication.name}
              </Text>
              <Text variant="caption" color="textSecondary">
                {medication.dosage} • {medication.frequency}
              </Text>
            </VStack>

            {medication.status === "active" && (
              <SecondaryButton
                text={medication.takenToday ? "Taken" : "Take"}
                size="small"
                variant={medication.takenToday ? "success" : "primary"}
                onPress={() => handleMarkAsTaken(medication.id)}
              />
            )}
          </HStack>

          <Box
            pressable
            onPress={() => handleMedicationPress(medication)}
            backgroundColor="backgroundSecondary"
            p="s"
            borderRadius="m"
          >
            <VStack spacing="xs">
              <HStack spacing="s" centerVertical>
                <Clock size={16} color={theme.colors.textSecondary} />
                <Text variant="bodySmall" color="textSecondary">
                  {medication.timeOfDay.join(", ")}
                </Text>
              </HStack>

              {medication.instructions && (
                <HStack spacing="s" centerVertical>
                  <AlertCircle size={16} color={theme.colors.textSecondary} />
                  <Text variant="bodySmall" color="textSecondary">
                    {medication.instructions}
                  </Text>
                </HStack>
              )}

              <HStack spacing="s" centerVertical>
                <Calendar size={16} color={theme.colors.textSecondary} />
                <Text variant="bodySmall" color="textSecondary">
                  Started: {medication.startDate.split("-").reverse().join("/")}
                  {medication.endDate ? ` • Ends: ${medication.endDate.split("-").reverse().join("/")}` : ""}
                </Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Box>
    ),
    [handleMarkAsTaken, handleMedicationPress, theme.colors.textSecondary],
  )

  const renderHeader = useCallback(() => {
    return (
      <VStack spacing="m" mb="m">
        <HStack justify="between" centerVertical>
          <Text variant="title" color="textPrimary">
            Medications
          </Text>
          <PrimaryButton
            text="Add New"
            leftIcon={<Plus size={18} color="#FFFFFF" />}
            onPress={handleAddMedication}
            size="small"
          />
        </HStack>

        {/* Status Filter */}
        <HStack spacing="s">
          <Box
            glass={selectedStatus !== "all"}
            glassVariant="medium"
            backgroundColor={selectedStatus === "all" ? "primary" : undefined}
            px="m"
            py="s"
            borderRadius="l"
            pressable
            onPress={() => handleFilterByStatus("all")}
          >
            <Text variant="bodySmall" color={selectedStatus === "all" ? "backgroundTertiary" : "textSecondary"}>
              All
            </Text>
          </Box>

          <Box
            glass={selectedStatus !== "active"}
            glassVariant="medium"
            backgroundColor={selectedStatus === "active" ? "primary" : undefined}
            px="m"
            py="s"
            borderRadius="l"
            pressable
            onPress={() => handleFilterByStatus("active")}
          >
            <Text variant="bodySmall" color={selectedStatus === "active" ? "backgroundTertiary" : "textSecondary"}>
              Active
            </Text>
          </Box>

          <Box
            glass={selectedStatus !== "completed"}
            glassVariant="medium"
            backgroundColor={selectedStatus === "completed" ? "primary" : undefined}
            px="m"
            py="s"
            borderRadius="l"
            pressable
            onPress={() => handleFilterByStatus("completed")}
          >
            <Text variant="bodySmall" color={selectedStatus === "completed" ? "backgroundTertiary" : "textSecondary"}>
              Completed
            </Text>
          </Box>
        </HStack>

        {/* Today's Progress */}
        <Box glass glassVariant="medium" p="m" borderRadius="m">
          <VStack spacing="s">
            <Text variant="subheader" color="textPrimary">
              Today's Progress
            </Text>
            <HStack spacing="m" centerVertical>
              <Box flex1>
                <Text variant="display" color="primary" fontSize={24}>
                  {takenCount}/{totalActive}
                </Text>
                <Text variant="caption" color="textSecondary">
                  Medications taken
                </Text>
              </Box>
              <Box height={8} flex1 backgroundColor="backgroundSecondary" borderRadius="full" overflow="hidden">
                <Box
                  height="100%"
                  width={`${totalActive > 0 ? (takenCount / totalActive) * 100 : 0}%`}
                  backgroundColor="success"
                />
              </Box>
            </HStack>
          </VStack>
        </Box>

        {/* Next Medication */}
        {activeMedications.some((med) => !med.takenToday) && (
          <Box glass glassVariant="strong" p="m" borderRadius="m" backgroundColor="primary" opacity={0.9}>
            <VStack spacing="s">
              <Text variant="subheader" color="backgroundTertiary">
                Next Medication
              </Text>
              <HStack spacing="m" centerVertical>
                <Box width={40} height={40} borderRadius={20} backgroundColor="backgroundTertiary" center>
                  <Clock size={20} color={theme.colors.primary} />
                </Box>
                <VStack spacing="xxs" flex1>
                  <Text variant="body" color="backgroundTertiary" fontWeight="600">
                    {activeMedications.find((med) => !med.takenToday)?.name || ""}
                  </Text>
                  <Text variant="caption" color="backgroundTertiary">
                    {activeMedications.find((med) => !med.takenToday)?.dosage || ""} •{" "}
                    {activeMedications.find((med) => !med.takenToday)?.timeOfDay[0] || ""}
                  </Text>
                </VStack>
                <SecondaryButton
                  text="Take Now"
                  size="small"
                  variant="secondary"
                  onPress={() => {
                    const nextMed = activeMedications.find((med) => !med.takenToday)
                    if (nextMed) {
                      handleMarkAsTaken(nextMed.id)
                    }
                  }}
                />
              </HStack>
            </VStack>
          </Box>
        )}
      </VStack>
    )
  }, [
    activeMedications,
    handleAddMedication,
    handleFilterByStatus,
    handleMarkAsTaken,
    selectedStatus,
    takenCount,
    theme.colors.primary,
    totalActive,
  ])

  return (
    <Box flex1 backgroundColor="backgroundPrimary">
      <GlassHeader
        title="Medications"
        leftIcon={<ArrowLeft size={24} color={theme.colors.textPrimary} />}
        onLeftPress={() => showInfo("Navigation", "Going back")}
      />

      <GlassFlatList
        data={filteredMedications}
        renderItem={renderMedication}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={<GlassRefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        emptyText="No medications found"
      />
    </Box>
  )
})

MedicationScreen.displayName = "MedicationScreen"
