"use client";

import type { FlatList } from "react-native";

import { ArrowLeft, Filter, Search, X } from "lucide-react-native";
import { useState, useCallback, memo, useRef } from "react";

import { useToastContext } from "@/components/providers/ToastProvider";
import { Box, Text, HStack, VStack } from "@/components/ui/core";
import { GlassFlatList } from "@/components/ui/lists";
import { EmptyState } from "@/components/ui/lists/EmptyState";
import { DoctorCard } from "@/components/ui/molecules/DoctorCard";
import { SearchBar } from "@/components/ui/molecules/SearchBar";
import { GlassHeader } from "@/components/ui/navigation/GlassHeader";
import { mockDoctors } from "@/data/mockData";
import { useThemeStore } from "@/stores/themeStore";

export const DoctorListScreen = memo(() => {
  const { theme } = useThemeStore();
  const { showInfo } = useToastContext();
  const listRef = useRef<FlatList>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const specialties = Array.from(
    new Set(mockDoctors.map((doctor) => doctor.specialty))
  );

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleDoctorPress = useCallback(
    (doctor: any) => {
      showInfo("Doctor Profile", `Opening ${doctor.name}'s profile`);
    },
    [showInfo]
  );

  const handleFavorite = useCallback((doctorId: string) => {
    setFavorites((prev) =>
      prev.includes(doctorId)
        ? prev.filter((id) => id !== doctorId)
        : [...prev, doctorId]
    );
  }, []);

  const toggleSpecialty = useCallback((specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedSpecialties([]);
  }, []);

  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty =
      selectedSpecialties.length === 0 ||
      selectedSpecialties.includes(doctor.specialty);

    return matchesSearch && matchesSpecialty;
  });

  const renderFilterChips = () => {
    if (selectedSpecialties.length === 0) return null;

    return (
      <Box mb="m">
        <HStack spacing="s" wrap>
          {selectedSpecialties.map((specialty) => (
            <Box
              key={specialty}
              glass
              glassVariant="light"
              px="m"
              py="xs"
              borderRadius="full"
              mb="xs"
              pressable
              onPress={() => toggleSpecialty(specialty)}
            >
              <HStack spacing="s" centerVertical>
                <Text variant="caption" color="primary">
                  {specialty}
                </Text>
                <X size={14} color={theme.colors.primary} />
              </HStack>
            </Box>
          ))}
          {selectedSpecialties.length > 0 && (
            <Box
              px="m"
              py="xs"
              borderRadius="full"
              borderWidth={1}
              borderColor="border"
              mb="xs"
              pressable
              onPress={clearFilters}
            >
              <Text variant="caption" color="textSecondary">
                Clear All
              </Text>
            </Box>
          )}
        </HStack>
      </Box>
    );
  };

  const renderSpecialtyFilters = () => (
    <Box mb="m">
      <Text variant="subheader" color="textPrimary" mb="s">
        Specialties
      </Text>
      <HStack spacing="s" wrap>
        {specialties.map((specialty) => (
          <Box
            key={specialty}
            glass={selectedSpecialties.includes(specialty)}
            glassVariant="medium"
            backgroundColor={
              selectedSpecialties.includes(specialty)
                ? undefined
                : "backgroundSecondary"
            }
            px="m"
            py="s"
            borderRadius="l"
            mb="xs"
            pressable
            onPress={() => toggleSpecialty(specialty)}
          >
            <Text
              variant="bodySmall"
              color={
                selectedSpecialties.includes(specialty)
                  ? "primary"
                  : "textSecondary"
              }
            >
              {specialty}
            </Text>
          </Box>
        ))}
      </HStack>
    </Box>
  );

  return (
    <Box flex1 backgroundColor="backgroundPrimary">
      {/* Header */}
      <GlassHeader
        title="Find a Doctor"
        leftIcon={<ArrowLeft size={24} color={theme.colors.textPrimary} />}
        rightIcon={<Filter size={24} color={theme.colors.textPrimary} />}
        onLeftPress={() => showInfo("Navigation", "Going back")}
        onRightPress={() => showInfo("Filter", "Opening filter options")}
      />

      {/* Search Bar */}
      <Box px="l" py="m">
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search doctors, specialties..."
          onFilter={() => showInfo("Filter", "Opening filter options")}
        />
      </Box>

      {/* Doctor List */}
      <GlassFlatList
        ref={listRef}
        data={filteredDoctors}
        spacing="l"
        itemSpacing="m"
        refreshing={refreshing}
        onRefresh={handleRefresh}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <VStack spacing="m">
            {renderSpecialtyFilters()}
            {renderFilterChips()}
            <HStack justify="between" centerVertical mb="s">
              <Text variant="title" color="textPrimary">
                {filteredDoctors.length}{" "}
                {filteredDoctors.length === 1 ? "Doctor" : "Doctors"}
              </Text>
              <Text
                variant="button"
                color="primary"
                fontSize={14}
                pressable
                onPress={() => listRef.current?.scrollToOffset({ offset: 0 })}
              >
                Sort
              </Text>
            </HStack>
          </VStack>
        }
        ListEmptyComponent={
          <EmptyState
            variant="glass"
            title="No Doctors Found"
            message={
              selectedSpecialties.length > 0
                ? "Try changing your specialty filters"
                : "We couldn't find any doctors matching your search"
            }
            icon={<Search color={theme.colors.textSecondary} />}
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        }
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            onPress={() => handleDoctorPress(item)}
            onFavorite={() => handleFavorite(item.id)}
            isFavorite={favorites.includes(item.id)}
          />
        )}
      />
    </Box>
  );
});

DoctorListScreen.displayName = "DoctorListScreen";
