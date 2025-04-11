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
} from "react-native-paper";
import tw from "twrnc";
import { usePost } from "./contexts/PostContext";
import { theme, commonStyles } from "../theme";
import { router, useLocalSearchParams } from "expo-router";

export default function ThreadsPage() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { userPosts, postThreads, loading, error, fetchPostMessages } =
    usePost();
  const [refreshing, setRefreshing] = useState(false);

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

  const openMessageThread = (threadId: string) => {
    router.push({
      pathname: "/messages" as any,
      params: { threadId },
    });
  };

  if (!postId) {
    return (
      <View
        style={tw`flex-1 bg-[${theme.dark.background.primary}] justify-center items-center`}
      >
        <Text style={tw`text-[${theme.dark.text.primary}]`}>
          No post selected
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
            onPress={() => router.push("/posts" as any)}
          />
          <Text style={tw`text-xl font-bold text-[${theme.dark.text.primary}]`}>
            Post Messages
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
            </View>
          </Surface>
        )}

        <Text
          style={tw`text-[${theme.dark.text.primary}] text-lg font-semibold mx-5 mb-4`}
        >
          Conversations
        </Text>

        {error && (
          <Text style={tw`text-[${theme.dark.brand.danger}] mx-5 mb-4`}>
            {error}
          </Text>
        )}

        {postThreads.length === 0 ? (
          <Text style={tw`text-[${theme.dark.text.secondary}] mx-5 italic`}>
            No messages yet
          </Text>
        ) : (
          postThreads.map((thread, index) => {
            // Get the first message to display as preview
            const firstMessage = thread[0];
            const lastMessage = thread[thread.length - 1];

            return (
              <TouchableOpacity
                key={index}
                onPress={() => openMessageThread(firstMessage.threadId)}
              >
                <Surface
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
                        {firstMessage.sender?.fullName || "User"}
                      </Text>
                      <Text
                        style={tw`text-xs text-[${theme.dark.text.secondary}]`}
                      >
                        {new Date(lastMessage.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text
                      style={tw`text-[${theme.dark.text.secondary}] mb-2`}
                      numberOfLines={2}
                    >
                      {lastMessage.text}
                    </Text>
                    <View style={tw`flex-row justify-between items-center`}>
                      {firstMessage.price && (
                        <Text
                          style={tw`font-semibold text-[${theme.dark.brand.primary}]`}
                        >
                          Offered: ${firstMessage.price}
                        </Text>
                      )}
                      <View
                        style={tw.style(`px-2 py-0.5 rounded-full`, {
                          backgroundColor:
                            firstMessage.status === "replied"
                              ? `${theme.dark.status.success}20`
                              : `${theme.dark.status.warning}20`,
                        })}
                      >
                        <Text
                          style={tw.style(`text-xs font-medium capitalize`, {
                            color:
                              firstMessage.status === "replied"
                                ? theme.dark.status.success
                                : theme.dark.status.warning,
                          })}
                        >
                          {firstMessage.status === "replied"
                            ? "Active"
                            : "Pending"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Surface>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
