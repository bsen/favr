import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Platform } from "react-native";
import { Text, Surface, TextInput, IconButton } from "react-native-paper";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { theme, commonStyles } from "../theme";
import { usePost } from "./contexts/PostContext";

export default function CreatePost() {
  const { createPost } = usePost();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "offer" as "offer" | "request",
  });

  const handleSubmit = async () => {
    setLoading(true);
    const success = await createPost({
      ...formData,
      price: formData.price ? Number(formData.price) : 0,
    });

    if (success) {
      router.push("/");
    }
    setLoading(false);
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <View style={tw`flex-1 bg-[${theme.dark.background.primary}]`}>
      <SafeAreaView style={tw`flex-1`}>
        {/* Header */}
        <Surface
          style={tw.style(
            `bg-[${theme.dark.background.glass.background}] py-4 px-4 flex-row items-center justify-between`,
            {
              borderBottomWidth: 1,
              borderBottomColor: theme.dark.background.glass.border,
              ...commonStyles.glass,
            }
          )}
        >
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={theme.dark.text.primary}
            onPress={handleCancel}
          />
          <Text style={tw`text-xl font-bold text-[${theme.dark.text.primary}]`}>
            Create Post
          </Text>
          <View style={tw`w-10`} />
        </Surface>

        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-8 pt-4`}
          showsVerticalScrollIndicator={false}
        >
          {/* Type Selection */}
          <View style={tw`px-5 pt-2`}>
            <Text
              style={tw`text-[${theme.dark.text.secondary}] text-sm mb-3 font-medium`}
            >
              What would you like to do?
            </Text>
            <View style={tw`flex-row space-x-3 mb-8`}>
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, type: "offer" })}
                style={tw.style(
                  `flex-1 p-4 rounded-2xl flex-row items-center justify-center space-x-2`,
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
                  size={20}
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
                  Offer Help
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFormData({ ...formData, type: "request" })}
                style={tw.style(
                  `flex-1 p-4 rounded-2xl flex-row items-center justify-center space-x-2`,
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
                  size={20}
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
                  Request Help
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Surface
            style={tw.style(`mx-5 rounded-2xl p-6`, {
              backgroundColor: theme.dark.background.glass.background,
              borderWidth: 1,
              borderColor: theme.dark.background.glass.border,
              ...commonStyles.glass,
            })}
          >
            {/* Title Input */}
            <View style={tw`mb-6`}>
              <Text
                style={tw`text-[${theme.dark.text.secondary}] text-sm mb-2 font-medium`}
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
                style={tw.style(`bg-transparent`, {
                  backgroundColor: theme.dark.background.tertiary,
                })}
                outlineColor={theme.dark.background.border}
                activeOutlineColor={theme.dark.brand.primary}
                textColor={theme.dark.text.primary}
                dense
              />
            </View>

            {/* Description Input */}
            <View style={tw`mb-6`}>
              <Text
                style={tw`text-[${theme.dark.text.secondary}] text-sm mb-2 font-medium`}
              >
                Tell us more about it
              </Text>
              <TextInput
                value={formData.description}
                onChangeText={(value) =>
                  setFormData({ ...formData, description: value })
                }
                mode="outlined"
                placeholder="Provide details to help others understand better"
                multiline
                numberOfLines={4}
                style={tw.style(`bg-transparent`, {
                  backgroundColor: theme.dark.background.tertiary,
                  minHeight: 100,
                })}
                outlineColor={theme.dark.background.border}
                activeOutlineColor={theme.dark.brand.primary}
                textColor={theme.dark.text.primary}
              />
            </View>

            {/* Price Input */}
            <View style={tw`mb-8`}>
              <Text
                style={tw`text-[${theme.dark.text.secondary}] text-sm mb-2 font-medium`}
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
                mode="outlined"
                placeholder="0"
                keyboardType="numeric"
                style={tw.style(`bg-transparent`, {
                  backgroundColor: theme.dark.background.tertiary,
                })}
                outlineColor={theme.dark.background.border}
                activeOutlineColor={theme.dark.brand.primary}
                textColor={theme.dark.text.primary}
                left={<TextInput.Affix text="₹" />}
                dense
              />
              <Text
                style={tw`text-[${theme.dark.text.secondary}] text-xs mt-1 italic`}
              >
                Leave empty if this is a free service
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={tw`flex-row justify-end items-center space-x-4`}>
              <TouchableOpacity
                onPress={handleCancel}
                style={tw.style(`px-5 py-2.5 rounded-full`, {
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: theme.dark.background.glass.border,
                })}
                disabled={loading}
              >
                <Text style={tw`text-[${theme.dark.text.primary}] font-medium`}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                style={tw.style(
                  `px-5 py-2.5 rounded-full flex-row items-center justify-center`,
                  {
                    backgroundColor: theme.dark.brand.primary,
                  }
                )}
                disabled={loading}
              >
                <Text style={tw`text-white font-medium mr-1`}>
                  {loading ? "Creating..." : "Create Post"}
                </Text>
                {!loading && (
                  <IconButton
                    icon="arrow-right"
                    size={16}
                    iconColor="white"
                    style={tw`m-0 p-0`}
                  />
                )}
              </TouchableOpacity>
            </View>
          </Surface>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
