import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { IconButton, Surface } from "react-native-paper";
import { router, usePathname } from "expo-router";
import tw from "twrnc";
import { theme, commonStyles } from "../../theme";
import { BlurView } from "expo-blur";

type AppRoute = "/" | "/posts";

interface AppBarProps {
  onCreatePress: () => void;
}

export default function AppBar({ onCreatePress }: AppBarProps) {
  const pathname = usePathname();

  const handleNavigation = (route: AppRoute) => {
    router.push(route as any);
  };

  const AppBarContent = () => (
    <View style={tw`flex-row items-center justify-around py-3 px-6`}>
      <TouchableOpacity onPress={() => handleNavigation("/")}>
        <IconButton
          icon="home-outline"
          size={24}
          iconColor={
            pathname === "/"
              ? theme.dark.brand.primary
              : theme.dark.text.secondary
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={tw.style(
          `bg-[${theme.dark.brand.primary}] rounded-full p-1 mb-2`
        )}
        onPress={onCreatePress}
      >
        <IconButton icon="plus" size={24} iconColor="white" style={tw`m-0`} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigation("/posts")}>
        <IconButton
          icon="clipboard-text-outline"
          size={24}
          iconColor={
            pathname === "/posts"
              ? theme.dark.brand.primary
              : theme.dark.text.secondary
          }
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={tw.style(`absolute bottom-0 left-0 right-0`, {
        borderTopWidth: 1,
        borderTopColor: theme.dark.background.glass.border,
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
          <AppBarContent />
        </BlurView>
      ) : (
        <Surface
          style={tw.style(`bg-[${theme.dark.background.glass.background}]`, {
            ...commonStyles.glass,
          })}
        >
          <AppBarContent />
        </Surface>
      )}
    </View>
  );
}
