import React, { useState } from "react";
import { View, ScrollView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Surface, TextInput, IconButton } from "react-native-paper";
import tw from "twrnc";
import { theme, commonStyles } from "../../theme";
import {
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

interface HeaderProps {
  onCategorySelect?: (category: string) => void;
}

export default function Header({ onCategorySelect }: HeaderProps) {
  const categories = ["all", "offerings", "requests"];
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleProfileNavigation = () => {
    router.push("/profile");
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  const HeaderContent = () => (
    <>
      <SafeAreaView edges={["top"]}>
        <View style={tw`px-4 pt-1 pb-0.5`}>
          <View style={tw`flex-row items-center mb-1 relative`}>
            <View style={tw`flex-1 mr-2`}>
              <View
                style={tw.style(
                  `flex-row items-center rounded-xl px-2.5 py-1`,
                  {
                    backgroundColor: theme.dark.background.tertiary,
                    borderWidth: 1,
                    borderColor: theme.dark.background.glass.border,
                  }
                )}
              >
                <MagnifyingGlassIcon
                  size={16}
                  color={theme.dark.text.secondary}
                />
                <TextInput
                  placeholder="Search"
                  placeholderTextColor={theme.dark.text.secondary}
                  style={tw`text-sm text-[${theme.dark.text.primary}] bg-transparent flex-1 ml-1.5 h-6`}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  dense={true}
                />
              </View>
            </View>
            <IconButton
              icon="account-outline"
              size={22}
              iconColor={theme.dark.text.primary}
              onPress={handleProfileNavigation}
              style={tw`m-0 p-0`}
            />
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`gap-2.5 flex items-center mx-4 py-1 pb-2`}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => handleCategoryPress(category)}
          >
            <View
              style={tw.style(`py-1 px-3.5 flex rounded-full`, {
                backgroundColor:
                  selectedCategory === category
                    ? theme.dark.brand.primary
                    : theme.dark.button.primary.background,
                borderWidth: 1,
                borderColor: theme.dark.background.glass.border,
                ...commonStyles.glass,
              })}
            >
              <Text
                style={tw`text-[${
                  selectedCategory === category
                    ? theme.dark.text.primary
                    : theme.dark.button.primary.text
                }] text-center text-xs font-medium capitalize`}
              >
                {category}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );

  return (
    <View
      style={tw.style(`absolute top-0 left-0 right-0 z-20`, {
        borderBottomWidth: 1,
        borderBottomColor: theme.dark.background.glass.border,
      })}
    >
      {Platform.OS === "ios" ? (
        <BlurView
          tint="dark"
          intensity={70}
          style={tw.style(`w-full overflow-hidden`, {
            ...commonStyles.glass,
          })}
        >
          <HeaderContent />
        </BlurView>
      ) : (
        <Surface
          style={tw.style(`bg-[${theme.dark.background.glass.background}]`, {
            ...commonStyles.glass,
          })}
        >
          <HeaderContent />
        </Surface>
      )}
    </View>
  );
}
