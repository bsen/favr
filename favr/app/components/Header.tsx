import React from "react";
import { View } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { router } from "expo-router";
import tw from "twrnc";
import CategoryFilter from "./CategoryFilter";

interface HeaderProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onLogout: () => void;
}

const Header = ({
  selectedCategory,
  onSelectCategory,
  onLogout,
}: HeaderProps) => {
  return (
    <View style={tw`bg-gray-900 border-b border-gray-800`}>
      <View style={tw`flex-row justify-between items-center p-4`}>
        <Text variant="titleLarge" style={tw`text-white font-bold`}>
          Favr
        </Text>
        <View style={tw`flex-row items-center space-x-2`}>
          <IconButton
            icon="filter-variant"
            iconColor="white"
            onPress={() => {}}
            style={tw`bg-gray-800`}
          />
          <IconButton
            icon="magnify"
            iconColor="white"
            onPress={() => {}}
            style={tw`bg-gray-800`}
          />
          <IconButton
            icon="logout"
            iconColor="white"
            onPress={onLogout}
            style={tw`bg-gray-800`}
          />
        </View>
      </View>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
    </View>
  );
};

export default Header;
