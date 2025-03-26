import { Stack } from "expo-router";
import { AuthProvider } from "./contexts/AuthContext";
import { PostProvider } from "./contexts/PostContext";

export default function Layout() {
  return (
    <AuthProvider>
      <PostProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
      </PostProvider>
    </AuthProvider>
  );
}
