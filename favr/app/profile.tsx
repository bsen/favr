import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Text,
  Surface,
  Avatar,
  Button,
  IconButton,
  ActivityIndicator,
  Snackbar,
} from "react-native-paper";
import tw from "twrnc";
import { useAuth } from "./contexts/AuthContext";
import UserModal from "./components/UserModal";
import * as Location from "expo-location";
import { theme, commonStyles } from "../theme";

export default function Profile() {
  const {
    userData,
    isLoading,
    error,
    success,
    updateName,
    updateLocation,
    fetchUserDetails,
    logout,
    clearMessages,
  } = useAuth();
  const [showNameModal, setShowNameModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempName, setTempName] = useState(userData?.name || "Guest");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [locationError, setLocationError] = useState<string>();

  useEffect(() => {
    fetchUserDetails();
    clearMessages?.();
  }, []);

  useEffect(() => {
    if (error) setShowError(true);
    if (success) setShowSuccess(true);
  }, [error, success]);

  const handleUpdateName = async () => {
    const success = await updateName(tempName);
    if (success) {
      setTimeout(() => {
        setShowNameModal(false);
      }, 3000);
    }
  };

  const handleUpdateLocation = async () => {
    try {
      setLocationError(undefined);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address[0]) {
        const locationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: address[0].street || "",
          city: address[0].city || "",
          state: address[0].region || "",
          postalCode: address[0].postalCode || "",
          country: address[0].country || "",
        };

        const success = await updateLocation(locationData);
        if (success) {
          setTimeout(() => {
            setShowLocationModal(false);
          }, 3000);
        }
      }
    } catch (error) {
      setLocationError("Failed to get location");
      console.error("Error updating location:", error);
    }
  };

  if (isLoading && !userData) {
    return (
      <View
        style={tw`flex-1 bg-[${theme.dark.background.primary}] justify-center items-center`}
      >
        <ActivityIndicator size="large" color={theme.dark.brand.primary} />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-[${theme.dark.background.primary}]`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-36 pt-16`}
        showsVerticalScrollIndicator={false}
      >
        <Surface
          style={tw.style(`mx-5 rounded-2xl overflow-hidden`, {
            backgroundColor: theme.dark.background.glass.background,
            borderWidth: 1,
            borderColor: theme.dark.background.glass.border,
            ...commonStyles.glass,
          })}
        >
          <TouchableOpacity
            onPress={() => setShowNameModal(true)}
            style={tw`p-6 flex-row items-center`}
          >
            <Avatar.Text
              size={70}
              label={(userData?.name || "Guest")
                .split(" ")
                .map((n) => n[0])
                .join("")}
              style={tw`bg-[${theme.dark.brand.primary}]`}
            />
            <View style={tw`ml-5 flex-1`}>
              <Text
                style={tw`text-[${theme.dark.text.primary}] text-xl font-semibold mb-1`}
              >
                {userData?.name || "Guest"}
              </Text>
              <Text style={tw`text-[${theme.dark.text.secondary}]`}>
                {userData?.phone || "No phone number"}
              </Text>
            </View>
            <IconButton
              icon="pencil"
              size={20}
              iconColor={theme.dark.text.secondary}
              onPress={() => setShowNameModal(true)}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowLocationModal(true)}
            style={tw`px-6 py-4 border-t border-[${theme.dark.background.border}]`}
          >
            <View style={tw`flex-row items-center justify-between mb-2`}>
              <View style={tw`flex-row items-center`}>
                <IconButton
                  icon="map-marker"
                  size={22}
                  iconColor={theme.dark.brand.primary}
                  style={tw`m-0 p-0 mr-2`}
                />
                <Text style={tw`text-[${theme.dark.text.primary}] font-medium`}>
                  {userData?.location ? "Current Location" : "Add Location"}
                </Text>
              </View>
              <IconButton
                icon="pencil"
                size={18}
                iconColor={theme.dark.text.secondary}
                onPress={() => setShowLocationModal(true)}
              />
            </View>
            {userData?.location ? (
              <View style={tw`ml-9`}>
                <Text
                  style={tw`text-[${theme.dark.text.secondary}] mb-1 leading-5 text-sm`}
                >
                  {userData.location.address}
                </Text>
                <Text
                  style={tw`text-[${theme.dark.text.secondary}] mb-1 leading-5 text-sm`}
                >
                  {userData.location.city}, {userData.location.state}{" "}
                  {userData.location.postalCode}
                </Text>
                <Text
                  style={tw`text-[${theme.dark.text.secondary}] leading-5 text-sm`}
                >
                  {userData.location.country}
                </Text>
              </View>
            ) : (
              <View style={tw`ml-9`}>
                <Text style={tw`text-[${theme.dark.text.secondary}] text-sm`}>
                  No location set. Tap to add your location.
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Surface>
        <Surface
          style={tw.style(`mx-5 mt-5 rounded-2xl overflow-hidden`, {
            backgroundColor: theme.dark.background.glass.background,
            borderWidth: 1,
            borderColor: theme.dark.background.glass.border,
            ...commonStyles.glass,
          })}
        >
          <TouchableOpacity
            onPress={logout}
            style={tw`flex-row items-center px-6 py-3.5`}
          >
            <IconButton
              icon="logout"
              size={20}
              iconColor={theme.dark.brand.danger}
              style={tw`m-0 p-0 mr-3`}
            />
            <Text style={tw`text-[${theme.dark.brand.danger}] font-medium`}>
              Logout
            </Text>
          </TouchableOpacity>
        </Surface>

        <Text
          style={tw`text-center text-[${theme.dark.text.secondary}] text-xs mt-8 mb-6`}
        >
          Favr v1.0.0
        </Text>
      </ScrollView>

      <Modal
        visible={showNameModal}
        transparent={true}
        onRequestClose={() => setShowNameModal(false)}
        animationType="fade"
      >
        <TouchableWithoutFeedback onPress={() => setShowNameModal(false)}>
          <View
            style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
          >
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={tw`w-10/12`}>
                <UserModal
                  type="name"
                  show={showNameModal}
                  name={tempName}
                  setName={setTempName}
                  loading={isLoading}
                  onSubmit={handleUpdateName}
                  onClose={() => setShowNameModal(false)}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={showLocationModal}
        transparent={true}
        onRequestClose={() => setShowLocationModal(false)}
        animationType="fade"
      >
        <TouchableWithoutFeedback onPress={() => setShowLocationModal(false)}>
          <View
            style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
          >
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={tw`w-10/12`}>
                <UserModal
                  type="location"
                  show={showLocationModal}
                  loading={isLoading}
                  locationError={locationError}
                  onGetLocation={handleUpdateLocation}
                  onClose={() => setShowLocationModal(false)}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
