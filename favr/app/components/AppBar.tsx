import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router, usePathname } from "expo-router";
import tw from "twrnc";
import { HomeIcon, UserIcon, PlusIcon } from "react-native-heroicons/outline";
import { theme } from "../../theme";

export default function AppBar() {
  const pathname = usePathname();

  return (
    <View style={tw`relative bg-[${theme.dark.background.secondary}] h-[64px]`}>
      <TouchableOpacity
        onPress={() => router.replace("/create")}
        style={tw`absolute -top-6 left-1/2 z-10 -ml-8`}
      >
        <View
          style={tw`bg-[${theme.dark.brand.primary}] w-16 h-16 rounded-full items-center justify-center shadow-lg`}
        >
          <PlusIcon size={32} color={theme.dark.text.primary} />
        </View>
      </TouchableOpacity>

      <View
        style={tw`flex-row items-center justify-between h-full px-12 border-t border-[${theme.dark.background.border}]`}
      >
        <TouchableOpacity
          onPress={() => router.replace("/")}
          style={tw`items-center`}
        >
          <HomeIcon
            size={24}
            color={
              pathname === "/"
                ? theme.dark.brand.primary
                : theme.dark.text.secondary
            }
          />
          <Text
            style={tw`text-xs mt-1 font-medium text-[${
              pathname === "/"
                ? theme.dark.brand.primary
                : theme.dark.text.secondary
            }]`}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/profile")}
          style={tw`items-center`}
        >
          <UserIcon
            size={24}
            color={
              pathname === "/profile"
                ? theme.dark.brand.primary
                : theme.dark.text.secondary
            }
          />
          <Text
            style={tw`text-xs mt-1 font-medium text-[${
              pathname === "/profile"
                ? theme.dark.brand.primary
                : theme.dark.text.secondary
            }]`}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
