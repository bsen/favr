import React, { useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { Text, Surface, Avatar } from "react-native-paper";
import { router } from "expo-router";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme, commonStyles } from "../theme";
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

const avatarImages = {
  "alien.png": require("../public/avatars/alien.png"),
  "anaconda.png": require("../public/avatars/anaconda.png"),
  "bird.png": require("../public/avatars/bird.png"),
  "butterfly.png": require("../public/avatars/butterfly.png"),
  "cow.png": require("../public/avatars/cow.png"),
  "deer.png": require("../public/avatars/deer.png"),
  "jacutinga.png": require("../public/avatars/jacutinga.png"),
  "jaguar.png": require("../public/avatars/jaguar.png"),
  "panda.png": require("../public/avatars/panda.png"),
  "turtle.png": require("../public/avatars/turtle.png"),
};

export default function Home() {
  const { posts, loading, refreshing, fetchPosts, refreshPosts } = usePost();

  useEffect(() => {
    const initialize = async () => {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        await fetchPosts(12.9739777, 77.6384004);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    initialize();
  }, []);

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
      style={tw.style(`mx-0 my-2 rounded-xl p-4`, {
        backgroundColor: theme.dark.background.glass.background,
        borderWidth: 1,
        borderColor: theme.dark.background.glass.border,
        ...commonStyles.glass,
      })}
    >
      <View style={tw`flex-row items-center mb-4`}>
        {profilePicture ? (
          <Avatar.Image
            size={48}
            source={avatarImages[profilePicture as keyof typeof avatarImages]}
            style={tw`bg-[${theme.dark.background.border}]`}
          />
        ) : (
          <Avatar.Image
            size={48}
            source={require("../public/avatars/default.png")}
            style={tw`bg-[${theme.dark.background.border}]`}
          />
        )}
        <View style={tw`ml-3 flex-1`}>
          <Text
            style={tw`text-[${theme.dark.text.primary}] font-medium text-base`}
          >
            {userName}
          </Text>
          <Text style={tw`text-[${theme.dark.text.secondary}] text-xs`}>
            {time}
          </Text>
        </View>
        <View
          style={tw.style(`px-3 py-1 rounded-full`, {
            backgroundColor: theme.dark.button.primary.background,
            borderWidth: 1,
            borderColor: theme.dark.background.glass.border,
          })}
        >
          <Text
            style={tw`text-[${theme.dark.brand.primary}] text-xs font-medium`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </View>
      </View>

      <Text
        style={tw`text-[${theme.dark.text.primary}] text-lg font-bold mb-2`}
      >
        {title}
      </Text>
      <Text style={tw`text-[${theme.dark.text.secondary}] mb-4 leading-5`}>
        {description}
      </Text>

      <View
        style={tw.style(`flex-row justify-between items-center pt-2`, {
          borderTopWidth: 1,
          borderTopColor: theme.dark.background.glass.border,
        })}
      >
        <Text style={tw`text-[${theme.dark.brand.primary}] text-lg font-bold`}>
          ₹{price}
        </Text>
        <Text style={tw`text-[${theme.dark.text.secondary}] text-sm`}>
          {distance} km away
        </Text>
      </View>
    </Surface>
  );

  const PostSkeleton = () => (
    <Surface
      style={tw.style(`mx-0 my-2 rounded-xl p-4`, {
        backgroundColor: theme.dark.background.glass.background,
        borderWidth: 1,
        borderColor: theme.dark.background.glass.border,
        ...commonStyles.glass,
      })}
    >
      <View style={tw`flex-row items-center mb-4`}>
        <View
          style={tw.style(`w-12 h-12 rounded-full`, {
            backgroundColor: `${theme.dark.background.tertiary}80`,
          })}
        />
        <View style={tw`ml-3 flex-1`}>
          <View
            style={tw.style(`w-24 h-4 rounded mb-1`, {
              backgroundColor: `${theme.dark.background.tertiary}80`,
            })}
          />
          <View
            style={tw.style(`w-16 h-3 rounded`, {
              backgroundColor: `${theme.dark.background.tertiary}80`,
            })}
          />
        </View>
      </View>
      <View
        style={tw.style(`w-full h-6 rounded mb-2`, {
          backgroundColor: `${theme.dark.background.tertiary}80`,
        })}
      />
      <View
        style={tw.style(`w-3/4 h-4 rounded mb-4`, {
          backgroundColor: `${theme.dark.background.tertiary}80`,
        })}
      />
      <View
        style={tw.style(`flex-row justify-between items-center pt-2`, {
          borderTopWidth: 1,
          borderTopColor: theme.dark.background.glass.border,
        })}
      >
        <View
          style={tw.style(`w-16 h-6 rounded`, {
            backgroundColor: `${theme.dark.background.tertiary}80`,
          })}
        />
        <View
          style={tw.style(`w-20 h-4 rounded`, {
            backgroundColor: `${theme.dark.background.tertiary}80`,
          })}
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
        contentContainerStyle={tw`pt-40 pb-36 px-4`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshPosts}
            tintColor={theme.dark.brand.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => <PostSkeleton key={i} />)
        ) : posts.length === 0 ? (
          <Surface
            style={tw`mx-0 my-2 p-6 bg-[${theme.dark.background.secondary}] rounded-xl items-center`}
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
