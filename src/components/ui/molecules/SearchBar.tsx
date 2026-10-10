"use client"
import { memo } from "react"
import { Search, Filter, X } from "lucide-react-native"
import { Box, HStack } from "@/components/ui/core"
import { GlassTextInput } from "@/components/ui/base/GlassTextInput"
import { IconButton } from "@/components/ui/buttons/ButtonVariants"
import { useThemeStore } from "@/stores/themeStore"

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  onFilter?: () => void
  onClear?: () => void
  showFilter?: boolean
}

export const SearchBar = memo(
  ({ value, onChangeText, placeholder = "Search...", onFilter, onClear, showFilter = true }: SearchBarProps) => {
    const { theme } = useThemeStore()

    return (
      <HStack spacing="m" centerVertical>
        <Box flex1>
          <GlassTextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            leftIcon={<Search size={20} color={theme.colors.textSecondary} />}
            rightIcon={
              value ? (
                <IconButton
                  leftIcon={<X size={16} color={theme.colors.textSecondary} />}
                  onPress={onClear}
                  size="small"
                  variant="ghost"
                />
              ) : undefined
            }
            variant="search"
            clearable={false}
          />
        </Box>

        {showFilter && onFilter && (
          <IconButton
            leftIcon={<Filter size={20} color={theme.colors.textPrimary} />}
            onPress={onFilter}
            variant="glass"
          />
        )}
      </HStack>
    )
  },
)

SearchBar.displayName = "SearchBar"
