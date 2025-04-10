import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
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

export default function PostDetail() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const {
    userPosts,
    postMessages,
    loading,
    error,
    fetchPostMessages,
    createMessage,
  } = usePost();
  const [refreshing, setRefreshing] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messagePrice, setMessagePrice] = useState("");
  const [sending, setSending] = useState(false);

  const post = userPosts.find((p) => p.id === Number(postId));

  useEffect(() => {
    if (postId) {
      fetchPostMessages(Number(postId));
    }
  }, [postId]);

  const handleRefresh = async () => {
    if (!postId) return;
    setRefreshing(true);
    await fetchPostMessages(Number(postId));
    setRefreshing(false);
  };

  const handleSendMessage = async () => {
    if (!postId || !messageText) return;

    setSending(true);
    const price = messagePrice ? Number(messagePrice) : undefined;

    const success = await createMessage({
      postId: Number(postId),
      text: messageText,
      price,
    });

    if (success) {
      setMessageText("");
      setMessagePrice("");
      fetchPostMessages(Number(postId));
    }

    setSending(false);
  };

  if (!postId) {
    return (
      <View
        style={tw`flex-1 bg-[${theme.dark.background.primary}] justify-center items-center`}
      >
        <Text style={tw`text-[${theme.dark.text.primary}]`}>
          Post not found
        </Text>
      </View>
    );
  }

  if (loading && !refreshing && !post) {
    return (
      <View
        style={tw`flex-1 bg-[${theme.dark.background.primary}] justify-center items-center`}
      >
        <ActivityIndicator size="large" color={theme.dark.brand.primary} />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-[${theme.dark.background.primary}]`}>
      <View style={tw`flex-1`}>
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-36 pt-16`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.dark.brand.primary}
            />
          }
        >
          <View style={tw`flex-row px-4 py-2 items-center`}>
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor={theme.dark.text.primary}
              onPress={() => router.back()}
            />
            <Text
              style={tw`text-xl font-bold text-[${theme.dark.text.primary}]`}
            >
              Post Details
            </Text>
          </View>

          {post && (
            <Surface
              style={tw.style(`mx-5 rounded-2xl overflow-hidden mb-4`, {
                backgroundColor: theme.dark.background.glass.background,
                borderWidth: 1,
                borderColor: theme.dark.background.glass.border,
                ...commonStyles.glass,
              })}
            >
              <View style={tw`p-4`}>
                <View style={tw`flex-row justify-between mb-2`}>
                  <View style={tw`flex-row items-center`}>
                    <View
                      style={tw.style(`px-2 py-0.5 rounded-full mr-2`, {
                        backgroundColor:
                          post.type === "offer"
                            ? `${theme.dark.status.success}20`
                            : `${theme.dark.status.warning}20`,
                      })}
                    >
                      <Text
                        style={tw.style(`text-xs font-medium capitalize`, {
                          color:
                            post.type === "offer"
                              ? theme.dark.status.success
                              : theme.dark.status.warning,
                        })}
                      >
                        {post.type}
                      </Text>
                    </View>
                    {post.category && (
                      <Text
                        style={tw`text-xs text-[${theme.dark.text.secondary}]`}
                      >
                        {post.category}
                      </Text>
                    )}
                  </View>
                  <Text style={tw`text-xs text-[${theme.dark.text.secondary}]`}>
                    {post.time}
                  </Text>
                </View>
                <Text
                  style={tw`text-[${theme.dark.text.primary}] text-lg font-semibold mb-1`}
                >
                  {post.title}
                </Text>
                <Text style={tw`text-[${theme.dark.text.secondary}] mb-2`}>
                  {post.description}
                </Text>
                <View style={tw`flex-row justify-between items-center`}>
                  {post.price ? (
                    <Text
                      style={tw`font-semibold text-[${theme.dark.brand.primary}]`}
                    >
                      ${post.price}
                    </Text>
                  ) : (
                    <Text style={tw`text-[${theme.dark.text.secondary}]`}>
                      Free
                    </Text>
                  )}
                </View>
              </View>
            </Surface>
          )}

          <Text
            style={tw`text-[${theme.dark.text.primary}] text-lg font-semibold mx-5 mb-4`}
          >
            Messages
          </Text>

          {error && (
            <Text style={tw`text-[${theme.dark.brand.danger}] mx-5 mb-4`}>
              {error}
            </Text>
          )}

          {postMessages.length === 0 ? (
            <Text style={tw`text-[${theme.dark.text.secondary}] mx-5 italic`}>
              No messages yet
            </Text>
          ) : (
            postMessages.map((message) => (
              <Surface
                key={message.id}
                style={tw.style(`mx-5 mb-4 rounded-2xl overflow-hidden`, {
                  backgroundColor: theme.dark.background.glass.background,
                  borderWidth: 1,
                  borderColor: theme.dark.background.glass.border,
                  ...commonStyles.glass,
                })}
              >
                <View style={tw`p-4`}>
                  <View style={tw`flex-row justify-between mb-2`}>
                    <Text
                      style={tw`font-semibold text-[${theme.dark.text.primary}]`}
                    >
                      {message.user.name}
                    </Text>
                    <View
                      style={tw.style(`px-2 py-0.5 rounded-full`, {
                        backgroundColor:
                          message.status === "accepted"
                            ? `${theme.dark.status.success}20`
                            : `${theme.dark.status.warning}20`,
                      })}
                    >
                      <Text
                        style={tw.style(`text-xs font-medium capitalize`, {
                          color:
                            message.status === "accepted"
                              ? theme.dark.status.success
                              : theme.dark.status.warning,
                        })}
                      >
                        {message.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={tw`text-[${theme.dark.text.secondary}] mb-2`}>
                    {message.text}
                  </Text>
                  {message.price && (
                    <Text
                      style={tw`font-semibold text-[${theme.dark.brand.primary}]`}
                    >
                      Offered: ${message.price}
                    </Text>
                  )}
                </View>
              </Surface>
            ))
          )}
        </ScrollView>

        <Surface
          style={tw.style(`absolute bottom-20 left-0 right-0 px-4 py-3`, {
            backgroundColor: theme.dark.background.glass.background,
            borderTopWidth: 1,
            borderTopColor: theme.dark.background.glass.border,
            ...commonStyles.glass,
          })}
        >
          <View style={tw`flex-row mb-2`}>
            <TextInput
              label="Price (optional)"
              value={messagePrice}
              onChangeText={setMessagePrice}
              style={tw`bg-transparent flex-2 mr-2`}
              keyboardType="numeric"
              mode="outlined"
              disabled={sending}
            />
            <TextInput
              label="Message"
              value={messageText}
              onChangeText={setMessageText}
              style={tw`bg-transparent flex-8`}
              mode="outlined"
              disabled={sending}
            />
          </View>
          <Button
            mode="contained"
            onPress={handleSendMessage}
            loading={sending}
            disabled={!messageText || sending}
            style={tw`bg-[${theme.dark.brand.primary}]`}
          >
            Send Message
          </Button>
        </Surface>
      </View>
    </View>
  );
}
