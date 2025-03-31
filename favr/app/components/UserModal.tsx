import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, Surface, TextInput, Button } from "react-native-paper";
import tw from "twrnc";
import { theme, commonStyles } from "../../theme";

interface UserModalProps {
  type: "name" | "location";
  show: boolean;
  name?: string;
  setName?: (name: string) => void;
  loading?: boolean;
  locationError?: string;
  onSubmit?: () => void;
  onGetLocation?: () => void;
  onClose?: () => void;
}

export default function UserModal({
  type,
  show,
  name = "",
  setName,
  loading = false,
  locationError,
  onSubmit,
  onGetLocation,
  onClose,
}: UserModalProps) {
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    if (type === "name" && onSubmit) {
      setSuccessMessage("Name updated successfully!");
      await onSubmit();
    }
  };

  const handleGetLocation = async () => {
    if (onGetLocation) {
      setSuccessMessage("Location updated successfully!");
      await onGetLocation();
    }
  };

  useEffect(() => {
    if (!show) {
      setSuccessMessage("");
    }
  }, [show]);

  return (
    <Surface
      style={tw.style(`rounded-2xl overflow-hidden p-5`, {
        backgroundColor: theme.dark.background.primary,
        borderWidth: 1,
        borderColor: theme.dark.background.border,
        ...commonStyles.glass,
      })}
    >
      <Text
        style={tw`text-[${theme.dark.text.primary}] text-lg font-bold mb-4`}
      >
        {type === "name" ? "Update Name" : "Update Location"}
      </Text>

      {type === "name" ? (
        <View>
          <TextInput
            label="Your Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={tw`mb-4 bg-[${theme.dark.background.tertiary}]`}
            outlineColor={theme.dark.background.border}
            activeOutlineColor={theme.dark.brand.primary}
            textColor={theme.dark.text.primary}
            editable={!successMessage && !loading}
          />
        </View>
      ) : (
        <View>
          <Text style={tw`text-[${theme.dark.text.secondary}] mb-4`}>
            We'll use your current location. Make sure location services are
            enabled.
          </Text>
          {locationError && (
            <Text style={tw`text-[${theme.dark.brand.error.text}] mb-4`}>
              {locationError}
            </Text>
          )}
        </View>
      )}

      {successMessage ? (
        <View style={tw`py-2 px-4 bg-[${theme.dark.brand.primary}] rounded-xl`}>
          <Text style={tw`text-white text-center font-medium`}>
            {successMessage}
          </Text>
        </View>
      ) : (
        <View style={tw`flex-row justify-end space-x-3`}>
          <Button
            mode="outlined"
            onPress={onClose}
            style={tw`border-[${theme.dark.background.border}]`}
            labelStyle={tw`text-[${theme.dark.text.primary}]`}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={type === "name" ? handleSubmit : handleGetLocation}
            loading={loading}
            disabled={loading || (type === "name" && !name)}
            style={tw`bg-[${theme.dark.brand.primary}]`}
          >
            {loading
              ? "Processing..."
              : type === "name"
              ? "Save Name"
              : "Get Location"}
          </Button>
        </View>
      )}
    </Surface>
  );
}
