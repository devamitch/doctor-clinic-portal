"use client"

import { useState, useCallback, memo } from "react"
import { StyleSheet, Dimensions } from "react-native"
import { ArrowLeft, FlashOff, Flash, RotateCcw } from "lucide-react-native"
import { Box, Text, VStack } from "@/components/ui/core"
import { GlassHeader } from "@/components/ui/navigation/GlassHeader"
import { IconButton } from "@/components/ui/buttons/ButtonVariants"
import { useThemeStore } from "@/stores/themeStore"
import { useToastContext } from "@/components/providers/ToastProvider"

const { width, height } = Dimensions.get("window")

export const QRScannerScreen = memo(() => {
  const { theme } = useThemeStore()
  const { showSuccess, showError } = useToastContext()

  const [flashEnabled, setFlashEnabled] = useState(false)
  const [scanning, setScanning] = useState(true)

  const handleFlashToggle = useCallback(() => {
    setFlashEnabled((prev) => !prev)
  }, [])

  const handleReset = useCallback(() => {
    setScanning(true)
  }, [])

  const handleQRCodeScanned = useCallback(
    (data: string) => {
      setScanning(false)

      // Simulate QR code processing
      setTimeout(() => {
        if (data.includes("appointment")) {
          showSuccess("Success", "Appointment check-in successful!")
        } else if (data.includes("doctor")) {
          showSuccess("Success", "Doctor profile loaded!")
        } else {
          showError("Error", "Invalid QR code")
        }
      }, 1000)
    },
    [showSuccess, showError],
  )

  const renderScannerOverlay = () => (
    <Box style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Top overlay */}
      <Box style={[styles.overlay, { height: (height - 250) / 2 }]} backgroundColor="backgroundOverlay" />

      {/* Middle section with scanner frame */}
      <Box style={styles.scannerRow}>
        <Box style={styles.sideOverlay} backgroundColor="backgroundOverlay" />

        {/* Scanner frame */}
        <Box style={styles.scannerFrame}>
          {/* Corner indicators */}
          <Box style={[styles.corner, styles.topLeft]} />
          <Box style={[styles.corner, styles.topRight]} />
          <Box style={[styles.corner, styles.bottomLeft]} />
          <Box style={[styles.corner, styles.bottomRight]} />

          {/* Scanning line animation would go here */}
          <Box style={styles.scanLine} backgroundColor="primary" />
        </Box>

        <Box style={styles.sideOverlay} backgroundColor="backgroundOverlay" />
      </Box>

      {/* Bottom overlay */}
      <Box style={[styles.overlay, { height: (height - 250) / 2 }]} backgroundColor="backgroundOverlay" />
    </Box>
  )

  return (
    <Box flex1 backgroundColor="backgroundPrimary">
      {/* Header */}
      <GlassHeader
        title="Scan QR Code"
        leftIcon={<ArrowLeft size={24} color={theme.colors.textPrimary} />}
        onLeftPress={() => {}}
        transparent
      />

      {/* Camera View Placeholder */}
      <Box flex1 backgroundColor="black" position="relative">
        {/* Mock camera view */}
        <Box flex1 backgroundColor="gray" center>
          <Text variant="body" color="white">
            Camera View
          </Text>
          <Text variant="caption" color="white" mt="s">
            Point camera at QR code
          </Text>
        </Box>

        {/* Scanner overlay */}
        {renderScannerOverlay()}

        {/* Instructions */}
        <Box position="absolute" bottom={150} left={0} right={0} px="xl">
          <Box glass glassVariant="strong" p="l" borderRadius="l" center>
            <VStack spacing="s" centerHorizontal>
              <Text variant="body" color="textPrimary" textAlign="center">
                {scanning ? "Position QR code within the frame" : "Processing..."}
              </Text>
              <Text variant="caption" color="textSecondary" textAlign="center">
                Make sure the code is clearly visible
              </Text>
            </VStack>
          </Box>
        </Box>

        {/* Controls */}
        <Box position="absolute" bottom={50} left={0} right={0}>
          <Box flexDirection="row" justifyContent="space-around" alignItems="center" px="xl">
            {/* Flash toggle */}
            <IconButton
              leftIcon={flashEnabled ? <Flash size={24} color="#FFFFFF" /> : <FlashOff size={24} color="#FFFFFF" />}
              onPress={handleFlashToggle}
              variant="ghost"
              size="large"
            />

            {/* Reset button */}
            <IconButton
              leftIcon={<RotateCcw size={24} color="#FFFFFF" />}
              onPress={handleReset}
              variant="ghost"
              size="large"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
})

QRScannerScreen.displayName = "QRScannerScreen"

const styles = StyleSheet.create({
  overlay: {
    width: "100%",
  },
  scannerRow: {
    flexDirection: "row",
    height: 250,
  },
  sideOverlay: {
    flex: 1,
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#007AFF",
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: "absolute",
    top: "50%",
    left: 10,
    right: 10,
    height: 2,
    opacity: 0.8,
  },
})
