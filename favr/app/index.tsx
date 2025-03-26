import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { FAB } from "react-native-paper";
import { router, Link } from "expo-router";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./components/Header";
import PostCard from "./components/PostCard";

interface Post {
  id: number;
  type: "offer" | "request";
  title: string;
  description: string;
  price: number;
  distance: number;
  author: string;
  time: string;
  image?: string;
}

interface UserData {
  name?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userData?.location) {
      setPage(1);
      setPosts([]);
      fetchPosts(1);
    }
  }, [selectedCategory, userData?.location]);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/user/details",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok && data.user) {
        setUserData(data.user);
      } else {
        await AsyncStorage.removeItem("auth_token");
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      await AsyncStorage.removeItem("auth_token");
      router.replace("/login");
    }
  };

  const fetchPosts = async (pageNum: number) => {
    if (loading || !userData?.location) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/post/nearby?latitude=${
          userData.location.latitude
        }&longitude=${userData.location.longitude}&radius=5&page=${pageNum}${
          selectedCategory !== "all" ? `&category=${selectedCategory}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("auth_token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPosts((prev) =>
          pageNum === 1 ? data.posts : [...prev, ...data.posts]
        );
        setHasMore(data.hasMore);
        if (data.hasMore) {
          setPage((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("auth_token");
    router.replace("/login");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchPosts(1);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-900`}>
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onLogout={handleLogout}
      />

      <ScrollView
        style={tw`flex-1`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isEndReached =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20;
          if (isEndReached) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
        {loading && (
          <View style={tw`py-4 items-center`}>
            {/* Add loading indicator here */}
          </View>
        )}
      </ScrollView>

      <Link href="/create-post" asChild>
        <FAB
          icon="plus"
          style={[
            tw`absolute right-4 bottom-4`,
            { backgroundColor: "#25D366" },
          ]}
          color="white"
        />
      </Link>
    </View>
  );
}
