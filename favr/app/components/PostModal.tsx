import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Text, Surface, TextInput, IconButton } from "react-native-paper";
import tw from "twrnc";
import { theme, commonStyles } from "../../theme";
import { usePost } from "../contexts/PostContext";
import { PostCategory } from "../contexts/PostContext";
import * as Location from "expo-location";

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PostModal({ visible, onClose }: PostModalProps) {
  const { createPost } = usePost();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "offer" as "offer" | "request",
    category: "other" as PostCategory,
  });

  const categories: PostCategory[] = [
    "academic",
    "clothing",
    "travel",
    "courier",
    "furniture",
    "electronics",
    "food",
    "other",
  ];

  useEffect(() => {
    if (visible) {
      getCurrentLocation();
    }
  }, [visible]);

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please enable location services to create a post."
        );
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Get address from coordinates (reverse geocoding)
      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (addressResult) {
        const formattedAddress = [
          addressResult.street,
          addressResult.district,
          addressResult.city,
          addressResult.region,
          addressResult.postalCode,
        ]
          .filter(Boolean)
          .join(", ");

        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          address: formattedAddress,
        });
      }
    } catch (error) {
      Alert.alert(
        "Location Error",
        "Failed to get your location. Please try again."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!location) {
      Alert.alert("Error", "Location is required to create a post");
      return;
    }

    setLoading(true);
    const success = await createPost({
      ...formData,
      price: formData.price ? Number(formData.price) : 0,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
      category: formData.category,
    });

    if (success) {
      resetForm();
      onClose();
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      type: "offer",
      category: "other",
    });
    setLocation(null);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
      animationType="slide"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <View style={tw`flex-1 justify-end bg-black bg-opacity-70`}>
          <Surface
            style={tw.style(`rounded-t-3xl overflow-hidden`, {
              backgroundColor: theme.dark.background.secondary,
              borderTopWidth: 1,
              borderColor: theme.dark.background.border,
              ...commonStyles.glass,
            })}
          >
            <View
              style={tw`flex-row justify-between items-center py-4 px-5 border-b border-[${theme.dark.background.border}]`}
            >
              <Text
                style={tw`text-[${theme.dark.text.primary}] text-lg font-bold`}
              >
                Create Post
              </Text>
              <IconButton
                icon="close"
                size={24}
                iconColor={theme.dark.text.primary}
                onPress={onClose}
                style={tw`m-0`}
              />
            </View>

            <ScrollView
              style={tw`max-h-[80%]`}
              keyboardShouldPersistTaps="handled"
            >
              <View style={tw`p-5 pb-10`}>
                <View style={tw`mb-5`}>
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                  >
                    What would you like to do?
                  </Text>
                  <View style={tw`flex-row gap-3`}>
                    <TouchableOpacity
                      onPress={() =>
                        setFormData({ ...formData, type: "offer" })
                      }
                      style={tw.style(
                        `flex-1 py-1.5 px-3 rounded-xl flex-row items-center justify-center space-x-1`,
                        {
                          backgroundColor:
                            formData.type === "offer"
                              ? theme.dark.brand.primary
                              : theme.dark.background.glass.background,
                          borderWidth: formData.type !== "offer" ? 1 : 0,
                          borderColor: theme.dark.background.glass.border,
                          ...commonStyles.glass,
                        }
                      )}
                    >
                      <IconButton
                        icon="hand-heart"
                        size={18}
                        iconColor={
                          formData.type === "offer"
                            ? "white"
                            : theme.dark.text.primary
                        }
                        style={tw`m-0 p-0`}
                      />
                      <Text
                        style={tw`${
                          formData.type === "offer"
                            ? "text-white"
                            : `text-[${theme.dark.text.primary}]`
                        } font-medium`}
                      >
                        Offer
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        setFormData({ ...formData, type: "request" })
                      }
                      style={tw.style(
                        `flex-1 py-1.5 px-3 rounded-xl flex-row items-center justify-center space-x-1`,
                        {
                          backgroundColor:
                            formData.type === "request"
                              ? theme.dark.brand.primary
                              : theme.dark.background.glass.background,
                          borderWidth: formData.type !== "request" ? 1 : 0,
                          borderColor: theme.dark.background.glass.border,
                          ...commonStyles.glass,
                        }
                      )}
                    >
                      <IconButton
                        icon="hand-wave"
                        size={18}
                        iconColor={
                          formData.type === "request"
                            ? "white"
                            : theme.dark.text.primary
                        }
                        style={tw`m-0 p-0`}
                      />
                      <Text
                        style={tw`${
                          formData.type === "request"
                            ? "text-white"
                            : `text-[${theme.dark.text.primary}]`
                        } font-medium`}
                      >
                        Request
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={tw`mb-4`}>
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                  >
                    What's this about?
                  </Text>
                  <TextInput
                    value={formData.title}
                    onChangeText={(value) =>
                      setFormData({ ...formData, title: value })
                    }
                    mode="outlined"
                    placeholder="Enter a clear title"
                    style={tw`bg-[${theme.dark.background.tertiary}] rounded-xl`}
                    outlineColor="transparent"
                    activeOutlineColor={theme.dark.brand.primary}
                    textColor={theme.dark.text.primary}
                  />
                </View>

                <View style={tw`mb-4`}>
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                  >
                    Tell us more about it
                  </Text>
                  <TextInput
                    value={formData.description}
                    onChangeText={(value) =>
                      setFormData({ ...formData, description: value })
                    }
                    multiline={true}
                    numberOfLines={4}
                    placeholder="Provide details"
                    style={tw`bg-[${theme.dark.background.tertiary}] rounded-xl`}
                    mode="outlined"
                    outlineColor="transparent"
                    activeOutlineColor={theme.dark.brand.primary}
                    textColor={theme.dark.text.primary}
                  />
                </View>

                <View style={tw`mb-6`}>
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                  >
                    Set your price
                  </Text>
                  <TextInput
                    value={formData.price}
                    onChangeText={(value) =>
                      setFormData({
                        ...formData,
                        price: value.replace(/[^0-9]/g, ""),
                      })
                    }
                    placeholder="₹0"
                    keyboardType="numeric"
                    style={tw`bg-[${theme.dark.background.tertiary}] rounded-xl`}
                    mode="outlined"
                    outlineColor="transparent"
                    activeOutlineColor={theme.dark.brand.primary}
                    textColor={theme.dark.text.primary}
                  />
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] text-xs mt-1 italic`}
                  >
                    Leave empty if this is a free service
                  </Text>
                </View>

                <View style={tw`mb-4`}>
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                  >
                    Category
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={tw`-mx-5`}
                    contentContainerStyle={tw`px-5`}
                  >
                    <View style={tw`flex-row gap-2`}>
                      {categories.map((category) => (
                        <TouchableOpacity
                          key={category}
                          onPress={() => setFormData({ ...formData, category })}
                          style={tw.style(
                            `py-1.5 px-3 rounded-xl flex-row items-center justify-center space-x-1`,
                            {
                              backgroundColor:
                                formData.category === category
                                  ? theme.dark.brand.primary
                                  : theme.dark.background.glass.background,
                              borderWidth:
                                formData.category !== category ? 1 : 0,
                              borderColor: theme.dark.background.glass.border,
                              ...commonStyles.glass,
                            }
                          )}
                        >
                          <IconButton
                            icon={(() => {
                              switch (category) {
                                case "academic":
                                  return "school";
                                case "clothing":
                                  return "tshirt-crew";
                                case "travel":
                                  return "car";
                                case "courier":
                                  return "package";
                                case "furniture":
                                  return "chair-rolling";
                                case "electronics":
                                  return "laptop";
                                case "food":
                                  return "food";
                                default:
                                  return "dots-horizontal";
                              }
                            })()}
                            size={16}
                            iconColor={
                              formData.category === category
                                ? "white"
                                : theme.dark.text.primary
                            }
                            style={tw`m-0 p-0`}
                          />
                          <Text
                            style={tw`${
                              formData.category === category
                                ? "text-white"
                                : `text-[${theme.dark.text.primary}]`
                            } font-medium capitalize`}
                          >
                            {category}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={tw`mb-4`}>
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                  >
                    Location
                  </Text>
                  <Surface
                    style={tw.style(`p-3 rounded-xl`, {
                      backgroundColor: theme.dark.background.tertiary,
                    })}
                  >
                    {locationLoading ? (
                      <Text style={tw`text-[${theme.dark.text.secondary}]`}>
                        Getting your location...
                      </Text>
                    ) : location ? (
                      <View>
                        <Text style={tw`text-[${theme.dark.text.primary}]`}>
                          {location.address}
                        </Text>
                        <TouchableOpacity onPress={getCurrentLocation}>
                          <Text
                            style={tw`text-[${theme.dark.brand.primary}] text-sm mt-1`}
                          >
                            Refresh Location
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity onPress={getCurrentLocation}>
                        <Text style={tw`text-[${theme.dark.brand.primary}]`}>
                          Get Current Location
                        </Text>
                      </TouchableOpacity>
                    )}
                  </Surface>
                </View>

                <View style={tw`flex-row justify-between`}>
                  <TouchableOpacity
                    onPress={onClose}
                    style={tw.style(
                      `flex-1 mr-3 py-2 rounded-xl border border-[${theme.dark.background.border}]`,
                      {
                        backgroundColor: "transparent",
                      }
                    )}
                  >
                    <Text
                      style={tw`text-[${theme.dark.text.primary}] font-medium text-center`}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={
                      !formData.title || !formData.description || loading
                    }
                    style={tw.style(
                      `flex-1 py-2 rounded-xl flex-row items-center justify-center`,
                      {
                        backgroundColor: theme.dark.brand.primary,
                        opacity:
                          !formData.title || !formData.description || loading
                            ? 0.7
                            : 1,
                      }
                    )}
                  >
                    <Text style={tw`text-white font-medium text-center`}>
                      {loading ? "Creating..." : "Create Post"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={tw`h-6`} />
              </View>
            </ScrollView>
          </Surface>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
