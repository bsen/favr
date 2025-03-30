import React, { useEffect, useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Surface } from "react-native-paper";
import tw from "twrnc";
import { theme, commonStyles } from "../../theme";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { BlurView } from "expo-blur";

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

  const HeaderContent = () => (
    <>
      <SafeAreaView edges={["top"]}>
        <View style={tw`flex-row items-center justify-between py-2 px-4`}>
          <Text style={tw`text-xl font-bold text-[${theme.dark.text.primary}]`}>
            favr
          </Text>
          <View style={tw`flex-row items-center gap-2`}>
            <MagnifyingGlassIcon size={20} color={theme.dark.text.primary} />
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`gap-2 flex items-center mx-4 py-2 pb-3`}
      >
        {categories.map((category) => (
          <View
            key={category}
            style={tw.style(`py-1 px-4 flex rounded-full`, {
              backgroundColor: theme.dark.button.primary.background,
              borderWidth: 1,
              borderColor: theme.dark.background.glass.border,
              ...commonStyles.glass,
            })}
          >
            <Text
              style={tw`text-[${theme.dark.button.primary.text}] text-center text-sm font-medium capitalize`}
            >
              {category}
            </Text>
          </View>
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
