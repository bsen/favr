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
  userName: string;
  time: string;
  image?: string;
  profilePicture?: string;
}

interface CreatePostData {
  title: string;
  description: string;
  price: number;
  type: "offer" | "request";
}

interface PostContextType {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  fetchPosts: (latitude: number, longitude: number) => Promise<void>;
  createPost: (data: CreatePostData) => Promise<boolean>;
  refreshPosts: () => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

const getTimeDifference = (createdAt: string) => {
  const currentDate = new Date();
  const postDate = new Date(createdAt);
  const timeDifference = currentDate.getTime() - postDate.getTime();
  const hoursDifference = Math.floor(timeDifference / (1000 * 3600));
  const daysDifference = Math.floor(hoursDifference / 24);

  if (daysDifference >= 30) {
    return postDate.toDateString();
  } else if (daysDifference >= 1) {
    return `${daysDifference}d ago`;
  } else if (hoursDifference >= 1) {
    return `${hoursDifference}h ago`;
  } else {
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    return `${minutesDifference}m ago`;
  }
};

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastLocation, setLastLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const fetchPosts = async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("auth_token");
      if (!token) throw new Error("No auth token");

      const response = await fetch(
        `${API_BASE_URL}/post/nearby?latitude=${latitude}&longitude=${longitude}&radius=5&page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();

      const formattedPosts = (
        Array.isArray(data) ? data : data.posts || []
      ).map((post: any) => ({
        id: post.id,
        type: post.type || "offer",
        title: post.title || "",
        description: post.description || "",
        price: post.price || 0,
        distance: Number(post.distance).toFixed(2),
        userName: post.userName || "User",
        time: getTimeDifference(post.createdAt),
        profilePicture: post.profilePicture,
      }));

      setPosts(formattedPosts);
      setLastLocation({ lat: latitude, lng: longitude });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (data: CreatePostData): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) throw new Error("No auth token");

      const response = await fetch(`${API_BASE_URL}/post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create post");

      // Refresh posts if we have location
      if (lastLocation) {
        await fetchPosts(lastLocation.lat, lastLocation.lng);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
      return false;
    }
  };

  const refreshPosts = async () => {
    if (!lastLocation) return;
    setRefreshing(true);
    await fetchPosts(lastLocation.lat, lastLocation.lng);
    setRefreshing(false);
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        refreshing,
        error,
        fetchPosts,
        createPost,
        refreshPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};
