import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { Text, Surface, Avatar, Button } from "react-native-paper";
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
  const { posts, loading, refreshing, fetchPosts, refreshPosts, createReply } =
    usePost();
  const {
    userData,
    showLocationModal,
    setShowLocationModal,
    isLoading,
    locationError,
    setLocationError,
    updateUserDetails,
    fetchAddress,
    fetchUserDetails,
  } = useAuth();
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [replyPrice, setReplyPrice] = useState("");
  const [replyDescription, setReplyDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [locationData, setLocationData] = useState<{
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    const initialize = async () => {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const userDetails = await fetchUserDetails();
      if (!userDetails || !userDetails.id) return;

      if (!userDetails.location?.latitude || !userDetails.location?.longitude) {
        setShowLocationModal(true);
      } else {
        try {
          await fetchPosts(
            userDetails.location.latitude,
            userDetails.location.longitude
          );
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        }
      }
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

  const isOwnPost = (post: Post) => {
    return userData?.id === post.userId;
  };

  const PostCard = ({
    id,
    title,
    description,
    price,
    distance,
    userName,
    userId,
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
        <Avatar.Image
          size={48}
          source={require("../public/default-user.png")}
          style={tw`bg-[${theme.dark.background.border}]`}
        />
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

      {!isOwnPost({
        id,
        title,
        description,
        price,
        distance,
        userName,
        userId,
        time,
        type,
        profilePicture,
      }) && (
        <Button
          mode="contained"
          style={tw.style(`mt-3 rounded-lg`, {
            backgroundColor: theme.dark.brand.primary,
          })}
          labelStyle={tw`text-white font-medium`}
          onPress={() =>
            openReplyModal({
              id,
              title,
              description,
              price,
              distance,
              userName,
              userId,
              time,
              type,
              profilePicture,
            })
          }
        >
          Make Offer
        </Button>
      )}

      {isOwnPost({
        id,
        title,
        description,
        price,
        distance,
        userName,
        userId,
        time,
        type,
        profilePicture,
      }) && (
        <View
          style={tw`mt-3 px-2 py-1 rounded-lg self-start bg-[${theme.dark.background.secondary}]`}
        >
          <Text style={tw`text-[${theme.dark.text.secondary}] text-xs`}>
            Your post
          </Text>
        </View>
      )}
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

  const closeCreatePostModal = () => {
    setCreatePostModalVisible(false);
  };

  const handleUpdateLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Location permission denied");
        return;
      }

      // Get current position with high accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Use backend to get address details
      const addressDetails = await fetchAddress(
        location.coords.latitude,
        location.coords.longitude
      );

      if (addressDetails) {
        setLocationData({
          ...addressDetails,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        setLocationError("Could not get address details. Please try again.");
      }
    } catch (error) {
      console.error("Location error:", error);
      setLocationError("Failed to get location. Please try again.");
    }
  };

  const handleSaveLocation = async () => {
    if (!locationData) return;

    const success = await updateUserDetails({
      addressDetails: locationData,
    });

    if (success) {
      setShowLocationModal(false);
      await fetchPosts(locationData.latitude, locationData.longitude);
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
        type="location"
        show={showLocationModal}
        loading={isLoading}
        locationError={locationError}
        onGetLocation={handleUpdateLocation}
        onClose={() => setShowLocationModal(false)}
        onSubmit={handleSaveLocation}
        location={locationData || userData?.location}
        setLocation={setLocationData}
        fullScreen={true}
      />
    </View>
  );
}
