import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl, Modal } from "react-native";
import { Text, Surface, Button } from "react-native-paper";
import { router } from "expo-router";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { theme, commonStyles } from "../theme";
import { usePost, Post } from "./contexts/PostContext";
import { useAuth } from "./contexts/AuthContext";
import MessageModal from "./components/MessageModal";
import PostModal from "./components/PostModal";
import UserModal from "./components/UserModal";
import { PostCard, PostSkeleton } from "./components/PostCard";
import Header from "./components/Header";
import AppBar from "./components/AppBar";

export default function Home() {
  const {
    posts,
    loading: postsLoading,
    refreshing,
    fetchPosts,
    createMessage,
  } = usePost();
  const {
    userData,
    isLoading: userLoading,
    updateUserDetails,
    fetchUserDetails,
    setUserData,
  } = useAuth();
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [messagePrice, setMessagePrice] = useState("");
  const [messageText, setMessageText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    const initialize = async () => {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const userDetails = await fetchUserDetails();
      if (!userDetails || !userDetails.id) return;

      if (
        !userDetails.fullName ||
        !userDetails.birthDate ||
        !userDetails.gender
      ) {
        setShowUserModal(true);
        if (userDetails.fullName) setFullName(userDetails.fullName);
        if (userDetails.birthDate)
          setBirthDate(new Date(userDetails.birthDate));
        if (userDetails.gender) setGender(userDetails.gender);
      }

      const location = await Location.getCurrentPositionAsync({});
      await fetchPosts(location.coords.latitude, location.coords.longitude);

      setIsInitializing(false);
    };

    initialize();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.type === selectedCategory));
    }
  }, [selectedCategory, posts]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const openMessageModal = (post: Post) => {
    setSelectedPost(post);
    setMessageModalVisible(true);
    setMessagePrice(post.price?.toString() || "");
    setMessageText("");
  };

  const closeMessageModal = () => {
    setMessageModalVisible(false);
    setSelectedPost(null);
    setMessagePrice("");
    setMessageText("");
  };

  const handleSubmitMessage = async () => {
    if (!selectedPost || !messageText) return;

    setSubmitting(true);
    try {
      const success = await createMessage({
        postId: selectedPost.id,
        price: messagePrice ? Number(messagePrice) : undefined,
        text: messageText,
      });

      if (success) {
        closeMessageModal();
      }
    } catch (error) {
      console.error("Failed to submit message:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const closeCreatePostModal = () => {
    setCreatePostModalVisible(false);
  };

  const handleUserDetailsUpdate = async () => {
    try {
      const success = await updateUserDetails({
        fullName,
        birthDate,
        gender,
      });

      if (success) {
        setShowUserModal(false);
        await fetchUserDetails();
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleRefresh = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      await fetchPosts(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const handleCreatePostPress = () => {
    setCreatePostModalVisible(true);
  };

  return (
    <View
      style={tw.style(`bg-[${theme.dark.background.primary}]`, {
        height: "100%",
      })}
    >
      <Header onCategorySelect={handleCategorySelect} />

      <ScrollView
        style={tw.style({ height: "100%" })}
        contentContainerStyle={tw`pt-40 pb-36 px-4`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.dark.brand.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isInitializing || userLoading || postsLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => <PostSkeleton key={i} />)
        ) : filteredPosts.length === 0 ? (
          <Surface
            style={tw`mx-0 my-2 p-6 bg-[${theme.dark.background.secondary}] rounded-xl items-center`}
          >
            <Text style={tw`text-[${theme.dark.text.secondary}] text-center`}>
              No posts found
              {selectedCategory !== "all"
                ? ` in "${selectedCategory}" category`
                : " nearby"}
              . Be the first to post!
            </Text>
          </Surface>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              isOwnPost={userData?.id === post.userId}
              onReply={openMessageModal}
            />
          ))
        )}
      </ScrollView>

      <MessageModal
        visible={messageModalVisible}
        selectedPost={selectedPost}
        messagePrice={messagePrice}
        messageText={messageText}
        submitting={submitting}
        onChangePrice={setMessagePrice}
        onChangeText={setMessageText}
        onClose={closeMessageModal}
        onSubmit={handleSubmitMessage}
      />

      <PostModal
        visible={createPostModalVisible}
        onClose={closeCreatePostModal}
      />

      <UserModal
        show={showUserModal}
        fullName={fullName}
        birthDate={birthDate}
        gender={gender}
        setFullName={setFullName}
        setBirthDate={setBirthDate}
        setGender={setGender}
        loading={userLoading}
        onSubmit={handleUserDetailsUpdate}
      />

      <AppBar onCreatePress={handleCreatePostPress} />
    </View>
  );
}
