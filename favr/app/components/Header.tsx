import React from "react";
import { View, ScrollView } from "react-native";
import { Text, Surface } from "react-native-paper";
import tw from "twrnc";
import { theme } from "../../theme";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";

export default function Header() {
  const categories = [
    "offer",
    "request",
    "community",
    "events",
    "jobs",
    "services",
    "products",
  ];
  return (
    <Surface
      style={tw`bg-[${theme.dark.background.secondary}] border-b border-[${theme.dark.background.border}] h-[112px]`}
    >
      <View style={tw`flex-row items-center justify-between h-1/2 px-4`}>
        <Text style={tw`text-2xl font-bold text-[${theme.dark.text.primary}]`}>
          favr
        </Text>
        <View style={tw`flex-row items-center gap-2`}>
          <MagnifyingGlassIcon size={24} color={theme.dark.text.primary} />
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`gap-2 flex items-center justify-center mx-4`}
      >
        {categories.map((category) => (
          <View
            key={category}
            style={tw`bg-[${theme.dark.button.primary.background}] h-8 px-4 flex items-center justify-center rounded-full`}
          >
            <Text
              style={tw`text-[${theme.dark.button.primary.text}] text-center font-medium capitalize`}
            >
              {category}
            </Text>
          </View>
        ))}
      </ScrollView>
    </Surface>
  );
}
