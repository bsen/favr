import { Tabs, usePathname } from "expo-router";
import { AuthProvider } from "./contexts/AuthContext";
import { PostProvider } from "./contexts/PostContext";
import { View, StatusBar, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import tw from "twrnc";
import Header from "./components/Header";
import AppBar from "./components/AppBar";
import { theme } from "../theme";

export default function Layout() {
  const pathname = usePathname();
  const isLoginScreen = pathname === "/login";

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
          <View
            style={tw.style(`flex-1 bg-[${theme.dark.background.primary}]`, {
              paddingBottom: Platform.OS === "ios" ? 85 : 65,
            })}
          >
            <Tabs
              screenOptions={{
                headerShown: false,
                tabBarStyle: { display: "none" },
              }}
            >
              <Tabs.Screen name="index" />
              <Tabs.Screen name="create" />
              <Tabs.Screen name="profile" />
            </Tabs>
            {pathname === "/" && <Header />}
            <AppBar />
          </View>
        </PostProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
