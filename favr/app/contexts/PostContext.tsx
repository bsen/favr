import React, { createContext, useContext, useState } from "react";
import { API_BASE_URL } from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

interface PostContextType {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  fetchPosts: (latitude: number, longitude: number) => Promise<void>;
  createPost: (formData: any) => Promise<boolean>;
  refreshPosts: () => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const fetchPosts = async (latitude: number, longitude: number) => {
    if (loading) return;
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("auth_token");
      const response = await fetch(
        `${API_BASE_URL}/post/nearby?latitude=${latitude}&longitude=${longitude}&radius=5&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPosts((prev) =>
          page === 1 ? data.posts : [...prev, ...data.posts]
        );
        setHasMore(data.hasMore);
        if (data.hasMore) {
          setPage((prev) => prev + 1);
        }
        setCurrentLocation({ latitude, longitude });
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (formData: any) => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (currentLocation) {
          setPage(1);
          await fetchPosts(currentLocation.latitude, currentLocation.longitude);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating post:", error);
      return false;
    }
  };

  const refreshPosts = async () => {
    if (!currentLocation) return;
    setRefreshing(true);
    setPage(1);
    await fetchPosts(currentLocation.latitude, currentLocation.longitude);
    setRefreshing(false);
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        refreshing,
        fetchPosts,
        createPost,
        refreshPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};
