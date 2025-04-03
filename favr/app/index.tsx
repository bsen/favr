import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl, Modal } from "react-native";
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
    locationError,
    setLocationError,
    updateUserDetails,
    fetchUserDetails,
    setUserData,
    currentLocation,
    getCurrentLocation,
  } = useAuth();
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [replyPrice, setReplyPrice] = useState("");
  const [replyDescription, setReplyDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const userDetails = await fetchUserDetails();
      if (!userDetails || !userDetails.id) return;

      const location = await getCurrentLocation();
      if (!location) {
        setIsInitializing(false);
        return;
      }

      if (!userDetails.location?.latitude || !userDetails.location?.longitude) {
        try {
          const address = await Location.reverseGeocodeAsync({
            latitude: location.latitude,
            longitude: location.longitude,
          });

          if (address[0]) {
            const locationData = {
              latitude: location.latitude,
              longitude: location.longitude,
              address: address[0].street || "",
              city: address[0].city || "",
              state: address[0].region || "",
              postalCode: address[0].postalCode || "",
              country: address[0].country || "",
            };

            await Promise.all([
              updateUserDetails({
                addressDetails: locationData,
              }),
              fetchPosts(location.latitude, location.longitude),
            ]);
          }
        } catch (error) {
          console.error("Error setting up location:", error);
        }
      } else {
        await fetchPosts(location.latitude, location.longitude);
      }

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

  const handleRefresh = async () => {
    try {
      const userDetails = await fetchUserDetails();
      if (!userDetails) return;

      const location = await getCurrentLocation();
      if (!location) return;

      if (!userDetails.location?.latitude || !userDetails.location?.longitude) {
        try {
          const address = await Location.reverseGeocodeAsync({
            latitude: location.latitude,
            longitude: location.longitude,
          });

          if (address[0]) {
            const locationData = {
              latitude: location.latitude,
              longitude: location.longitude,
              address: address[0].street || "",
              city: address[0].city || "",
              state: address[0].region || "",
              postalCode: address[0].postalCode || "",
              country: address[0].country || "",
            };

            await Promise.all([
              updateUserDetails({
                addressDetails: locationData,
              }),
              fetchPosts(location.latitude, location.longitude),
            ]);
          }
        } catch (error) {
          console.error("Error setting up location:", error);
        }
      } else {
        await fetchPosts(location.latitude, location.longitude);
      }
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

      <Modal
        visible={showLocationModal}
        transparent={true}
        animationType="slide"
      >
        <View style={tw`flex-1 bg-[${theme.dark.background.primary}]`}>
          <View style={tw`flex-1 justify-end`}>
            <Surface
              style={tw.style(`rounded-t-3xl`, {
                backgroundColor: theme.dark.background.secondary,
                borderTopWidth: 1,
                borderColor: theme.dark.background.border,
                ...commonStyles.glass,
              })}
            >
              <View style={tw`p-6`}>
                <Text
                  style={tw`text-[${theme.dark.text.primary}] text-2xl font-bold mb-4`}
                >
                  Enable Location
                </Text>
                <Text
                  style={tw`text-[${theme.dark.text.secondary}] text-base mb-4`}
                >
                  We need your location to show you nearby posts and help you
                  connect with others in your area.
                </Text>
                {locationError && (
                  <Text style={tw`text-[${theme.dark.brand.error.text}] mb-4`}>
                    {locationError}
                  </Text>
                )}
              </View>

              <View style={tw`px-6 pb-16`}>
                <Button
                  mode="contained"
                  onPress={handleRefresh}
                  loading={isInitializing}
                  style={tw.style(`rounded-xl`, {
                    backgroundColor: theme.dark.brand.primary,
                  })}
                  contentStyle={tw`py-1`}
                  labelStyle={tw`text-base font-medium`}
                >
                  {isInitializing
                    ? "Getting Location..."
                    : "Use Current Location"}
                </Button>
              </View>
            </Surface>
          </View>
        </View>
      </Modal>
    </View>
  );
}
