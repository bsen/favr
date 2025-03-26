import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { FAB, BottomNavigation, Text } from "react-native-paper";
import { router } from "expo-router";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostCard from "./components/PostCard";
import { useAuth } from "./contexts/AuthContext";
import { usePost } from "./contexts/PostContext";
import Profile from "./components/Profile";

export default function Home() {
  const { userData } = useAuth();
  const { posts, loading, refreshing, fetchPosts, refreshPosts } = usePost();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "home", title: "Home", icon: "home" },
    { key: "profile", title: "Profile", icon: "account" },
  ]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userData?.location) {
      fetchPosts(userData.location.latitude, userData.location.longitude);
    }
  }, [userData?.location]);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
    }
  };

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "home":
        return (
          <ScrollView
            style={tw`flex-1`}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshPosts}
              />
            }
          >
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
            {loading && (
              <View style={tw`py-4 items-center`}>
                <Text style={tw`text-gray-400`}>Loading...</Text>
              </View>
            )}
          </ScrollView>
        );
      case "profile":
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <View style={tw`flex-1 bg-[#121212]`}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={tw`bg-[#1e1e1e] border-t border-[#2a2a2a]`}
        activeColor="#22c55e"
        inactiveColor="#9ca3af"
      />
      <FAB
        icon="plus"
        style={[tw`absolute right-4 bottom-20`, { backgroundColor: "#22c55e" }]}
        color="white"
        onPress={() => router.push("/create-post")}
      />
    </View>
  );
}
