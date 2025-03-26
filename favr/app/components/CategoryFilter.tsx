import React from "react";
import { ScrollView } from "react-native";
import { Button } from "react-native-paper";
import tw from "twrnc";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { id: "all", label: "All" },
  { id: "requests", label: "Requests" },
  { id: "offers", label: "Offers" },
  { id: "services", label: "Services" },
  { id: "items", label: "Items" },
];

const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={tw`-mx-4 px-4`}
      contentContainerStyle={tw`space-x-2 py-2`}
    >
      {categories.map((category) => (
        <Button
          key={category.id}
          mode={selectedCategory === category.id ? "contained" : "outlined"}
          onPress={() => onSelectCategory(category.id)}
          style={[
            tw`rounded-full`,
            selectedCategory === category.id
              ? tw`bg-primary`
              : tw`bg-gray-800 border-gray-700`,
          ]}
          labelStyle={[
            tw`text-sm`,
            selectedCategory === category.id
              ? tw`text-white`
              : tw`text-gray-300`,
          ]}
        >
          {category.label}
        </Button>
      ))}
    </ScrollView>
  );
};

export default CategoryFilter;
