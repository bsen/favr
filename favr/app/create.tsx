import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, Surface, TextInput, IconButton } from "react-native-paper";
import { router } from "expo-router";
import tw from "twrnc";
import { theme } from "../theme";
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
      router.back();
    }
    setLoading(false);
  };

  return (
    <View style={tw`flex-1 bg-[${theme.dark.background.primary}]`}>
      {/* Header */}
      <Surface
        style={tw`bg-[${theme.dark.background.primary}] p-4 flex-row items-center justify-between`}
      >
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor="white"
          onPress={() => router.back()}
        />
        <Text style={tw`text-xl font-bold text-white`}>Create Post</Text>
        <View style={tw`w-10`} />
      </Surface>

      <ScrollView style={tw`flex-1`}>
        {/* Type Selection */}
        <View style={tw`px-4 pt-2`}>
          <Text
            style={tw`text-[${theme.dark.text.secondary}] text-sm mb-3 font-medium`}
          >
            What would you like to do?
          </Text>
          <View style={tw`flex-row space-x-3 mb-6`}>
            <TouchableOpacity
              onPress={() => setFormData({ ...formData, type: "offer" })}
              style={tw`flex-1 p-4 rounded-2xl flex-row items-center justify-center space-x-2 ${
                formData.type === "offer"
                  ? `bg-[${theme.dark.brand.primary}]`
                  : `bg-[${theme.dark.background.secondary}] border border-[${theme.dark.background.border}]`
              }`}
            >
              <IconButton
                icon="hand-heart"
                size={20}
                iconColor={
                  formData.type === "offer" ? "white" : theme.dark.text.primary
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
              style={tw`flex-1 p-4 rounded-2xl flex-row items-center justify-center space-x-2 ${
                formData.type === "request"
                  ? `bg-[${theme.dark.brand.primary}]`
                  : `bg-[${theme.dark.background.secondary}] border border-[${theme.dark.background.border}]`
              }`}
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
          style={tw`mx-4 bg-[${theme.dark.background.secondary}] rounded-2xl p-6`}
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
              style={tw`bg-[${theme.dark.background.tertiary}]`}
              outlineColor={theme.dark.background.border}
              activeOutlineColor={theme.dark.brand.primary}
              textColor={theme.dark.text.primary}
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
              style={tw`bg-[${theme.dark.background.tertiary}]`}
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
                setFormData({ ...formData, price: value })
              }
              mode="outlined"
              placeholder="0"
              keyboardType="numeric"
              style={tw`bg-[${theme.dark.background.tertiary}]`}
              outlineColor={theme.dark.background.border}
              activeOutlineColor={theme.dark.brand.primary}
              textColor={theme.dark.text.primary}
              left={<TextInput.Affix text="₹" />}
            />
            <Text
              style={tw`text-[${theme.dark.text.secondary}] text-xs mt-1 italic`}
            >
              Leave empty if this is a free service
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={tw`flex-row justify-end space-x-3`}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={tw`px-4 py-3 rounded-full border border-[${theme.dark.background.border}]`}
              disabled={loading}
            >
              <Text style={tw`text-[${theme.dark.text.primary}]`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={tw`px-6 py-3 rounded-full bg-[${theme.dark.brand.primary}] flex-row items-center`}
              disabled={loading}
            >
              <Text style={tw`text-white font-medium`}>
                {loading ? "Creating..." : "Create Post"}
              </Text>
              {!loading && (
                <IconButton
                  icon="arrow-right"
                  size={16}
                  iconColor="white"
                  style={tw`m-0 p-0 ml-1`}
                />
              )}
            </TouchableOpacity>
          </View>
        </Surface>
      </ScrollView>
    </View>
  );
}
