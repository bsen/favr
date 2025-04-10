import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Text, Surface, ActivityIndicator } from "react-native-paper";
import tw from "twrnc";
import { usePost } from "./contexts/PostContext";
import { theme, commonStyles } from "../theme";
import { router } from "expo-router";

export default function UserPosts() {
  const { userPosts, loading, error, fetchUserPosts } = usePost();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserPosts();
    setRefreshing(false);
  };

  const navigateToPostDetails = (postId: number) => {
    router.push({
      pathname: "/post-detail",
      params: { postId: postId.toString() },
    });
  };

  if (loading && !refreshing && userPosts.length === 0) {
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
        contentContainerStyle={tw`pb-36 pt-20`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.dark.brand.primary}
          />
        }
      >
        <Text
          style={tw`text-[${theme.dark.text.primary}] text-xl font-semibold mx-5 mb-4`}
        >
          My Posts
        </Text>

        {error && (
          <Text style={tw`text-[${theme.dark.brand.danger}] mx-5 mb-4`}>
            {error}
          </Text>
        )}

        {userPosts.length === 0 ? (
          <Text style={tw`text-[${theme.dark.text.secondary}] mx-5 italic`}>
            You haven't created any posts yet
          </Text>
        ) : (
          userPosts.map((post) => (
            <TouchableOpacity
              key={post.id}
              onPress={() => navigateToPostDetails(post.id)}
              style={tw`mb-4 mx-5`}
            >
              <Surface
                style={tw.style(`rounded-2xl overflow-hidden`, {
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
                    <Text
                      style={tw`text-xs text-[${theme.dark.text.secondary}]`}
                    >
                      {post.time}
                    </Text>
                  </View>
                  <Text
                    style={tw`text-[${theme.dark.text.primary}] text-lg font-semibold mb-1`}
                  >
                    {post.title}
                  </Text>
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] mb-2`}
                    numberOfLines={2}
                  >
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
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
