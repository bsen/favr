import { Stack, usePathname } from "expo-router";
import { AuthProvider } from "./contexts/AuthContext";
import { PostProvider } from "./contexts/PostContext";
import { View } from "react-native";
import tw from "twrnc";
import Header from "./components/Header";
import AppBar from "./components/AppBar";

export default function Layout() {
  const pathname = usePathname();
  const isLoginScreen = pathname === "/login";
  const shouldShowHeader = pathname === "/";

  if (isLoginScreen) {
    return (
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <PostProvider>
        <View style={tw`flex-1`}>
          {shouldShowHeader && <Header />}
          <View style={tw`flex-1`}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="profile" options={{ headerShown: false }} />
              <Stack.Screen name="create" options={{ headerShown: false }} />
            </Stack>
          </View>
          <AppBar />
        </View>
      </PostProvider>
    </AuthProvider>
  );
}
