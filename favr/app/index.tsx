import React, { useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { Text, Surface, Avatar } from "react-native-paper";
import { router } from "expo-router";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../theme";
import { usePost } from "./contexts/PostContext";

interface Post {
  id: number;
  type: "offer" | "request";
  title: string;
  description: string;
  price: number;
  distance: number;
  userName: string;
  time: string;
  profilePicture?: string;
}

export default function Home() {
  const { posts, loading, refreshing, fetchPosts, refreshPosts } = usePost();

  useEffect(() => {
    checkAuth();
    fetchPosts(12.9739777, 77.6384004);
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
    }
  };

  const PostCard = ({
    title,
    description,
    price,
    distance,
    userName,
    time,
    type,
    profilePicture,
  }: Post) => (
    <Surface
      style={tw`mx-4 mt-4 bg-[${theme.dark.background.secondary}] rounded-xl p-4`}
    >
      <View style={tw`flex-row items-center mb-4`}>
        {profilePicture ? (
          <Avatar.Image
            size={40}
            source={{ uri: `/avatars/${profilePicture}` }}
            style={tw`bg-[${theme.dark.brand.primary}]`}
          />
        ) : (
          <Avatar.Text
            size={40}
            label={userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
            style={tw`bg-[${theme.dark.brand.primary}]`}
          />
        )}
        <View style={tw`ml-3 flex-1`}>
          <Text style={tw`text-[${theme.dark.text.primary}] font-medium`}>
            {userName}
          </Text>
          <Text style={tw`text-[${theme.dark.text.secondary}] text-sm`}>
            {time}
          </Text>
        </View>
        <Surface
          style={tw`bg-[${theme.dark.background.secondary}] px-3 py-1 rounded-full`}
        >
          <Text
            style={tw`text-[${theme.dark.brand.primary}] text-xs font-medium`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </Surface>
      </View>

      <Text
        style={tw`text-[${theme.dark.text.primary}] text-lg font-bold mb-2`}
      >
        {title}
      </Text>
      <Text style={tw`text-[${theme.dark.text.secondary}] mb-4`}>
        {description}
      </Text>

      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-[${theme.dark.brand.primary}] text-lg font-bold`}>
          ₹{price}
        </Text>
        <Text style={tw`text-[${theme.dark.text.secondary}]`}>
          {distance} km away
        </Text>
      </View>
    </Surface>
  );

  const PostSkeleton = () => (
    <Surface
      style={tw`mx-4 mt-4 bg-[${theme.dark.background.secondary}] rounded-xl p-4`}
    >
      <View style={tw`flex-row items-center mb-4`}>
        <View
          style={tw`w-10 h-10 rounded-full bg-[${theme.dark.background.secondary}]`}
        />
        <View style={tw`ml-3 flex-1`}>
          <View
            style={tw`w-24 h-4 bg-[${theme.dark.background.secondary}] rounded mb-1`}
          />
          <View
            style={tw`w-16 h-3 bg-[${theme.dark.background.secondary}] rounded`}
          />
        </View>
      </View>
      <View
        style={tw`w-full h-6 bg-[${theme.dark.background.secondary}] rounded mb-2`}
      />
      <View
        style={tw`w-3/4 h-4 bg-[${theme.dark.background.secondary}] rounded mb-4`}
      />
      <View style={tw`flex-row justify-between items-center`}>
        <View
          style={tw`w-16 h-6 bg-[${theme.dark.background.secondary}] rounded`}
        />
        <View
          style={tw`w-20 h-4 bg-[${theme.dark.background.secondary}] rounded`}
        />
      </View>
    </Surface>
  );

  return (
    <View
      style={tw.style(`bg-[${theme.dark.background.primary}]`, {
        height: "100%",
      })}
    >
      <ScrollView
        style={tw.style({ height: "100%" })}
        contentContainerStyle={tw`pt-0 pb-4`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshPosts}
            tintColor={theme.dark.brand.primary}
          />
        }
      >
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => <PostSkeleton key={i} />)
        ) : posts.length === 0 ? (
          <Surface
            style={tw`mx-4 mt-4 p-6 bg-[${theme.dark.background.secondary}] rounded-xl items-center`}
          >
            <Text style={tw`text-[${theme.dark.text.secondary}] text-center`}>
              No posts found nearby. Be the first to post!
            </Text>
          </Surface>
        ) : (
          posts.map((post) => <PostCard key={post.id} {...post} />)
        )}
      </ScrollView>
    </View>
  );
}
