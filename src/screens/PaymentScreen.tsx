"use client"

import { useState, useCallback, memo } from "react"
import { ArrowLeft, CreditCard, Plus, Trash2 } from "lucide-react-native"
import { Box, Text, HStack, VStack } from "@/components/ui/core"
import { GlassHeader } from "@/components/ui/navigation/GlassHeader"
import { GlassFlatList } from "@/components/ui/lists"
import { ListItem } from "@/components/ui/lists/ListItem"
import { EmptyState } from "@/components/ui/lists/EmptyState"
import { PrimaryButton, IconButton } from "@/components/ui/buttons/ButtonVariants"
import { useThemeStore } from "@/stores/themeStore"
import { useToastContext } from "@/components/providers/ToastProvider"

interface PaymentMethod {
  id: string
  type: "visa" | "mastercard" | "amex" | "paypal"
  name: string
  number: string
  expiry: string
  isDefault: boolean
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "visa",
    name: "John Doe",
    number: "•••• •••• •••• 4242",
    expiry: "05/25",
    isDefault: true,
  },
  {
    id: "2",
    type: "mastercard",
    name: "John Doe",
    number: "•••• •••• •••• 5555",
    expiry: "08/24",
    isDefault: false,
  },
  {
    id: "3",
    type: "paypal",
    name: "john.doe@example.com",
    number: "PayPal Account",
    expiry: "",
    isDefault: false,
  },
]

interface Transaction {
  id: string
  title: string
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
  paymentMethod: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    title: "Appointment with Dr. Smith",
    amount: 150,
    date: "May 15, 2023",
    status: "completed",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "2",
    title: "Medication Purchase",
    amount: 45.99,
    date: "May 10, 2023",
    status: "completed",
    paymentMethod: "Mastercard •••• 5555",
  },
  {
    id: "3",
    title: "Lab Test Payment",
    amount: 75.5,
    date: "May 5, 2023",
    status: "completed",
    paymentMethod: "PayPal",
  },
  {
    id: "4",
    title: "Appointment with Dr. Johnson",
    amount: 120,
    date: "April 28, 2023",
    status: "completed",
    paymentMethod: "Visa •••• 4242",
  },
]

