import { PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
