"use client";

import { Calendar, Menu, Bell, Plus } from "lucide-react-native";
import { useState, useCallback, memo } from "react";
import { ScrollView } from "react-native";

import { useToastContext } from "@/components/providers/ToastProvider";
import { Avatar } from "@/components/ui/atoms/Avatar";
import { Badge } from "@/components/ui/atoms/Badge";
import {
  PrimaryButton,
  IconButton,
} from "@/components/ui/buttons/ButtonVariants";
import { Box, Text, HStack, VStack } from "@/components/ui/core";
import { AppointmentCard } from "@/components/ui/molecules/AppointmentCard";
import { DoctorCard } from "@/components/ui/molecules/DoctorCard";
import { SearchBar } from "@/components/ui/molecules/SearchBar";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { mockDoctors, mockAppointments, mockUser } from "@/data/mockData";
import { useThemeStore } from "@/stores/themeStore";

export const HomeScreen = memo(() => {
  const { theme } = useThemeStore();
  const { showSuccess, showInfo } = useToastContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleSegmentChange = useCallback((index: number) => {
    setSelectedSegment(index);
  }, []);

  const handleDoctorPress = useCallback(
    (doctor: any) => {
      showInfo("Doctor Profile", `Opening ${doctor.name}'s profile`);
    },
    [showInfo]
  );

  const handleAppointmentPress = useCallback(
    (appointment: any) => {
      showInfo(
        "Appointment",
        `Opening appointment with ${appointment.doctor.name}`
      );
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

  const handleBookAppointment = useCallback(() => {
    showSuccess("Booking", "Redirecting to appointment booking");
  }, [showSuccess]);

  const filteredDoctors = mockDoctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingAppointments = mockAppointments.filter(
    (apt) => apt.status === "upcoming"
  );

  return (
    <Box flex1 backgroundColor="backgroundPrimary">
      {/* Header */}
      <Box glass glassVariant="strong" pt="xl" pb="m" px="l">
        <HStack justify="between" centerVertical mb="m">
          <IconButton
            leftIcon={<Menu size={24} color={theme.colors.textPrimary} />}
            onPress={() => showInfo("Menu", "Opening navigation menu")}
            variant="ghost"
          />

          <VStack centerHorizontal>
            <Text variant="caption" color="textSecondary">
              Good Morning
            </Text>
            <Text variant="title" color="textPrimary">
              {mockUser.name}
            </Text>
          </VStack>

          <HStack spacing="s">
            <IconButton
              leftIcon={<Bell size={20} color={theme.colors.textPrimary} />}
              onPress={() => showInfo("Notifications", "Opening notifications")}
              variant="ghost"
              size="small"
            />
            <Avatar source={mockUser.avatar} name={mockUser.name} size="sm" />
          </HStack>
        </HStack>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search doctors, specialties..."
          onFilter={() => showInfo("Filter", "Opening filter options")}
        />
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack spacing="l" p="l">
          {/* Segments */}
          <SegmentedControl
            options={["eClinic", "ePharmacy", "eReferral"]}
            selectedIndex={selectedSegment}
            onSelectionChange={handleSegmentChange}
          />

          {/* Quick Actions */}
          <Box glass glassVariant="medium" p="l" borderRadius="xl">
            <VStack spacing="m">
              <Text variant="title" color="textPrimary">
                Quick Actions
              </Text>

              <HStack spacing="m">
                <Box flex1>
                  <PrimaryButton
                    text="Book Appointment"
                    leftIcon={<Calendar size={18} color="#FFFFFF" />}
                    onPress={handleBookAppointment}
                    fullWidth
                  />
                </Box>
                <IconButton
                  leftIcon={<Plus size={20} color={theme.colors.primary} />}
                  onPress={() => showInfo("Emergency", "Emergency booking")}
                  variant="glass"
                />
              </HStack>
            </VStack>
          </Box>

          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <VStack spacing="m">
              <HStack justify="between" centerVertical>
                <Text variant="title" color="textPrimary">
                  Upcoming Appointments
                </Text>
                <Badge variant="primary" size="sm">
                  {upcomingAppointments.length}
                </Badge>
              </HStack>

              {upcomingAppointments.slice(0, 2).map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onPress={() => handleAppointmentPress(appointment)}
                  onMessage={() =>
                    showInfo("Message", `Messaging ${appointment.doctor.name}`)
                  }
                  onReschedule={() =>
                    showInfo("Reschedule", "Opening reschedule options")
                  }
                  variant="compact"
                />
              ))}
            </VStack>
          )}

          {/* Featured Doctors */}
          <VStack spacing="m">
            <HStack justify="between" centerVertical>
              <Text variant="title" color="textPrimary">
                {searchQuery ? "Search Results" : "Featured Doctors"}
              </Text>
              {!searchQuery && (
                <Text variant="button" color="primary" fontSize={14}>
                  See All
                </Text>
              )}
            </HStack>

            {filteredDoctors.length > 0 ? (
              filteredDoctors
                .slice(0, 3)
                .map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onPress={() => handleDoctorPress(doctor)}
                    onFavorite={() => handleFavorite(doctor.id)}
                    isFavorite={favorites.includes(doctor.id)}
                    variant="default"
                  />
                ))
            ) : (
              <Box glass glassVariant="light" p="xl" borderRadius="l" center>
                <Text variant="body" color="textSecondary" center>
                  No doctors found matching "{searchQuery}"
                </Text>
              </Box>
            )}
          </VStack>

          {/* Categories */}
          <VStack spacing="m">
            <Text variant="title" color="textPrimary">
              Specialties
            </Text>

            <HStack spacing="m" wrap>
              {["Cardiology", "Neurology", "Dermatology", "Pediatrics"].map(
                (specialty) => (
                  <Box
                    key={specialty}
                    glass
                    glassVariant="light"
                    px="l"
                    py="m"
                    borderRadius="l"
                    pressable
                    onPress={() =>
                      showInfo("Specialty", `Browsing ${specialty} doctors`)
                    }
                  >
                    <Text variant="button" color="textPrimary" fontSize={14}>
                      {specialty}
                    </Text>
                  </Box>
                )
              )}
            </HStack>
          </VStack>

          {/* Bottom spacing for navigation */}
          <Box height={100} />
        </VStack>
      </ScrollView>

      {/* Floating Action Button */}
      <Box position="absolute" bottom={100} right={20}>
        <IconButton
          leftIcon={<Plus size={24} color="#FFFFFF" />}
          onPress={() => showInfo("Quick Book", "Quick appointment booking")}
          variant="fab"
          size="large"
        />
      </Box>
    </Box>
  );
});

HomeScreen.displayName = "HomeScreen";
