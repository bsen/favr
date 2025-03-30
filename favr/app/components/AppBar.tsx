import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, usePathname } from "expo-router";
import tw from "twrnc";
import { HomeIcon, UserIcon, PlusIcon } from "react-native-heroicons/outline";
import { theme, commonStyles } from "../../theme";
import { BlurView } from "expo-blur";

type AppRoute = "/" | "/create" | "/profile";

export default function AppBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleNavigation = (path: AppRoute) => {
    if (pathname !== path) {
      router.replace(path);
    }
  };

  const AppBarContent = () => (
    <View style={tw`h-16`}>
      <View style={tw`flex-row items-center justify-between h-full px-4`}>
        <TouchableOpacity
          onPress={() => handleNavigation("/")}
          style={tw`items-center flex-1`}
        >
          <HomeIcon
            size={20}
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
          onPress={() => handleNavigation("/create")}
          style={tw`items-center justify-center flex-1`}
        >
          <View
            style={tw.style(
              `size-10 rounded-full items-center justify-center mb-1`,
              {
                backgroundColor: theme.dark.brand.primary,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 3,
              }
            )}
          >
            <PlusIcon size={24} color="white" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleNavigation("/profile")}
          style={tw`items-center flex-1`}
        >
          <UserIcon
            size={22}
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

  return (
    <View
      style={tw.style(`fixed bottom-0 left-0 right-0 z-10`, {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      })}
    >
      {Platform.OS === "ios" ? (
        <BlurView
          tint="dark"
          intensity={70}
          style={tw.style(`overflow-hidden`, {
            borderTopWidth: 1,
            borderTopColor: theme.dark.background.glass.border,
            ...commonStyles.glass,
            paddingBottom: insets.bottom,
          })}
        >
          <AppBarContent />
        </BlurView>
      ) : (
        <View
          style={tw.style(`overflow-hidden`, {
            backgroundColor: theme.dark.background.glass.background,
            borderTopWidth: 1,
            borderTopColor: theme.dark.background.glass.border,
            ...commonStyles.glass,
          })}
        >
          <AppBarContent />
        </View>
      )}
    </View>
  );
}
