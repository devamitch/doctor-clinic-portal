"use client";

import { ArrowLeft, Filter, Plus, Calendar } from "lucide-react-native";
import { useState, useCallback, memo, useMemo } from "react";

import { useToastContext } from "@/components/providers/ToastProvider";
import { IconButton } from "@/components/ui/buttons/ButtonVariants";
import { Box, Text, HStack, VStack } from "@/components/ui/core";
import { LoadingIndicator } from "@/components/ui/feedback/LoadingIndicator";
import { GlassSectionList } from "@/components/ui/lists";
import { EmptyState } from "@/components/ui/lists/EmptyState";
import { AppointmentCard } from "@/components/ui/molecules/AppointmentCard";
import { GlassHeader } from "@/components/ui/navigation/GlassHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { mockAppointments } from "@/data/mockData";
import { useThemeStore } from "@/stores/themeStore";

export const AppointmentsScreen = memo(() => {
  const { theme } = useThemeStore();
  const { showInfo } = useToastContext();

  const [selectedFilter, setSelectedFilter] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const filterOptions = ["All", "Upcoming", "Completed", "Cancelled"];

  const handleFilterChange = useCallback((index: number) => {
    setSelectedFilter(index);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showInfo("Refreshed", "Appointments updated");
    }, 1500);
  }, [showInfo]);

  const handleAppointmentPress = useCallback(
    (appointment: any) => {
      showInfo(
        "Appointment",
        `Opening appointment with ${appointment.doctor.name}`
      );
    },
    [showInfo]
  );

  const handleReschedule = useCallback(
    (appointment: any) => {
      showInfo(
        "Reschedule",
        `Rescheduling appointment with ${appointment.doctor.name}`
      );
    },
    [showInfo]
  );

  const handleMessage = useCallback(
    (appointment: any) => {
      showInfo("Message", `Messaging ${appointment.doctor.name}`);
    },
    [showInfo]
  );

  const handleCall = useCallback(
    (appointment: any) => {
      showInfo("Call", `Calling ${appointment.doctor.name}`);
    },
    [showInfo]
  );

  const handleVideo = useCallback(
    (appointment: any) => {
      showInfo(
        "Video Call",
        `Starting video call with ${appointment.doctor.name}`
      );
    },
    [showInfo]
  );

  const filteredAppointments = useMemo(() => {
    return mockAppointments.filter((appointment) => {
      switch (selectedFilter) {
        case 1: // Upcoming
          return appointment.status === "upcoming";
        case 2: // Completed
          return appointment.status === "completed";
        case 3: // Cancelled
          return appointment.status === "cancelled";
        default: // All
          return true;
      }
    });
  }, [selectedFilter]);

  // Group appointments by date
  const groupedAppointments = useMemo(() => {
    const groups: Record<string, typeof mockAppointments> = {};

    filteredAppointments.forEach((appointment) => {
      const date = new Date(appointment.date);
      const dateKey = date.toISOString().split("T")[0];

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(appointment);
    });

    // Convert to sections format
    return Object.entries(groups)
      .map(([dateKey, appointments]) => {
        const date = new Date(dateKey);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let title = date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });

        if (date.getTime() === today.getTime()) {
          title = "Today";
        } else if (date.getTime() === tomorrow.getTime()) {
          title = "Tomorrow";
        }

        return {
          title,
          data: appointments,
        };
      })
      .sort((a, b) => {
        // Sort sections by date
        const dateA = new Date(a.data[0].date);
        const dateB = new Date(b.data[0].date);
        return dateA.getTime() - dateB.getTime();
      });
  }, [filteredAppointments]);

  const getStatusCounts = useMemo(() => {
    return {
      all: mockAppointments.length,
      upcoming: mockAppointments.filter((a) => a.status === "upcoming").length,
      completed: mockAppointments.filter((a) => a.status === "completed")
        .length,
      cancelled: mockAppointments.filter((a) => a.status === "cancelled")
        .length,
    };
  }, []);

  const renderAppointment = useCallback(
    ({ item: appointment }: { item: any }) => (
      <Box px="m" mb="s">
        <AppointmentCard
          appointment={appointment}
          onPress={() => handleAppointmentPress(appointment)}
          onCall={() => handleCall(appointment)}
          onVideo={() => handleVideo(appointment)}
          onMessage={() => handleMessage(appointment)}
          onReschedule={() => handleReschedule(appointment)}
          variant="detailed"
        />
      </Box>
    ),
    [
      handleAppointmentPress,
      handleCall,
      handleVideo,
      handleMessage,
      handleReschedule,
    ]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string } }) => (
      <Box
        glass
        glassVariant="medium"
        mx="m"
        mb="s"
        px="m"
        py="s"
        borderRadius="m"
      >
        <Text variant="subheader" color="textPrimary">
          {section.title}
        </Text>
      </Box>
    ),
    []
  );

  const renderEmpty = useCallback(
    () => (
      <EmptyState
        icon={<Calendar size={48} color={theme.colors.textTertiary} />}
        title="No Appointments"
        message={
          selectedFilter === 1
            ? "You don't have any upcoming appointments"
            : selectedFilter === 2
            ? "No completed appointments found"
            : selectedFilter === 3
            ? "No cancelled appointments"
            : "You haven't booked any appointments yet"
        }
        actionLabel={
          selectedFilter === 1 || selectedFilter === 0
            ? "Book Appointment"
            : undefined
        }
        onAction={() => showInfo("Book", "Opening appointment booking")}
        variant="glass"
      />
    ),
    [selectedFilter, theme.colors.textTertiary, showInfo]
  );

  const renderHeader = useCallback(
    () => (
      <Box px="m" pb="m">
        {/* Quick Stats */}
        <HStack spacing="m" mb="l">
          <Box flex1 glass glassVariant="medium" p="m" borderRadius="m" center>
            <VStack spacing="xs" centerHorizontal>
              <Text variant="display" color="primary" fontSize={20}>
                {getStatusCounts.upcoming}
              </Text>
              <Text variant="caption" color="textSecondary">
                Upcoming
              </Text>
            </VStack>
          </Box>

          <Box flex1 glass glassVariant="medium" p="m" borderRadius="m" center>
            <VStack spacing="xs" centerHorizontal>
              <Text variant="display" color="success" fontSize={20}>
                {getStatusCounts.completed}
              </Text>
              <Text variant="caption" color="textSecondary">
                Completed
              </Text>
            </VStack>
          </Box>

          <Box flex1 glass glassVariant="medium" p="m" borderRadius="m" center>
            <VStack spacing="xs" centerHorizontal>
              <Text variant="display" color="textPrimary" fontSize={20}>
                {getStatusCounts.all}
              </Text>
              <Text variant="caption" color="textSecondary">
                Total
              </Text>
            </VStack>
          </Box>
        </HStack>
      </Box>
    ),
    [getStatusCounts]
  );

  if (loading) {
    return (
      <Box flex1 backgroundColor="backgroundPrimary">
        <GlassHeader
          title="My Appointments"
          leftIcon={<ArrowLeft size={24} color={theme.colors.textPrimary} />}
          onLeftPress={() => showInfo("Navigation", "Going back")}
        />
        <LoadingIndicator message="Loading appointments..." overlay />
      </Box>
    );
  }

  return (
    <Box flex1 backgroundColor="backgroundPrimary">
      {/* Header */}
      <GlassHeader
        title="My Appointments"
        leftIcon={<ArrowLeft size={24} color={theme.colors.textPrimary} />}
        rightIcon={<Filter size={24} color={theme.colors.textPrimary} />}
        onLeftPress={() => showInfo("Navigation", "Going back")}
        onRightPress={() => showInfo("Filter", "Opening filter options")}
      />

      {/* Filter Segments */}
      <Box px="l" py="m">
        <SegmentedControl
          options={filterOptions.map((option, index) => {
            const count = Object.values(getStatusCounts)[index];
            return `${option} (${count})`;
          })}
          selectedIndex={selectedFilter}
          onSelectionChange={handleFilterChange}
        />
      </Box>

      {/* Appointments List */}
      <GlassSectionList
        sections={groupedAppointments}
        renderItem={renderAppointment}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        spacing="none"
        showsVerticalScrollIndicator={false}
        contentInset={{ bottom: 100 }}
      />

      {/* Floating Action Button */}
      <Box position="absolute" bottom={100} right={20}>
        <IconButton
          leftIcon={<Plus size={24} color="#FFFFFF" />}
          onPress={() =>
            showInfo("New Appointment", "Quick appointment booking")
          }
          variant="fab"
          size="large"
        />
      </Box>
    </Box>
  );
});

AppointmentsScreen.displayName = "AppointmentsScreen";
