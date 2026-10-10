"use client";

import { ArrowLeft, Send, Paperclip, Phone, Video } from "lucide-react-native";
import { useState, useCallback, memo, useRef } from "react";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";

import { useToastContext } from "@/components/providers/ToastProvider";
import { Avatar } from "@/components/ui/atoms/Avatar";
import { IconButton } from "@/components/ui/buttons/ButtonVariants";
import { Box, Text, HStack } from "@/components/ui/core";
import { GlassInput } from "@/components/ui/core/GlassInput";
import { GlassHeader } from "@/components/ui/navigation/GlassHeader";
import { useThemeStore } from "@/stores/themeStore";

type Message = {
  id: string;
  text: string;
  sender: "user" | "doctor";
  timestamp: Date;
  type?: "text" | "image" | "file";
};

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hello! How can I help you today?",
    sender: "doctor",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    text: "Hi Dr. Smith, I've been experiencing some headaches lately.",
    sender: "user",
    timestamp: new Date(Date.now() - 3500000),
  },
  {
    id: "3",
    text: "I'm sorry to hear that. Can you tell me more about when these headaches occur?",
    sender: "doctor",
    timestamp: new Date(Date.now() - 3400000),
  },
  {
    id: "4",
    text: "They usually happen in the afternoon, around 3-4 PM.",
    sender: "user",
    timestamp: new Date(Date.now() - 3300000),
  },
];

export const ChatScreen = memo(() => {
  const { theme } = useThemeStore();
  const { showInfo } = useToastContext();

  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = useCallback(() => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");

      // Simulate doctor response
      setTimeout(() => {
        const doctorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thank you for the information. I'll review this and get back to you shortly.",
          sender: "doctor",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, doctorResponse]);
      }, 2000);
    }
  }, [inputText]);

  const renderMessage = useCallback(({ item: message }: { item: Message }) => {
    const isUser = message.sender === "user";

    return (
      <Box px="m" mb="s">
        <HStack spacing="s" justify={isUser ? "flex-end" : "flex-start"}>
          {!isUser && (
            <Avatar
              size="small"
              name="Dr. Smith"
              source={{ uri: "/placeholder.svg?height=32&width=32&text=DS" }}
            />
          )}

          <Box
            maxWidth="75%"
            glass={!isUser}
            glassVariant={!isUser ? "medium" : undefined}
            backgroundColor={isUser ? "primary" : undefined}
            p="m"
            borderRadius="l"
            style={{
              borderBottomRightRadius: isUser ? 4 : undefined,
              borderBottomLeftRadius: !isUser ? 4 : undefined,
            }}
          >
            <Text
              variant="body"
              color={isUser ? "backgroundTertiary" : "textPrimary"}
            >
              {message.text}
            </Text>
            <Text
              variant="caption"
              color={isUser ? "backgroundSecondary" : "textTertiary"}
              mt="xs"
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Box>

          {isUser && (
            <Avatar
              size="small"
              name="You"
              source={{ uri: "/placeholder.svg?height=32&width=32&text=U" }}
            />
          )}
        </HStack>
      </Box>
    );
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Box flex1 backgroundColor="backgroundPrimary">
        {/* Header */}
        <GlassHeader
          title="Dr. James Smith"
          subtitle="Online"
          leftIcon={<ArrowLeft size={24} color={theme.colors.textPrimary} />}
          rightContent={
            <HStack spacing="s">
              <IconButton
                leftIcon={<Phone size={20} color={theme.colors.textPrimary} />}
                onPress={() => showInfo("Call", "Starting voice call")}
                variant="ghost"
                size="small"
              />
              <IconButton
                leftIcon={<Video size={20} color={theme.colors.textPrimary} />}
                onPress={() => showInfo("Video", "Starting video call")}
                variant="ghost"
                size="small"
              />
            </HStack>
          }
          onLeftPress={() => showInfo("Navigation", "Going back")}
        />

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        {/* Input */}
        <Box glass glassVariant="strong" p="m">
          <HStack spacing="s" centerVertical>
            <IconButton
              leftIcon={
                <Paperclip size={20} color={theme.colors.textSecondary} />
              }
              onPress={() => showInfo("Attachment", "Opening file picker")}
              variant="ghost"
              size="small"
            />

            <Box flex1>
              <GlassInput
                placeholder="Type a message..."
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                style={{ maxHeight: 100 }}
              />
            </Box>

            <IconButton
              leftIcon={<Send size={20} color={theme.colors.primary} />}
              onPress={handleSendMessage}
              variant="ghost"
              size="small"
              disabled={!inputText.trim()}
            />
          </HStack>
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
});

ChatScreen.displayName = "ChatScreen";
