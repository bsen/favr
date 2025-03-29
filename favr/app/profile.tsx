import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
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
import NameModal from "./components/NameModal";
import LocationModal from "./components/LocationModal";
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
      setShowNameModal(false);
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

        await updateLocation(locationData);
        setShowLocationModal(false);
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
      <Surface style={tw`bg-[${theme.dark.background.primary}] p-4`}>
        <Text style={tw`text-xl font-bold text-white`}>Profile</Text>
      </Surface>

      <ScrollView>
        <Surface
          style={tw`mx-4 mt-2 bg-[${theme.dark.background.secondary}] rounded-3xl overflow-hidden`}
        >
          <TouchableOpacity
            onPress={() => setShowNameModal(true)}
            style={tw`p-6 flex-row items-center`}
          >
            <Avatar.Text
              size={72}
              label={(userData?.name || "Guest")
                .split(" ")
                .map((n) => n[0])
                .join("")}
              style={tw`bg-[${theme.dark.brand.primary}]`}
            />
            <View style={tw`ml-4 flex-1`}>
              <Text
                style={tw`text-[${theme.dark.text.primary}] text-xl font-semibold mb-1`}
              >
                {userData?.name || "Guest"}
              </Text>
              <Text style={tw`text-[${theme.dark.text.secondary}]`}>
                {userData?.phone || "No phone number"}
              </Text>
            </View>
          </TouchableOpacity>

          {userData?.location && (
            <TouchableOpacity
              onPress={() => setShowLocationModal(true)}
              style={tw`px-6 py-5 border-t border-[${theme.dark.background.border}]`}
            >
              <View style={tw`flex-row items-center mb-2`}>
                <IconButton
                  icon="map-marker"
                  size={24}
                  iconColor={theme.dark.brand.primary}
                  style={tw`m-0 p-0 mr-2`}
                />
                <Text style={tw`text-[${theme.dark.text.primary}] font-medium`}>
                  Current Location
                </Text>
              </View>
              <View style={tw`ml-9`}>
                <Text
                  style={tw`text-[${theme.dark.text.secondary}] mb-1 leading-5`}
                >
                  {userData.location.address}
                </Text>
                <Text
                  style={tw`text-[${theme.dark.text.secondary}] mb-1 leading-5`}
                >
                  {userData.location.city}, {userData.location.state}{" "}
                  {userData.location.postalCode}
                </Text>
                <Text style={tw`text-[${theme.dark.text.secondary}] leading-5`}>
                  {userData.location.country}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </Surface>

        <Surface
          style={tw`mx-4 mt-4 bg-[${theme.dark.background.secondary}] rounded-3xl overflow-hidden`}
        >
          <TouchableOpacity
            onPress={() => setShowNameModal(true)}
            style={tw`flex-row items-center px-6 py-4 border-b border-[${theme.dark.background.border}]`}
          >
            <IconButton
              icon="account-edit"
              size={24}
              iconColor={theme.dark.brand.primary}
              style={tw`m-0 p-0 mr-2`}
            />
            <Text style={tw`text-[${theme.dark.text.primary}]`}>
              Update Name
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowLocationModal(true)}
            style={tw`flex-row items-center px-6 py-4 border-b border-[${theme.dark.background.border}]`}
          >
            <IconButton
              icon="map-marker-plus"
              size={24}
              iconColor={theme.dark.brand.primary}
              style={tw`m-0 p-0 mr-2`}
            />
            <Text style={tw`text-[${theme.dark.text.primary}]`}>
              Update Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={logout}
            style={tw`flex-row items-center px-6 py-4`}
          >
            <IconButton
              icon="logout"
              size={24}
              iconColor={theme.dark.brand.danger}
              style={tw`m-0 p-0 mr-2`}
            />
            <Text style={tw`text-[${theme.dark.brand.danger}]`}>Logout</Text>
          </TouchableOpacity>
        </Surface>
      </ScrollView>

      <NameModal
        show={showNameModal}
        name={tempName}
        setName={setTempName}
        loading={isLoading}
        onSubmit={handleUpdateName}
      />

      <LocationModal
        show={showLocationModal}
        loading={isLoading}
        locationError={locationError}
        onGetLocation={handleUpdateLocation}
      />

      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        duration={3000}
        style={tw`bg-[${theme.dark.brand.error.background}]`}
      >
        {error}
      </Snackbar>

      <Snackbar
        visible={showSuccess}
        onDismiss={() => setShowSuccess(false)}
        duration={3000}
        style={tw`bg-[${theme.dark.brand.primary}]`}
      >
        {success}
      </Snackbar>
    </View>
  );
}
