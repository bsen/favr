import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Text,
  Surface,
  ActivityIndicator,
  IconButton,
  TextInput,
  Button,
} from "react-native-paper";
import tw from "twrnc";
import { usePost } from "./contexts/PostContext";
import { theme, commonStyles } from "../theme";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "./contexts/AuthContext";

export default function MessagesPage() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const { userData } = useAuth();
  const { postThreads, loading, error, fetchThreadMessages, createMessage } =
    usePost();
  const [refreshing, setRefreshing] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [canSendMessage, setCanSendMessage] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const thread = threadId
    ? postThreads.find((t) => t[0]?.threadId === threadId)
    : null;
  const firstMessage = thread ? thread[0] : null;
  const postId = firstMessage?.postId;

  useEffect(() => {
    if (threadId) {
      fetchThreadMessages(threadId);
    }
  }, [threadId]);

  useEffect(() => {
    if (thread && thread.length > 0 && userData) {
      const isPostOwner = thread[0].receiverId === userData.id;
      const hasPostOwnerReplied = thread.some(
        (m) =>
          m.senderId === thread[0].receiverId &&
          m.receiverId === thread[0].senderId
      );

      setCanSendMessage(isPostOwner || hasPostOwnerReplied);
    }
  }, [thread, userData]);

  useEffect(() => {
    if (thread && thread.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [thread]);

  const handleRefresh = async () => {
    if (!threadId) return;
    setRefreshing(true);
    await fetchThreadMessages(threadId);
    setRefreshing(false);
  };

  const handleSendMessage = async () => {
    if (!threadId || !messageText || !postId || !userData) return;

    setSending(true);

    const otherUserId =
      thread?.find((m) => m.senderId !== userData.id)?.senderId ||
      thread?.find((m) => m.receiverId !== userData.id)?.receiverId;

    if (!otherUserId) {
      setSending(false);
      return;
    }

    const success = await createMessage({
      postId: postId,
      text: messageText,
      threadId: threadId,
      senderId: userData.id,
      receiverId: otherUserId,
    });

    if (success) {
      setMessageText("");
      fetchThreadMessages(threadId);
    }

    setSending(false);
  };

  if (!threadId) {
    return (
      <View
        style={tw`flex-1 bg-[${theme.dark.background.primary}] justify-center items-center`}
      >
        <Text style={tw`text-[${theme.dark.text.primary}]`}>
          No conversation selected
        </Text>
      </View>
    );
  }

  if (loading && !refreshing && !thread) {
    return (
      <View
        style={tw`flex-1 bg-[${theme.dark.background.primary}] justify-center items-center`}
      >
        <ActivityIndicator size="large" color={theme.dark.brand.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1 bg-[${theme.dark.background.primary}]`}
    >
      <View style={tw`flex-1`}>
        <View
          style={tw`pt-14 px-4 flex-row items-center border-b border-[${theme.dark.background.border}]`}
        >
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={theme.dark.text.primary}
            onPress={() => router.back()}
          />
          <Text style={tw`text-xl font-bold text-[${theme.dark.text.primary}]`}>
            {firstMessage?.sender?.fullName || "Conversation"}
          </Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-36 pt-2 px-4`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.dark.brand.primary}
            />
          }
        >
          {error && (
            <Text style={tw`text-[${theme.dark.brand.danger}] mx-5 mb-4`}>
              {error}
            </Text>
          )}

          {/* First message special display */}
          {firstMessage && (
            <Surface
              style={tw.style(`mb-6 rounded-2xl overflow-hidden`, {
                backgroundColor: theme.dark.background.glass.background,
                borderWidth: 1,
                borderColor: theme.dark.background.glass.border,
                ...commonStyles.glass,
              })}
            >
              <View style={tw`p-4`}>
                <Text
                  style={tw`text-[${theme.dark.text.primary}] font-semibold mb-1`}
                >
                  {firstMessage.text}
                </Text>
                {firstMessage.price && (
                  <Text
                    style={tw`font-semibold text-[${theme.dark.brand.primary}]`}
                  >
                    Offered: ${firstMessage.price}
                  </Text>
                )}
                <Text
                  style={tw`text-xs text-[${theme.dark.text.secondary}] mt-2`}
                >
                  {new Date(firstMessage.createdAt).toLocaleString()}
                </Text>
              </View>
            </Surface>
          )}

          {/* Rest of the messages */}
          {thread &&
            thread.slice(1).map((message, index) => {
              const isCurrentUser = userData?.id === message.senderId;

              return (
                <View
                  key={message.id}
                  style={tw`mb-4 ${
                    isCurrentUser
                      ? "self-end items-end"
                      : "self-start items-start"
                  } max-w-[80%]`}
                >
                  <Surface
                    style={tw.style(`rounded-2xl overflow-hidden`, {
                      backgroundColor: isCurrentUser
                        ? `${theme.dark.brand.primary}20`
                        : theme.dark.background.glass.background,
                      borderWidth: 1,
                      borderColor: theme.dark.background.glass.border,
                      ...commonStyles.glass,
                    })}
                  >
                    <View style={tw`p-3`}>
                      <Text style={tw`text-[${theme.dark.text.primary}]`}>
                        {message.text}
                      </Text>
                      <Text
                        style={tw`text-xs text-[${theme.dark.text.secondary}] mt-1`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                  </Surface>
                </View>
              );
            })}

          {!canSendMessage && !loading && (
            <Surface
              style={tw.style(`my-4 rounded-2xl overflow-hidden`, {
                backgroundColor: `${theme.dark.status.warning}15`,
                borderWidth: 1,
                borderColor: `${theme.dark.status.warning}30`,
              })}
            >
              <View style={tw`p-4`}>
                <Text style={tw`text-[${theme.dark.text.primary}] text-center`}>
                  Waiting for post owner to reply before you can send more
                  messages
                </Text>
              </View>
            </Surface>
          )}
        </ScrollView>

        <Surface
          style={tw.style(`absolute bottom-0 left-0 right-0 px-4 py-3`, {
            backgroundColor: theme.dark.background.glass.background,
            borderTopWidth: 1,
            borderTopColor: theme.dark.background.glass.border,
            ...commonStyles.glass,
          })}
        >
          <View style={tw`flex-row items-center`}>
            <TextInput
              placeholder="Type a message..."
              value={messageText}
              onChangeText={setMessageText}
              style={tw`bg-transparent flex-1 mr-2 rounded-full`}
              mode="outlined"
              disabled={sending || !canSendMessage}
            />
            <IconButton
              icon="send"
              size={24}
              iconColor={theme.dark.brand.primary}
              onPress={handleSendMessage}
              disabled={!messageText || sending || !canSendMessage}
            />
          </View>
        </Surface>
      </View>
    </KeyboardAvoidingView>
  );
}
