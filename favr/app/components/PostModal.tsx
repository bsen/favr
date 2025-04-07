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
import {
  Text,
  Surface,
  TextInput,
  IconButton,
  Button,
} from "react-native-paper";
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
  const [typeSelected, setTypeSelected] = useState(false);
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
      resetForm();
      getCurrentLocation();
    }
  }, [visible]);

  useEffect(() => {
    if (formData.type === "request") {
      setFormData({
        ...formData,
        price: "",
      });
    }
  }, [formData.type]);

  const handleTypeSelection = (type: "offer" | "request") => {
    setFormData({ ...formData, type });
    setTypeSelected(true);
  };

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please enable location services to create a post."
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

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

    if (formData.type === "offer" && !formData.price) {
      Alert.alert("Error", "Price is required for offer posts");
      return;
    }

    setLoading(true);

    try {
      const success = await createPost({
        title: formData.title,
        description: formData.description,
        price: formData.price ? Number(formData.price) : undefined,
        type: formData.type,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        category: formData.category,
      });

      if (success) {
        resetForm();
        onClose();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      type: "offer",
      category: "other",
    });
    setTypeSelected(false);
    setLocation(null);
  };

  const handleBack = () => {
    setTypeSelected(false);
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
              <View style={tw`flex-row items-center`}>
                {typeSelected && (
                  <TouchableOpacity onPress={handleBack} style={tw`mr-2`}>
                    <IconButton
                      icon="arrow-left"
                      size={24}
                      iconColor={theme.dark.text.primary}
                      style={tw`m-0`}
                    />
                  </TouchableOpacity>
                )}
                <Text
                  style={tw`text-[${theme.dark.text.primary}] text-lg font-bold`}
                >
                  {!typeSelected ? "What would you like to do?" : "Create Post"}
                </Text>
              </View>
              <IconButton
                icon="close"
                size={24}
                iconColor={theme.dark.text.primary}
                onPress={onClose}
                style={tw`m-0`}
              />
            </View>

            {!typeSelected ? (
              <View style={tw`p-5 pb-10`}>
                <Text
                  style={tw`text-[${theme.dark.text.secondary}] mb-6 text-base`}
                >
                  Select an option to start creating your post
                </Text>
                <TouchableOpacity
                  onPress={() => handleTypeSelection("offer")}
                  style={tw.style(
                    `mb-4 p-6 rounded-xl border border-[${theme.dark.background.border}]`,
                    {
                      backgroundColor: theme.dark.background.glass.background,
                      ...commonStyles.glass,
                    }
                  )}
                >
                  <View style={tw`flex-row items-center mb-2`}>
                    <IconButton
                      icon="hand-heart"
                      size={24}
                      iconColor={theme.dark.brand.primary}
                      style={tw`m-0 p-0 mr-2`}
                    />
                    <Text
                      style={tw`text-[${theme.dark.text.primary}] text-lg font-medium`}
                    >
                      Offer
                    </Text>
                  </View>
                  <Text style={tw`text-[${theme.dark.text.secondary}]`}>
                    I want to help someone or sell something
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleTypeSelection("request")}
                  style={tw.style(
                    `p-6 rounded-xl border border-[${theme.dark.background.border}]`,
                    {
                      backgroundColor: theme.dark.background.glass.background,
                      ...commonStyles.glass,
                    }
                  )}
                >
                  <View style={tw`flex-row items-center mb-2`}>
                    <IconButton
                      icon="hand-wave"
                      size={24}
                      iconColor={theme.dark.brand.primary}
                      style={tw`m-0 p-0 mr-2`}
                    />
                    <Text
                      style={tw`text-[${theme.dark.text.primary}] text-lg font-medium`}
                    >
                      Request
                    </Text>
                  </View>
                  <Text style={tw`text-[${theme.dark.text.secondary}]`}>
                    I need help or want to buy something
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView
                style={tw`max-h-[90%]`}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <View style={tw`p-5 pb-2`}>
                  <View style={tw`mb-5`}>
                    <View style={tw`flex-row items-center mb-4`}>
                      <IconButton
                        icon={
                          formData.type === "offer" ? "hand-heart" : "hand-wave"
                        }
                        size={24}
                        iconColor={theme.dark.brand.primary}
                        style={tw`m-0 p-0 mr-2`}
                      />
                      <Text
                        style={tw`text-[${theme.dark.text.primary}] text-lg font-medium`}
                      >
                        {formData.type === "offer"
                          ? "Offering Help/Service"
                          : "Requesting Help/Service"}
                      </Text>
                    </View>
                  </View>

                  <View style={tw`mb-3`}>
                    <Text
                      style={tw`text-[${theme.dark.text.secondary}] mb-1 text-sm`}
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

                  <View style={tw`mb-3`}>
                    <Text
                      style={tw`text-[${theme.dark.text.secondary}] mb-1 text-sm`}
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

                  {formData.type === "offer" && (
                    <View style={tw`mb-3`}>
                      <Text
                        style={tw`text-[${theme.dark.text.secondary}] mb-1 text-sm`}
                      >
                        Set your price *
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
                        You must set a price for offers. Enter 0 for free
                        items/services.
                      </Text>
                    </View>
                  )}

                  <View style={tw`mb-1`}>
                    <Text
                      style={tw`text-[${theme.dark.text.secondary}] mb-1 text-sm`}
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
                            onPress={() =>
                              setFormData({ ...formData, category })
                            }
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

                  <View style={tw`mb-3`}>
                    <Text
                      style={tw`text-[${theme.dark.text.secondary}] mb-1 text-sm`}
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

                  <View style={tw`flex-row justify-between mb-1 mt-2`}>
                    <Button
                      mode="outlined"
                      onPress={handleBack}
                      style={tw`flex-1 mr-3 border-[${theme.dark.background.border}] rounded-xl`}
                      labelStyle={tw`text-[${theme.dark.text.primary}]`}
                      contentStyle={tw`py-1`}
                    >
                      Back
                    </Button>
                    <Button
                      mode="contained"
                      onPress={handleSubmit}
                      loading={loading}
                      disabled={
                        !formData.title ||
                        !formData.description ||
                        (formData.type === "offer" && !formData.price) ||
                        loading
                      }
                      style={tw`flex-1 bg-[${theme.dark.brand.primary}] rounded-xl`}
                      labelStyle={tw`text-white font-semibold`}
                      contentStyle={tw`py-1`}
                    >
                      {loading ? "Creating..." : "Create Post"}
                    </Button>
                  </View>
                  <View style={tw`h-8`} />
                </View>
              </ScrollView>
            )}
          </Surface>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