export const PaymentScreen = memo(() => {
  const { theme } = useThemeStore()
  const { showInfo, showSuccess } = useToastContext()

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"methods" | "history">("methods")

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      showSuccess("Refreshed", "Payment information updated")
    }, 1500)
  }, [showSuccess])

  const handleAddPaymentMethod = useCallback(() => {
    showInfo("Add Payment", "Opening payment method form")
  }, [showInfo])

  const handleDeletePaymentMethod = useCallback(
    (id: string) => {
      setPaymentMethods((prev) => prev.filter((method) => method.id !== id))
      showSuccess("Deleted", "Payment method removed")
    },
    [showSuccess],
  )

  const handleSetDefaultPaymentMethod = useCallback(
    (id: string) => {
      setPaymentMethods((prev) =>
        prev.map((method) => ({
          ...method,
          isDefault: method.id === id,
        })),
      )
      showSuccess("Updated", "Default payment method changed")
    },
    [showSuccess],
  )

  const handleTransactionPress = useCallback(
    (transaction: Transaction) => {
      showInfo("Transaction", `Viewing details for ${transaction.title}`)
    },
    [showInfo],
  )

  const renderPaymentMethod = useCallback(
    ({ item: method }: { item: PaymentMethod }) => (
      <Box glass glassVariant="medium" p="m" borderRadius="m" mb="m">
        <HStack justify="between" centerVertical>
          <HStack spacing="m" centerVertical>
            <Box
              width={40}
              height={40}
              borderRadius={8}
              backgroundColor={
                method.type === "visa"
                  ? "#1A1F71"
                  : method.type === "mastercard"
                    ? "#EB001B"
                    : method.type === "amex"
                      ? "#2E77BB"
                      : "#003087"
              }
              center
            >
              <Text variant="title" color="backgroundTertiary">
                {method.type === "visa" ? "V" : method.type === "mastercard" ? "M" : method.type === "amex" ? "A" : "P"}
              </Text>
            </Box>

            <VStack spacing="xxs">
              <Text variant="subheader" color="textPrimary">
                {method.number}
              </Text>
              <Text variant="caption" color="textSecondary">
                {method.type === "paypal" ? "" : `Expires ${method.expiry}`}
              </Text>
            </VStack>
          </HStack>

          <HStack spacing="s">
            {!method.isDefault && (
              <IconButton
                leftIcon={<Trash2 size={18} color={theme.colors.error} />}
                onPress={() => handleDeletePaymentMethod(method.id)}
                variant="ghost"
                size="small"
              />
            )}
          </HStack>
        </HStack>

        <HStack justify="between" centerVertical mt="s">
          <Text variant="caption" color="textSecondary">
            {method.name}
          </Text>

          {method.isDefault ? (
            <Box px="s" py="xxs" borderRadius="s" backgroundColor="success">
              <Text variant="caption" color="backgroundTertiary">
                Default
              </Text>
            </Box>
          ) : (
            <Text
              variant="button"
              color="primary"
              fontSize={12}
              pressable
              onPress={() => handleSetDefaultPaymentMethod(method.id)}
            >
              Set as Default
            </Text>
          )}
        </HStack>
      </Box>
    ),
    [theme, handleDeletePaymentMethod, handleSetDefaultPaymentMethod],
  )

  const renderTransaction = useCallback(
    ({ item: transaction }: { item: Transaction }) => (
      <ListItem
        title={transaction.title}
        subtitle={`${transaction.paymentMethod} • ${transaction.date}`}
        description={`$${transaction.amount.toFixed(2)}`}
        descriptionColor={
          transaction.status === "completed" ? "success" : transaction.status === "pending" ? "warning" : "error"
        }
        leftIcon={<CreditCard size={20} color={theme.colors.textSecondary} />}
        onPress={() => handleTransactionPress(transaction)}
        variant="minimal"
      />
    ),
    [theme, handleTransactionPress],
  )

  const renderHeader = useCallback(() => {
    return (
      <VStack spacing="m" mb="m">
        <HStack justify="between" centerVertical>
          <Text variant="title" color="textPrimary">
            Payment Methods
          </Text>
          <PrimaryButton
            text="Add New"
            leftIcon={<Plus size={18} color="#FFFFFF" />}
            onPress={handleAddPaymentMethod}
            size="small"
          />
        </HStack>

        <HStack spacing="m">
          <Box
            flex1
            glass={activeTab !== "methods"}
            glassVariant="medium"
            backgroundColor={activeTab === "methods" ? "primary" : undefined}
            p="m"
            borderRadius="m"
            center
            pressable
            onPress={() => setActiveTab("methods")}
          >
            <Text variant="body" color={activeTab === "methods" ? "backgroundTertiary" : "textPrimary"}>
              Payment Methods
            </Text>
          </Box>

          <Box
            flex1
            glass={activeTab !== "history"}
            glassVariant="medium"
            backgroundColor={activeTab === "history" ? "primary" : undefined}
            p="m"
            borderRadius="m"
            center
            pressable
            onPress={() => setActiveTab("history")}
          >
            <Text variant="body" color={activeTab === "history" ? "backgroundTertiary" : "textPrimary"}>
              Payment History
            </Text>
          </Box>
        </HStack>
      </VStack>
    )
  }, [activeTab, handleAddPaymentMethod])

  return (
    <Box flex1 backgroundColor="backgroundPrimary">
      {/* Header */}
      <GlassHeader
        title="Payments"
        leftIcon={<ArrowLeft size={24} color={theme.colors.textPrimary} />}
        onLeftPress={() => showInfo("Navigation", "Going back")}
      />

      {/* Content */}
      <Box p="l">
        <GlassFlatList
          data={activeTab === "methods" ? paymentMethods : transactions}
          renderItem={activeTab === "methods" ? renderPaymentMethod : renderTransaction}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState
              icon={<CreditCard size={48} color={theme.colors.textTertiary} />}
              title={activeTab === "methods" ? "No Payment Methods" : "No Transactions"}
              message={
                activeTab === "methods"
                  ? "You haven't added any payment methods yet"
                  : "You don't have any payment history"
              }
              actionLabel={activeTab === "methods" ? "Add Payment Method" : undefined}
              onAction={activeTab === "methods" ? handleAddPaymentMethod : undefined}
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

PaymentScreen.displayName = "PaymentScreen"
