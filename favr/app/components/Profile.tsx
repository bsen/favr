import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Text, Button, TextInput, Surface } from "react-native-paper";
import tw from "twrnc";
import { useAuth } from "../contexts/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Profile() {
  const {
    isAuthenticated,
    isLoading,
    error,
    success,
    logout,
    userData,
    updateName,
    updateLocation,
  } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userData?.name || "");

  const handleUpdateName = async () => {
    if (newName.trim()) {
      const success = await updateName(newName);
      if (success) {
        setIsEditingName(false);
      }
    }
  };

  const handleGetLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await updateLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-[#121212] p-4`}>
      <Surface style={tw`bg-[#1e1e1e] rounded-xl p-6 mb-4`}>
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <View>
            <Text style={tw`text-gray-400 text-sm mb-1`}>Name</Text>
            {isEditingName ? (
              <View style={tw`flex-row items-center`}>
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  mode="outlined"
                  style={tw`flex-1 bg-[#2a2a2a] mr-2`}
                  outlineColor="#3a3a3a"
                  activeOutlineColor="#22c55e"
                  textColor="white"
                />
                <Button
                  mode="contained"
                  onPress={handleUpdateName}
                  loading={isLoading}
                  style={tw`bg-[#22c55e]`}
                >
                  Save
                </Button>
              </View>
            ) : (
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-white text-lg mr-2`}>
                  {userData?.name || "Set your name"}
                </Text>
                <Button
                  mode="text"
                  onPress={() => setIsEditingName(true)}
                  textColor="#22c55e"
                >
                  Edit
                </Button>
              </View>
            )}
          </View>
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-400 text-sm mb-1`}>Location</Text>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-white flex-1`}>
              {userData?.location?.address || "Set your location"}
            </Text>
            <Button
              mode="outlined"
              onPress={handleGetLocation}
              loading={isLoading}
              style={tw`border-[#22c55e]`}
              textColor="#22c55e"
            >
              Update Location
            </Button>
          </View>
        </View>

        {error && <Text style={tw`text-red-500 mb-4`}>{error}</Text>}
        {success && <Text style={tw`text-green-500 mb-4`}>{success}</Text>}
      </Surface>

      <Button
        mode="contained"
        onPress={logout}
        style={tw`bg-red-600`}
        icon={({ size, color }) => (
          <MaterialCommunityIcons name="logout" size={size} color={color} />
        )}
      >
        Logout
      </Button>
    </ScrollView>
  );
}
