import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Text, Surface, TextInput, IconButton } from "react-native-paper";
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
  fullScreen?: boolean;
  location?: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  setLocation?: (location: any) => void;
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
  fullScreen = false,
  location,
  setLocation,
}: UserModalProps) {
  const [successMessage, setSuccessMessage] = useState("");
  const [tempLocation, setTempLocation] = useState(
    location || {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    }
  );

  useEffect(() => {
    if (location) {
      setTempLocation(location);
    }
  }, [location]);

  useEffect(() => {
    if (!show) {
      setSuccessMessage("");
    }
  }, [show]);

  const handleSubmit = async () => {
    if (type === "name" && onSubmit) {
      setSuccessMessage("Name updated successfully!");
      await onSubmit();
    } else if (type === "location" && setLocation) {
      setLocation(tempLocation);
      if (onSubmit) {
        await onSubmit();
      }
    }
  };

  const handleGetLocation = async () => {
    if (onGetLocation) {
      await onGetLocation();
    }
  };

  const modalContent = (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1`}
    >
      <View style={tw`flex-1 justify-end bg-black bg-opacity-70`}>
        <Surface
          style={tw.style(`rounded-t-3xl overflow-hidden`, {
            backgroundColor: theme.dark.background.secondary,
            borderTopWidth: 1,
            borderColor: theme.dark.background.border,
            ...commonStyles.glass,
          })}
        >
          <View
            style={tw`flex-row justify-between items-center py-4 px-5 border-b border-[${theme.dark.background.border}]`}
          >
            <Text
              style={tw`text-[${theme.dark.text.primary}] text-lg font-bold`}
            >
              {type === "name" ? "Update Name" : "Set Your Location"}
            </Text>
            {!fullScreen && (
              <IconButton
                icon="close"
                size={24}
                iconColor={theme.dark.text.primary}
                onPress={onClose}
                style={tw`m-0`}
              />
            )}
          </View>

          <ScrollView
            style={tw`max-h-[80%]`}
            keyboardShouldPersistTaps="handled"
          >
            <View style={tw`p-5 pb-10`}>
              {type === "name" ? (
                <View>
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                  >
                    Enter your name
                  </Text>
                  <TextInput
                    label="Your Name"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={tw`bg-[${theme.dark.background.tertiary}] rounded-xl`}
                    outlineColor="transparent"
                    activeOutlineColor={theme.dark.brand.primary}
                    textColor={theme.dark.text.primary}
                    editable={!successMessage && !loading}
                  />
                </View>
              ) : (
                <View>
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] mb-6 text-base`}
                  >
                    We need your location to show you nearby posts and help you
                    connect with others in your area.
                  </Text>
                  {locationError && (
                    <Text
                      style={tw`text-[${theme.dark.brand.error.text}] mb-4`}
                    >
                      {locationError}
                    </Text>
                  )}
                  <View style={tw`space-y-4`}>
                    <View>
                      <Text
                        style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                      >
                        Street Address
                      </Text>
                      <TextInput
                        value={tempLocation.address}
                        onChangeText={(text) =>
                          setTempLocation((prev) => ({
                            ...prev,
                            address: text,
                          }))
                        }
                        mode="outlined"
                        style={tw`bg-[${theme.dark.background.tertiary}] rounded-xl`}
                        outlineColor="transparent"
                        activeOutlineColor={theme.dark.brand.primary}
                        textColor={theme.dark.text.primary}
                      />
                    </View>
                    <View>
                      <Text
                        style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                      >
                        City
                      </Text>
                      <TextInput
                        value={tempLocation.city}
                        onChangeText={(text) =>
                          setTempLocation((prev) => ({ ...prev, city: text }))
                        }
                        mode="outlined"
                        style={tw`bg-[${theme.dark.background.tertiary}] rounded-xl`}
                        outlineColor="transparent"
                        activeOutlineColor={theme.dark.brand.primary}
                        textColor={theme.dark.text.primary}
                      />
                    </View>
                    <View>
                      <Text
                        style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                      >
                        State
                      </Text>
                      <TextInput
                        value={tempLocation.state}
                        onChangeText={(text) =>
                          setTempLocation((prev) => ({ ...prev, state: text }))
                        }
                        mode="outlined"
                        style={tw`bg-[${theme.dark.background.tertiary}] rounded-xl`}
                        outlineColor="transparent"
                        activeOutlineColor={theme.dark.brand.primary}
                        textColor={theme.dark.text.primary}
                      />
                    </View>
                    <View>
                      <Text
                        style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                      >
                        Postal Code
                      </Text>
                      <TextInput
                        value={tempLocation.postalCode}
                        onChangeText={(text) =>
                          setTempLocation((prev) => ({
                            ...prev,
                            postalCode: text,
                          }))
                        }
                        mode="outlined"
                        style={tw`bg-[${theme.dark.background.tertiary}] rounded-xl`}
                        outlineColor="transparent"
                        activeOutlineColor={theme.dark.brand.primary}
                        textColor={theme.dark.text.primary}
                      />
                    </View>
                    <View>
                      <Text
                        style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                      >
                        Country
                      </Text>
                      <TextInput
                        value={tempLocation.country}
                        onChangeText={(text) =>
                          setTempLocation((prev) => ({
                            ...prev,
                            country: text,
                          }))
                        }
                        mode="outlined"
                        style={tw`bg-[${theme.dark.background.tertiary}] rounded-xl`}
                        outlineColor="transparent"
                        activeOutlineColor={theme.dark.brand.primary}
                        textColor={theme.dark.text.primary}
                      />
                    </View>
                  </View>
                </View>
              )}

              <View style={tw`flex-row justify-between mt-8`}>
                {!fullScreen && (
                  <TouchableOpacity
                    onPress={onClose}
                    style={tw.style(
                      `flex-1 mr-3 py-2 rounded-xl border border-[${theme.dark.background.border}]`
                    )}
                  >
                    <Text
                      style={tw`text-[${theme.dark.text.primary}] font-medium text-center`}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={onGetLocation}
                  style={tw.style(`flex-1 mr-3 py-2 rounded-xl`, {
                    backgroundColor: theme.dark.brand.primary,
                  })}
                >
                  <Text style={tw`text-white font-medium text-center`}>
                    {loading ? "Getting Location..." : "Use Current Location"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading}
                  style={tw.style(`flex-1 py-2 rounded-xl`, {
                    backgroundColor: theme.dark.brand.primary,
                    opacity: loading ? 0.7 : 1,
                  })}
                >
                  <Text style={tw`text-white font-medium text-center`}>
                    {loading ? "Saving..." : "Save Location"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Surface>
      </View>
    </KeyboardAvoidingView>
  );

  if (fullScreen) {
    return (
      <Modal
        visible={show}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {modalContent}
      </Modal>
    );
  }

  return modalContent;
}
