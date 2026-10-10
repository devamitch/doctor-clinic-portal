"use client";

import { ArrowLeft, CreditCard } from "lucide-react-native";
import { useState, useCallback, memo } from "react";
import { ScrollView } from "react-native";

import { useToastContext } from "@/components/providers/ToastProvider";
import { Avatar } from "@/components/ui/atoms/Avatar";
import { Badge } from "@/components/ui/atoms/Badge";
import { GlassTextInput } from "@/components/ui/base/GlassTextInput";
import {
  PrimaryButton,
  SecondaryButton,
  IconButton,
} from "@/components/ui/buttons/ButtonVariants";
import { Box, Text, HStack, VStack } from "@/components/ui/core";
import { TimeSlotPicker } from "@/components/ui/molecules/TimeSlotPicker";
import { mockDoctors, timeSlots } from "@/data/mockData";
import { useThemeStore } from "@/stores/themeStore";

export const AppointmentBookingScreen = memo(() => {
  const { theme } = useThemeStore();
  const { showSuccess, showInfo } = useToastContext();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<"video" | "in-person">(
    "video"
  );
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");

  const doctor = mockDoctors[0]; // Using first doctor as example

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleTimeSlotSelect = useCallback((slotId: string) => {
    setSelectedTimeSlot(slotId);
  }, []);

  const handleAppointmentTypeChange = useCallback(
    (type: "video" | "in-person") => {
      setAppointmentType(type);
    },
    []
  );

  const handleBookAppointment = useCallback(() => {
    if (!selectedTimeSlot) {
      showInfo("Booking", "Please select a time slot");
      return;
    }

    showSuccess(
      "Booking Confirmed",
      "Your appointment has been scheduled successfully!"
    );
  }, [selectedTimeSlot, showSuccess, showInfo]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getConsultationFee = () => {
    return appointmentType === "video"
      ? doctor.consultationFee
      : (doctor.consultationFee || 0) + 50;
  };

  // Generate calendar dates (simplified)
  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const calendarDates = generateCalendarDates();

  return (
    <Box flex1 backgroundColor="backgroundPrimary">
      {/* Header */}
      <Box glass glassVariant="strong" pt="xl" pb="m" px="l">
        <HStack justify="between" centerVertical>
          <IconButton
            leftIcon={<ArrowLeft size={24} color={theme.colors.textPrimary} />}
            onPress={() => showInfo("Navigation", "Going back")}
            variant="ghost"
          />
          <Text variant="title" color="textPrimary">
            Book Appointment
          </Text>
          <Box width={40} /> {/* Spacer */}
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack spacing="l" p="l">
          {/* Doctor Info */}
          <Box glass glassVariant="medium" p="l" borderRadius="l">
            <HStack spacing="m" centerVertical>
              <Avatar
                source={doctor.image}
                name={doctor.name}
                size="lg"
                verified={doctor.isVerified}
              />
              <VStack flex1 spacing="xs">
                <Text variant="title" color="textPrimary">
                  {doctor.name}
                </Text>
                <Text variant="body" color="textSecondary">
                  {doctor.specialty}
                </Text>
                <Badge variant="success" size="sm">
                  Available Today
                </Badge>
              </VStack>
            </HStack>
          </Box>

          {/* Appointment Type */}
          <VStack spacing="m">
            <Text variant="title" color="textPrimary">
              Consultation Type
            </Text>

            <HStack spacing="m">
              <Box
                flex1
                glass={appointmentType !== "video"}
                glassVariant={appointmentType === "video" ? "strong" : "light"}
                backgroundColor={
                  appointmentType === "video" ? "primary" : undefined
                }
                p="l"
                borderRadius="l"
                pressable
                onPress={() => handleAppointmentTypeChange("video")}
              >
                <VStack spacing="s" centerHorizontal>
                  <Text
                    variant="subheader"
                    color={
                      appointmentType === "video"
                        ? "backgroundTertiary"
                        : "textPrimary"
                    }
                    fontSize={16}
                  >
                    Video Call
                  </Text>
                  <Text
                    variant="body"
                    color={
                      appointmentType === "video"
                        ? "backgroundTertiary"
                        : "textSecondary"
                    }
                    center
                  >
                    ${doctor.consultationFee}
                  </Text>
                </VStack>
              </Box>

              <Box
                flex1
                glass={appointmentType !== "in-person"}
                glassVariant={
                  appointmentType === "in-person" ? "strong" : "light"
                }
                backgroundColor={
                  appointmentType === "in-person" ? "primary" : undefined
                }
                p="l"
                borderRadius="l"
                pressable
                onPress={() => handleAppointmentTypeChange("in-person")}
              >
                <VStack spacing="s" centerHorizontal>
                  <Text
                    variant="subheader"
                    color={
                      appointmentType === "in-person"
                        ? "backgroundTertiary"
                        : "textPrimary"
                    }
                    fontSize={16}
                  >
                    In-Person
                  </Text>
                  <Text
                    variant="body"
                    color={
                      appointmentType === "in-person"
                        ? "backgroundTertiary"
                        : "textSecondary"
                    }
                    center
                  >
                    ${(doctor.consultationFee || 0) + 50}
                  </Text>
                </VStack>
              </Box>
            </HStack>
          </VStack>

          {/* Date Selection */}
          <VStack spacing="m">
            <Text variant="title" color="textPrimary">
              Select Date
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack spacing="s">
                {calendarDates.map((date, index) => {
                  const isSelected =
                    date.toDateString() === selectedDate.toDateString();
                  const isToday =
                    date.toDateString() === new Date().toDateString();

                  return (
                    <Box
                      key={index}
                      glass={!isSelected}
                      glassVariant={isSelected ? "strong" : "light"}
                      backgroundColor={isSelected ? "primary" : undefined}
                      p="m"
                      borderRadius="l"
                      center
                      pressable
                      onPress={() => handleDateSelect(date)}
                      minWidth={70}
                    >
                      <VStack spacing="xs" centerHorizontal>
                        <Text
                          variant="caption"
                          color={
                            isSelected ? "backgroundTertiary" : "textSecondary"
                          }
                        >
                          {date.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </Text>
                        <Text
                          variant="subheader"
                          color={
                            isSelected ? "backgroundTertiary" : "textPrimary"
                          }
                          fontSize={18}
                        >
                          {date.getDate()}
                        </Text>
                        {isToday && !isSelected && (
                          <Box
                            width={4}
                            height={4}
                            borderRadius={2}
                            backgroundColor="primary"
                          />
                        )}
                      </VStack>
                    </Box>
                  );
                })}
              </HStack>
            </ScrollView>

            <Text variant="body" color="textSecondary" center>
              {formatDate(selectedDate)}
            </Text>
          </VStack>

          {/* Time Slot Selection */}
          <TimeSlotPicker
            timeSlots={timeSlots}
            selectedSlot={selectedTimeSlot}
            onSlotSelect={handleTimeSlotSelect}
            title="Choose Time"
          />

          {/* Symptoms & Notes */}
          <VStack spacing="m">
            <Text variant="title" color="textPrimary">
              Additional Information
            </Text>

            <GlassTextInput
              label="Symptoms (Optional)"
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder="Describe your symptoms..."
              multiline
              numberOfLines={3}
              variant="glass"
            />

            <GlassTextInput
              label="Notes for Doctor (Optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional notes..."
              multiline
              numberOfLines={2}
              variant="glass"
            />
          </VStack>

          {/* Booking Summary */}
          <Box glass glassVariant="medium" p="l" borderRadius="l">
            <VStack spacing="m">
              <Text variant="title" color="textPrimary">
                Booking Summary
              </Text>

              <VStack spacing="s">
                <HStack justify="between" centerVertical>
                  <Text variant="body" color="textSecondary">
                    Doctor
                  </Text>
                  <Text variant="body" color="textPrimary">
                    {doctor.name}
                  </Text>
                </HStack>

                <HStack justify="between" centerVertical>
                  <Text variant="body" color="textSecondary">
                    Date
                  </Text>
                  <Text variant="body" color="textPrimary">
                    {selectedDate.toLocaleDateString()}
                  </Text>
                </HStack>

                <HStack justify="between" centerVertical>
                  <Text variant="body" color="textSecondary">
                    Time
                  </Text>
                  <Text variant="body" color="textPrimary">
                    {selectedTimeSlot
                      ? timeSlots.find((slot) => slot.id === selectedTimeSlot)
                          ?.time
                      : "Not selected"}
                  </Text>
                </HStack>

                <HStack justify="between" centerVertical>
                  <Text variant="body" color="textSecondary">
                    Type
                  </Text>
                  <Text variant="body" color="textPrimary">
                    {appointmentType === "video"
                      ? "Video Consultation"
                      : "In-Person Visit"}
                  </Text>
                </HStack>

                <Box height={1} backgroundColor="border" my="s" />

                <HStack justify="between" centerVertical>
                  <Text variant="subheader" color="textPrimary">
                    Total Fee
                  </Text>
                  <Text variant="subheader" color="primary">
                    ${getConsultationFee()}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Bottom spacing */}
          <Box height={100} />
        </VStack>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <Box
        glass
        glassVariant="strong"
        p="l"
        borderTopWidth={1}
        borderTopColor="border"
      >
        <HStack spacing="m">
          <Box flex1>
            <SecondaryButton
              text="Save as Draft"
              onPress={() => showInfo("Draft", "Appointment saved as draft")}
            />
          </Box>
          <Box flex1>
            <PrimaryButton
              text="Book Now"
              leftIcon={<CreditCard size={18} color="#FFFFFF" />}
              onPress={handleBookAppointment}
              disabled={!selectedTimeSlot}
            />
          </Box>
        </HStack>
      </Box>
    </Box>
  );
});

AppointmentBookingScreen.displayName = "AppointmentBookingScreen";
