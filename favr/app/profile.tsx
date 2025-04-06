import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import {
  Text,
  Surface,
  Avatar,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import tw from "twrnc";
import { useAuth } from "./contexts/AuthContext";
import { theme, commonStyles } from "../theme";

const ProfileSkeleton = () => (
  <>
    <Surface
      style={tw.style(`mx-5 rounded-2xl overflow-hidden`, {
        backgroundColor: theme.dark.background.glass.background,
        borderWidth: 1,
        borderColor: theme.dark.background.glass.border,
        ...commonStyles.glass,
      })}
    >
      <View style={tw`p-6 flex-row items-center`}>
        <View
          style={tw.style(`w-[70px] h-[70px] rounded-full`, {
            backgroundColor: `${theme.dark.background.tertiary}80`,
          })}
        />
        <View style={tw`ml-5 flex-1`}>
          <View
            style={tw.style(`w-32 h-6 rounded mb-2`, {
              backgroundColor: `${theme.dark.background.tertiary}80`,
            })}
          />
          <View
            style={tw.style(`w-24 h-4 rounded`, {
              backgroundColor: `${theme.dark.background.tertiary}80`,
            })}
          />
        </View>
      </View>
    </Surface>

    <Surface
      style={tw.style(`mx-5 mt-5 rounded-2xl overflow-hidden`, {
        backgroundColor: theme.dark.background.glass.background,
        borderWidth: 1,
        borderColor: theme.dark.background.glass.border,
        ...commonStyles.glass,
      })}
    >
      <View style={tw`flex-row items-center px-6 py-3.5`}>
        <View
          style={tw.style(`w-6 h-6 rounded-full mr-3`, {
            backgroundColor: `${theme.dark.background.tertiary}80`,
          })}
        />
        <View
          style={tw.style(`w-16 h-5 rounded`, {
            backgroundColor: `${theme.dark.background.tertiary}80`,
          })}
        />
      </View>
    </Surface>
  </>
);

export default function Profile() {
  const { userData, isLoading, fetchUserDetails, logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchUserDetails();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.dark.brand.primary}
          />
        }
      >
        {isLoading || isRefreshing ? (
          <ProfileSkeleton />
        ) : (
          <>
            <Surface
              style={tw.style(`mx-5 rounded-2xl overflow-hidden`, {
                backgroundColor: theme.dark.background.glass.background,
                borderWidth: 1,
                borderColor: theme.dark.background.glass.border,
                ...commonStyles.glass,
              })}
            >
              <View style={tw`p-6 flex-row items-center`}>
                <Avatar.Text
                  size={70}
                  label={(userData?.firstName || "Guest")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                  style={tw`bg-[${theme.dark.brand.primary}]`}
                />
                <View style={tw`ml-5 flex-1`}>
                  <Text
                    style={tw`text-[${theme.dark.text.primary}] text-xl font-semibold mb-1`}
                  >
                    {userData?.firstName || "Guest"}
                  </Text>
                  <Text style={tw`text-[${theme.dark.text.secondary}]`}>
                    {userData?.phone || "No phone number"}
                  </Text>
                </View>
              </View>
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
          </>
        )}
      </ScrollView>
    </View>
  );
}
