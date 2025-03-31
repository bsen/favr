import { Tabs, usePathname } from "expo-router";
import { AuthProvider } from "./contexts/AuthContext";
import { PostProvider } from "./contexts/PostContext";
import { View, StatusBar, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import tw from "twrnc";
import Header from "./components/Header";
import AppBar from "./components/AppBar";
import { theme } from "../theme";
import React, { useState } from "react";
import CreatePostModal from "./components/PostModal";

export default function Layout() {
  const pathname = usePathname();
  const isLoginScreen = pathname === "/login";
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);

  const showCreatePostModal = () => {
    setCreatePostModalVisible(true);
  };

  const closeCreatePostModal = () => {
    setCreatePostModalVisible(false);
  };

  if (isLoginScreen) {
    return (
      <AuthProvider>
        <PostProvider>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: { display: "none" },
            }}
          >
            <Tabs.Screen name="login" options={{ headerShown: false }} />
          </Tabs>
        </PostProvider>
      </AuthProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthProvider>
        <PostProvider>
          <View style={tw`flex-1 bg-[${theme.dark.background.primary}]`}>
            <Tabs
              screenOptions={{
                headerShown: false,
                tabBarStyle: { display: "none" },
              }}
            >
              <Tabs.Screen name="index" />
              <Tabs.Screen name="profile" />
            </Tabs>
            {pathname === "/" && <Header />}
            <AppBar onCreatePress={showCreatePostModal} />
            <CreatePostModal
              visible={createPostModalVisible}
              onClose={closeCreatePostModal}
            />
          </View>
        </PostProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
