import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl, Modal } from "react-native";
import { Text, Surface, Button } from "react-native-paper";
import { router } from "expo-router";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { theme, commonStyles } from "../theme";
import { usePost } from "./contexts/PostContext";
import { useAuth } from "./contexts/AuthContext";
import ReplyModal from "./components/ReplyModal";
import PostModal from "./components/PostModal";
import UserModal from "./components/UserModal";
import { PostCard, PostSkeleton } from "./components/PostCard";

interface Post {
  id: number;
  type: "offer" | "request";
  title: string;
  description: string;
  price: number;
  distance: number;
  userName: string;
  userId: string;
  time: string;
  profilePicture?: string;
}

export default function Home() {
  const {
    posts,
    loading: postsLoading,
    refreshing,
    fetchPosts,
    createReply,
  } = usePost();
  const {
    userData,
    isLoading: userLoading,
    updateUserDetails,
    fetchUserDetails,
    setUserData,
  } = useAuth();
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [replyPrice, setReplyPrice] = useState("");
  const [replyDescription, setReplyDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState("");

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
        !userDetails.firstName ||
        !userDetails.birthDate ||
        !userDetails.gender
      ) {
        setShowUserModal(true);
        if (userDetails.firstName) setFirstName(userDetails.firstName);
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

  const openReplyModal = (post: Post) => {
    setSelectedPost(post);
    setReplyModalVisible(true);
    setReplyPrice(post.price.toString());
    setReplyDescription("");
  };

  const closeReplyModal = () => {
    setReplyModalVisible(false);
    setSelectedPost(null);
    setReplyPrice("");
    setReplyDescription("");
  };

  const handleSubmitReply = async () => {
    if (!selectedPost || !replyPrice || !replyDescription) return;

    setSubmitting(true);
    try {
      const success = await createReply({
        postId: selectedPost.id,
        price: Number(replyPrice),
        description: replyDescription,
      });

      if (success) {
        closeReplyModal();
      }
    } catch (error) {
      console.error("Failed to submit reply:", error);
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
        firstName,
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
        ) : posts.length === 0 ? (
          <Surface
            style={tw`mx-0 my-2 p-6 bg-[${theme.dark.background.secondary}] rounded-xl items-center`}
          >
            <Text style={tw`text-[${theme.dark.text.secondary}] text-center`}>
              No posts found nearby. Be the first to post!
            </Text>
          </Surface>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              isOwnPost={userData?.id === post.userId}
              onReply={openReplyModal}
            />
          ))
        )}
      </ScrollView>

      <ReplyModal
        visible={replyModalVisible}
        selectedReply={selectedPost}
        replyPrice={replyPrice}
        replyDescription={replyDescription}
        submitting={submitting}
        onChangePrice={setReplyPrice}
        onChangeDescription={setReplyDescription}
        onClose={closeReplyModal}
        onSubmit={handleSubmitReply}
      />

      <PostModal
        visible={createPostModalVisible}
        onClose={closeCreatePostModal}
      />

      <UserModal
        show={showUserModal}
        firstName={firstName}
        birthDate={birthDate}
        gender={gender}
        setFirstName={setFirstName}
        setBirthDate={setBirthDate}
        setGender={setGender}
        loading={userLoading}
        onSubmit={handleUserDetailsUpdate}
      />
    </View>
  );
}
