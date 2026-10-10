"use client";

import {
  ArrowLeft,
  Heart,
  Share,
  Star,
  MapPin,
  Clock,
  Phone,
  Video,
  MessageCircle,
  Calendar,
} from "lucide-react-native";
import { useState, useCallback, memo } from "react";
import { ScrollView } from "react-native";

import { useToastContext } from "@/components/providers/ToastProvider";
import { Avatar } from "@/components/ui/atoms/Avatar";
import { Badge } from "@/components/ui/atoms/Badge";
import { StatusIndicator } from "@/components/ui/atoms/StatusIndicator";
import {
  PrimaryButton,
  SecondaryButton,
  IconButton,
} from "@/components/ui/buttons/ButtonVariants";
import { Box, Text, HStack, VStack } from "@/components/ui/core";
import { mockDoctors } from "@/data/mockData";
import { useThemeStore } from "@/stores/themeStore";

export const DoctorProfileScreen = memo(() => {
  const { theme } = useThemeStore();
  const { showSuccess, showInfo } = useToastContext();

  const [isFavorite, setIsFavorite] = useState(false);
  const doctor = mockDoctors[0]; // Using first doctor as example

  const handleFavorite = useCallback(() => {
    setIsFavorite(!isFavorite);
    showSuccess(
      "Favorites",
      isFavorite ? "Removed from favorites" : "Added to favorites"
    );
  }, [isFavorite, showSuccess]);

  const handleBookAppointment = useCallback(() => {
    showInfo("Booking", "Redirecting to appointment booking");
  }, [showInfo]);

  const handleCall = useCallback(() => {
    showInfo("Call", `Calling ${doctor.name}`);
  }, [showInfo, doctor.name]);

  const handleVideo = useCallback(() => {
    showInfo("Video Call", `Starting video call with ${doctor.name}`);
  }, [showInfo, doctor.name]);

  const handleMessage = useCallback(() => {
    showInfo("Message", `Opening chat with ${doctor.name}`);
  }, [showInfo, doctor.name]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        color={
          index < Math.floor(rating)
            ? theme.colors.starFilled
            : theme.colors.starEmpty
        }
        fill={
          index < Math.floor(rating) ? theme.colors.starFilled : "transparent"
        }
      />
    ));
  };

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
            Doctor Profile
          </Text>

          <HStack spacing="s">
            <IconButton
              leftIcon={<Share size={20} color={theme.colors.textPrimary} />}
              onPress={() => showInfo("Share", "Sharing doctor profile")}
              variant="ghost"
              size="small"
            />
            <IconButton
              leftIcon={
                <Heart
                  size={20}
                  color={
                    isFavorite ? theme.colors.error : theme.colors.textPrimary
                  }
                />
              }
              onPress={handleFavorite}
              variant="ghost"
              size="small"
            />
          </HStack>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack spacing="l" p="l">
          {/* Doctor Info Card */}
          <Box
            glass
            glassVariant="strong"
            p="xl"
            borderRadius="xl"
            shadow="medium"
          >
            <VStack spacing="l" centerHorizontal>
              <Avatar
                source={doctor.image}
                name={doctor.name}
                size="xl"
                verified={doctor.isVerified}
              />

              <VStack spacing="s" centerHorizontal>
                <Text variant="header" color="textPrimary" center>
                  {doctor.name}
                </Text>
                <Text variant="body" color="textSecondary" center>
                  {doctor.specialty}
                </Text>

                <HStack spacing="m" centerVertical>
                  <HStack spacing="xs" centerVertical>
                    <Clock size={16} color={theme.colors.textSecondary} />
                    <Text variant="bodySmall" color="textSecondary">
                      {doctor.experience}
                    </Text>
                  </HStack>
                  <HStack spacing="xs" centerVertical>
                    {renderStars(doctor.rating)}
                    <Text variant="bodySmall" color="textSecondary">
                      {doctor.rating} ({doctor.reviewCount})
                    </Text>
                  </HStack>
                </HStack>

                {doctor.location && (
                  <HStack spacing="xs" centerVertical>
                    <MapPin size={16} color={theme.colors.textSecondary} />
                    <Text variant="bodySmall" color="textSecondary" center>
                      {doctor.location}
                    </Text>
                  </HStack>
                )}

                <StatusIndicator
                  status={doctor.isOnline ? "online" : "offline"}
                  showText
                />
              </VStack>

              <HStack spacing="m" justify="center">
                <Badge variant="primary">Verified</Badge>
                <Badge variant={doctor.isOnline ? "success" : "secondary"}>
                  {doctor.isOnline ? "Available" : "Offline"}
                </Badge>
              </HStack>
            </VStack>
          </Box>

          {/* Quick Actions */}
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
              leftIcon={<Phone size={20} color={theme.colors.success} />}
              onPress={handleCall}
              variant="glass"
            />
            <IconButton
              leftIcon={<Video size={20} color={theme.colors.primary} />}
              onPress={handleVideo}
              variant="glass"
            />
            <IconButton
              leftIcon={<MessageCircle size={20} color={theme.colors.info} />}
              onPress={handleMessage}
              variant="glass"
            />
          </HStack>

          {/* About */}
          <Box glass glassVariant="medium" p="l" borderRadius="l">
            <VStack spacing="m">
              <Text variant="title" color="textPrimary">
                About
              </Text>
              <Text variant="body" color="textSecondary" lineHeight={24}>
                {doctor.about}
              </Text>
            </VStack>
          </Box>

          {/* Consultation Fee */}
          <Box glass glassVariant="medium" p="l" borderRadius="l">
            <VStack spacing="m">
              <Text variant="title" color="textPrimary">
                Consultation Fee
              </Text>
              <HStack justify="between" centerVertical>
                <Text variant="body" color="textSecondary">
                  Video Consultation
                </Text>
                <Text variant="subheader" color="primary">
                  ${doctor.consultationFee}
                </Text>
              </HStack>
              <HStack justify="between" centerVertical>
                <Text variant="body" color="textSecondary">
                  In-person Visit
                </Text>
                <Text variant="subheader" color="primary">
                  ${(doctor.consultationFee || 0) + 50}
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* Education & Experience */}
          <Box glass glassVariant="medium" p="l" borderRadius="l">
            <VStack spacing="m">
              <Text variant="title" color="textPrimary">
                Education & Experience
              </Text>

              {doctor.education?.map((edu, index) => (
                <HStack key={index} spacing="m" centerVertical>
                  <Box
                    width={8}
                    height={8}
                    borderRadius={4}
                    backgroundColor="primary"
                  />
                  <Text variant="body" color="textSecondary" flex1>
                    {edu}
                  </Text>
                </HStack>
              ))}

              <Box mt="m">
                <Text variant="subheader" color="textPrimary" mb="s">
                  Awards & Recognition
                </Text>
                {doctor.awards?.map((award, index) => (
                  <HStack key={index} spacing="m" centerVertical mb="s">
                    <Box
                      width={8}
                      height={8}
                      borderRadius={4}
                      backgroundColor="success"
                    />
                    <Text variant="body" color="textSecondary" flex1>
                      {award}
                    </Text>
                  </HStack>
                ))}
              </Box>
            </VStack>
          </Box>

          {/* Languages */}
          <Box glass glassVariant="medium" p="l" borderRadius="l">
            <VStack spacing="m">
              <Text variant="title" color="textPrimary">
                Languages
              </Text>
              <HStack spacing="s" wrap>
                {doctor.languages?.map((language) => (
                  <Badge key={language} variant="secondary" size="sm">
                    {language}
                  </Badge>
                ))}
              </HStack>
            </VStack>
          </Box>

          {/* Reviews */}
          <Box glass glassVariant="medium" p="l" borderRadius="l">
            <VStack spacing="m">
              <HStack justify="between" centerVertical>
                <Text variant="title" color="textPrimary">
                  Reviews
                </Text>
                <Text variant="button" color="primary" fontSize={14}>
                  See All
                </Text>
              </HStack>

              <HStack spacing="m" centerVertical>
                <Text variant="display" color="primary" fontSize={48}>
                  {doctor.rating}
                </Text>
                <VStack spacing="xs">
                  <HStack spacing="xs">{renderStars(doctor.rating)}</HStack>
                  <Text variant="caption" color="textSecondary">
                    Based on {doctor.reviewCount} reviews
                  </Text>
                </VStack>
              </HStack>

              {/* Sample Reviews */}
              <VStack spacing="m">
                {[
                  {
                    name: "Sarah Johnson",
                    rating: 5,
                    comment: "Excellent doctor! Very professional and caring.",
                    date: "2 days ago",
                  },
                  {
                    name: "Mike Chen",
                    rating: 5,
                    comment: "Great experience. Highly recommend!",
                    date: "1 week ago",
                  },
                ].map((review, index) => (
                  <Box
                    key={index}
                    glass
                    glassVariant="light"
                    p="m"
                    borderRadius="l"
                  >
                    <VStack spacing="s">
                      <HStack justify="between" centerVertical>
                        <Text
                          variant="subheader"
                          color="textPrimary"
                          fontSize={16}
                        >
                          {review.name}
                        </Text>
                        <Text variant="caption" color="textTertiary">
                          {review.date}
                        </Text>
                      </HStack>
                      <HStack spacing="xs">{renderStars(review.rating)}</HStack>
                      <Text variant="body" color="textSecondary">
                        {review.comment}
                      </Text>
                    </VStack>
                  </Box>
                ))}
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
            <PrimaryButton
              text="Book Appointment"
              onPress={handleBookAppointment}
              fullWidth
            />
          </Box>
          <SecondaryButton
            text="Message"
            leftIcon={<MessageCircle size={18} color={theme.colors.primary} />}
            onPress={handleMessage}
          />
        </HStack>
      </Box>
    </Box>
  );
});

DoctorProfileScreen.displayName = "DoctorProfileScreen";
