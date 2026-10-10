"use client"

import { useState, useCallback, memo } from "react"
import { ArrowLeft, FileText, FilePlus, Download, Share2 } from "lucide-react-native"
import { Box, Text, HStack, VStack, ScrollView } from "@/components/ui/core"
import { GlassHeader } from "@/components/ui/navigation/GlassHeader"
import { GlassFlatList } from "@/components/ui/lists"
import { EmptyState } from "@/components/ui/lists/EmptyState"
import { IconButton, PrimaryButton } from "@/components/ui/buttons/ButtonVariants"
import { useThemeStore } from "@/stores/themeStore"
import { useToastContext } from "@/components/providers/ToastProvider"

interface MedicalRecord {
  id: string
  title: string
  type: string
  date: string
  doctor: string
  fileSize: string
  fileType: "pdf" | "image" | "doc"
}

const mockRecords: MedicalRecord[] = [
  {
    id: "1",
    title: "Blood Test Results",
    type: "Laboratory",
    date: "May 15, 2023",
    doctor: "Dr. James Smith",
    fileSize: "2.4 MB",
    fileType: "pdf",
  },
  {
    id: "2",
    title: "X-Ray Report",
    type: "Radiology",
    date: "April 3, 2023",
    doctor: "Dr. Sarah Johnson",
    fileSize: "5.1 MB",
    fileType: "image",
  },
  {
    id: "3",
    title: "Annual Physical Examination",
    type: "General",
    date: "March 12, 2023",
    doctor: "Dr. Michael Brown",
    fileSize: "1.8 MB",
    fileType: "pdf",
  },
  {
    id: "4",
    title: "Vaccination Record",
    type: "Immunization",
    date: "February 5, 2023",
    doctor: "Dr. Emily Davis",
    fileSize: "0.9 MB",
    fileType: "doc",
  },
  {
    id: "5",
    title: "Allergy Test Results",
    type: "Allergy",
    date: "January 20, 2023",
    doctor: "Dr. Robert Wilson",
    fileSize: "1.2 MB",
    fileType: "pdf",
  },
]

export const MedicalRecordsScreen = memo(() => {
  const { theme } = useThemeStore()
  const { showInfo, showSuccess } = useToastContext()

  const [records, setRecords] = useState<MedicalRecord[]>(mockRecords)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedRecordType, setSelectedRecordType] = useState<string | null>(null)

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      showSuccess("Refreshed", "Medical records updated")
    }, 1500)
  }, [showSuccess])

  const handleRecordPress = useCallback(
    (record: MedicalRecord) => {
      showInfo("Record", `Opening ${record.title}`)
    },
    [showInfo],
  )

  const handleDownload = useCallback(
    (record: MedicalRecord) => {
      showInfo("Download", `Downloading ${record.title}`)
    },
    [showInfo],
  )

  const handleShare = useCallback(
    (record: MedicalRecord) => {
      showInfo("Share", `Sharing ${record.title}`)
    },
    [showInfo],
  )

  const handleAddRecord = useCallback(() => {
    showInfo("Add Record", "Opening record upload")
  }, [showInfo])

  const handleFilterByType = useCallback((type: string | null) => {
    setSelectedRecordType(type)
  }, [])

  const filteredRecords = selectedRecordType ? records.filter((record) => record.type === selectedRecordType) : records

  const recordTypes = Array.from(new Set(records.map((record) => record.type)))

  const renderRecord = useCallback(
    ({ item: record }: { item: MedicalRecord }) => (
      <Box glass glassVariant="medium" p="m" borderRadius="m" mb="m">
        <VStack spacing="s">
          <HStack justify="between" centerVertical>
            <HStack spacing="s" centerVertical>
              <FileText size={20} color={theme.colors.primary} />
              <Text variant="subheader" color="textPrimary">
                {record.title}
              </Text>
            </HStack>
            <Text variant="caption" color="textTertiary">
              {record.fileSize}
            </Text>
          </HStack>

          <HStack justify="between" centerVertical>
            <VStack spacing="xxs">
              <Text variant="caption" color="textSecondary">
                {record.type} • {record.date}
              </Text>
              <Text variant="caption" color="textTertiary">
                {record.doctor}
              </Text>
            </VStack>

            <HStack spacing="s">
              <IconButton
                leftIcon={<Download size={18} color={theme.colors.textSecondary} />}
                onPress={() => handleDownload(record)}
                variant="ghost"
                size="small"
              />
              <IconButton
                leftIcon={<Share2 size={18} color={theme.colors.textSecondary} />}
                onPress={() => handleShare(record)}
                variant="ghost"
                size="small"
              />
            </HStack>
          </HStack>
        </VStack>
      </Box>
    ),
    [theme, handleDownload, handleShare],
  )

  const renderHeader = useCallback(() => {
    return (
      <VStack spacing="m" mb="m">
        <HStack justify="between" centerVertical>
          <Text variant="title" color="textPrimary">
            Medical Records
          </Text>
          <PrimaryButton
            text="Add New"
            leftIcon={<FilePlus size={18} color="#FFFFFF" />}
            onPress={handleAddRecord}
            size="small"
          />
        </HStack>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack spacing="s">
            <Box
              glass={selectedRecordType !== null}
              glassVariant="medium"
              backgroundColor={selectedRecordType === null ? "primary" : undefined}
              px="m"
              py="s"
              borderRadius="l"
              pressable
              onPress={() => handleFilterByType(null)}
            >
              <Text variant="bodySmall" color={selectedRecordType === null ? "backgroundTertiary" : "textSecondary"}>
                All Records
              </Text>
            </Box>

            {recordTypes.map((type) => (
              <Box
                key={type}
                glass={selectedRecordType !== type}
                glassVariant="medium"
                backgroundColor={selectedRecordType === type ? "primary" : undefined}
                px="m"
                py="s"
                borderRadius="l"
                pressable
                onPress={() => handleFilterByType(type)}
              >
                <Text variant="bodySmall" color={selectedRecordType === type ? "backgroundTertiary" : "textSecondary"}>
                  {type}
                </Text>
              </Box>
            ))}
          </HStack>
        </ScrollView>
      </VStack>
    )
  }, [selectedRecordType, handleAddRecord, handleFilterByType, recordTypes])

  return (
    <Box flex1 backgroundColor="backgroundPrimary">
      {/* Header */}
      <GlassHeader
        title="Medical Records"
        leftIcon={<ArrowLeft size={24} color={theme.colors.textPrimary} />}
        onLeftPress={() => showInfo("Navigation", "Going back")}
      />

      {/* Records List */}
      <Box p="l">
        <GlassFlatList
          data={filteredRecords}
          renderItem={renderRecord}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState
              icon={<FileText size={48} color={theme.colors.textTertiary} />}
              title="No Records Found"
              message={
                selectedRecordType
                  ? `No ${selectedRecordType} records available`
                  : "You don't have any medical records yet"
              }
              actionLabel="Add Record"
              onAction={handleAddRecord}
              variant="glass"
            />
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
          spacing="none"
          showsVerticalScrollIndicator={false}
        />
      </Box>
    </Box>
  )
})

MedicalRecordsScreen.displayName = "MedicalRecordsScreen"
