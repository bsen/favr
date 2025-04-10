import React, { createContext, useContext, useState } from "react";
import { API_BASE_URL } from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Post {
  id: number;
  type: "offer" | "request";
  title: string;
  description: string;
  price: number | null;
  distance: number;
  fullName: string;
  userId: string;
  time: string;
  address?: string;
  category?: string;
  image?: string;
  profilePicture?: string;
}

export interface Message {
  id: number;
  price: number | null;
  text: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profilePicture: string | null;
  };
}

export type PostCategory =
  | "academic"
  | "clothing"
  | "travel"
  | "courier"
  | "furniture"
  | "electronics"
  | "food"
  | "other";

interface CreatePostData {
  title: string;
  description: string;
  price?: number;
  type: "offer" | "request";
  latitude: number;
  longitude: number;
  address: string;
  category: PostCategory;
}

interface CreateMessageData {
  postId: number;
  price?: number;
  text: string;
  imageUrls?: string[];
}

interface PostContextType {
  posts: Post[];
  userPosts: Post[];
  postMessages: Message[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  fetchPosts: (latitude: number, longitude: number) => Promise<void>;
  fetchUserPosts: () => Promise<void>;
  fetchPostMessages: (postId: number) => Promise<void>;
  createPost: (data: CreatePostData) => Promise<boolean>;
  refreshPosts: () => Promise<void>;
  createMessage: (data: CreateMessageData) => Promise<boolean>;
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
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postMessages, setPostMessages] = useState<Message[]>([]);
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
        price: post.price,
        distance: Number(post.distance || 0).toFixed(2),
        fullName: post.user?.fullName || "User",
        userId: post.userId || post.user?.id || "",
        address: post.address || "",
        category: post.category || "",
        time: getTimeDifference(post.createdAt),
        profilePicture: post.user?.profilePicture || null,
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

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("auth_token");
      if (!token) throw new Error("No auth token");

      const response = await fetch(`${API_BASE_URL}/post`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user posts");

      const data = await response.json();

      const formattedPosts = (
        Array.isArray(data) ? data : data.posts || []
      ).map((post: any) => ({
        id: post.id,
        type: post.type || "offer",
        title: post.title || "",
        description: post.description || "",
        price: post.price,
        distance: 0,
        fullName: post.user?.fullName || "User",
        userId: post.userId || post.user?.id || "",
        address: post.address || "",
        category: post.category || "",
        time: getTimeDifference(post.createdAt),
        profilePicture: post.user?.profilePicture || null,
      }));

      setUserPosts(formattedPosts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user posts"
      );
      setUserPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostMessages = async (postId: number) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("auth_token");
      if (!token) throw new Error("No auth token");

      const response = await fetch(`${API_BASE_URL}/message/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch post messages");

      const data = await response.json();
      setPostMessages(data.messages || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch post messages"
      );
      setPostMessages([]);
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
        body: JSON.stringify({
          ...data,
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
      }

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

  const createMessage = async (data: CreateMessageData): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) throw new Error("No auth token");

      const response = await fetch(`${API_BASE_URL}/message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create message");
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create message");
      return false;
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        userPosts,
        postMessages,
        loading,
        refreshing,
        error,
        fetchPosts,
        fetchUserPosts,
        fetchPostMessages,
        createPost,
        refreshPosts,
        createMessage,
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
