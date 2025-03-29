import React from "react";
import { View } from "react-native";
import { Text, Surface, Button } from "react-native-paper";
import tw from "twrnc";
import { theme } from "../../theme";

interface LocationModalProps {
  show: boolean;
  loading: boolean;
  locationError?: string;
  onGetLocation: () => void;
}

export default function LocationModal({
  show,
  loading,
  locationError,
  onGetLocation,
}: LocationModalProps) {
  if (!show) return null;

  return (
    <View
      style={tw`absolute inset-0 bg-black/50 flex items-center justify-center p-4`}
    >
      <Surface
        style={tw`bg-[${theme.dark.background.secondary}] border border-[${theme.dark.background.border}] rounded-lg p-6 w-full max-w-md`}
      >
        <Text style={tw`text-[${theme.dark.text.primary}] text-xl mb-4`}>
          Location Access Required
        </Text>
        <Text style={tw`text-[${theme.dark.text.secondary}] mb-4`}>
          Please allow access to your location to continue using the app.
        </Text>
        {locationError && (
          <View
            style={tw`bg-[${theme.dark.brand.error.background}] border border-[${theme.dark.brand.error.border}] p-3 rounded-md mb-4`}
          >
            <Text style={tw`text-[${theme.dark.brand.error.text}]`}>
              {locationError}
            </Text>
          </View>
        )}
        <Button
          mode="contained"
          onPress={onGetLocation}
          loading={loading}
          disabled={loading}
          style={tw`bg-[${theme.dark.brand.primary}]`}
        >
          {loading ? "Getting Location..." : "Share Location"}
        </Button>
      </Surface>
    </View>
  );
}
