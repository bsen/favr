import React from "react";
import { View } from "react-native";
import { Text, Surface, TextInput, Button } from "react-native-paper";
import tw from "twrnc";

interface NameModalProps {
  show: boolean;
  name: string;
  setName: (name: string) => void;
  loading: boolean;
  onSubmit: () => void;
}

export default function NameModal({
  show,
  name,
  setName,
  loading,
  onSubmit,
}: NameModalProps) {
  if (!show) return null;

  return (
    <View
      style={tw`absolute inset-0 bg-black/50 flex items-center justify-center p-4`}
    >
      <Surface
        style={tw`bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6 w-full max-w-md`}
      >
        <Text style={tw`text-white text-xl mb-4`}>Please Enter Your Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={tw`bg-[#2a2a2a] mb-4`}
          outlineColor="#3a3a3a"
          activeOutlineColor="#22c55e"
          textColor="white"
          placeholder="Enter your name"
          placeholderTextColor="#9ca3af"
        />
        <Button
          mode="contained"
          onPress={onSubmit}
          loading={loading}
          style={tw`bg-[#22c55e]`}
        >
          {loading ? "Updating..." : "Save Name"}
        </Button>
      </Surface>
    </View>
  );
}
