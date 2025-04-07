import React, { useState } from "react";
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
  show: boolean;
  fullName?: string;
  birthDate?: Date;
  gender?: string;
  setFullName?: (name: string) => void;
  setBirthDate?: (date: Date) => void;
  setGender?: (gender: string) => void;
  loading?: boolean;
  onSubmit?: () => void;
}

export default function UserModal({
  show,
  fullName = "",
  birthDate = new Date(),
  gender = "",
  setFullName = () => {},
  setBirthDate = () => {},
  setGender = () => {},
  loading = false,
  onSubmit,
}: UserModalProps) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleDateChange = () => {
    if (
      day &&
      month &&
      year &&
      day.length === 2 &&
      month.length === 2 &&
      year.length === 4
    ) {
      const newDate = new Date(`${year}-${month}-${day}`);
      if (!isNaN(newDate.getTime())) {
        setBirthDate(newDate);
      }
    }
  };

  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit();
    }
  };

  return (
    <Modal visible={show} transparent={true} animationType="slide">
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
              style={tw`flex-row justify-center items-center py-4 px-5 border-b border-[${theme.dark.background.border}]`}
            >
              <Text
                style={tw`text-[${theme.dark.text.primary}] text-lg font-bold`}
              >
                Complete Your Profile
              </Text>
            </View>

            <ScrollView
              style={tw`max-h-[80%]`}
              keyboardShouldPersistTaps="handled"
            >
              <View style={tw`p-5 pb-10`}>
                <View style={tw`mb-4`}>
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                  >
                    What's your name?
                  </Text>
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    mode="outlined"
                    placeholder="Enter your full name"
                    style={tw`bg-[${theme.dark.background.tertiary}] rounded-xl`}
                    outlineColor="transparent"
                    activeOutlineColor={theme.dark.brand.primary}
                    textColor={theme.dark.text.primary}
                    left={
                      <TextInput.Icon
                        icon="account"
                        color={theme.dark.text.secondary}
                      />
                    }
                  />
                </View>

                <View style={tw`mb-4`}>
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                  >
                    When were you born?
                  </Text>
                  <View style={tw`flex-row gap-3`}>
                    <TextInput
                      value={day}
                      onChangeText={(text) => {
                        const filtered = text.replace(/[^0-9]/g, "");
                        if (filtered.length <= 2) {
                          setDay(filtered);
                          if (filtered.length === 2) handleDateChange();
                        }
                      }}
                      mode="outlined"
                      placeholder="DD"
                      keyboardType="number-pad"
                      maxLength={2}
                      style={tw`flex-1 bg-[${theme.dark.background.tertiary}] rounded-xl`}
                      outlineColor="transparent"
                      activeOutlineColor={theme.dark.brand.primary}
                      textColor={theme.dark.text.primary}
                    />
                    <TextInput
                      value={month}
                      onChangeText={(text) => {
                        const filtered = text.replace(/[^0-9]/g, "");
                        if (filtered.length <= 2) {
                          setMonth(filtered);
                          if (filtered.length === 2) handleDateChange();
                        }
                      }}
                      mode="outlined"
                      placeholder="MM"
                      keyboardType="number-pad"
                      maxLength={2}
                      style={tw`flex-1 bg-[${theme.dark.background.tertiary}] rounded-xl`}
                      outlineColor="transparent"
                      activeOutlineColor={theme.dark.brand.primary}
                      textColor={theme.dark.text.primary}
                    />
                    <TextInput
                      value={year}
                      onChangeText={(text) => {
                        const filtered = text.replace(/[^0-9]/g, "");
                        if (filtered.length <= 4) {
                          setYear(filtered);
                          if (filtered.length === 4) handleDateChange();
                        }
                      }}
                      mode="outlined"
                      placeholder="YYYY"
                      keyboardType="number-pad"
                      maxLength={4}
                      style={tw`flex-1 bg-[${theme.dark.background.tertiary}] rounded-xl`}
                      outlineColor="transparent"
                      activeOutlineColor={theme.dark.brand.primary}
                      textColor={theme.dark.text.primary}
                    />
                  </View>
                </View>

                <View style={tw`mb-6`}>
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                  >
                    What's your gender?
                  </Text>
                  <View style={tw`flex-row gap-3`}>
                    <TouchableOpacity
                      onPress={() => setGender("male")}
                      style={tw.style(
                        `flex-1 py-2 px-3 rounded-xl flex-row items-center justify-center space-x-1`,
                        {
                          backgroundColor:
                            gender === "male"
                              ? theme.dark.brand.primary
                              : theme.dark.background.glass.background,
                          borderWidth: gender !== "male" ? 1 : 0,
                          borderColor: theme.dark.background.glass.border,
                          ...commonStyles.glass,
                        }
                      )}
                    >
                      <IconButton
                        icon="gender-male"
                        size={18}
                        iconColor={
                          gender === "male" ? "white" : theme.dark.text.primary
                        }
                        style={tw`m-0 p-0`}
                      />
                      <Text
                        style={tw`${
                          gender === "male"
                            ? "text-white"
                            : `text-[${theme.dark.text.primary}]`
                        } font-medium`}
                      >
                        Male
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setGender("female")}
                      style={tw.style(
                        `flex-1 py-2 px-3 rounded-xl flex-row items-center justify-center space-x-1`,
                        {
                          backgroundColor:
                            gender === "female"
                              ? theme.dark.brand.primary
                              : theme.dark.background.glass.background,
                          borderWidth: gender !== "female" ? 1 : 0,
                          borderColor: theme.dark.background.glass.border,
                          ...commonStyles.glass,
                        }
                      )}
                    >
                      <IconButton
                        icon="gender-female"
                        size={18}
                        iconColor={
                          gender === "female"
                            ? "white"
                            : theme.dark.text.primary
                        }
                        style={tw`m-0 p-0`}
                      />
                      <Text
                        style={tw`${
                          gender === "female"
                            ? "text-white"
                            : `text-[${theme.dark.text.primary}]`
                        } font-medium`}
                      >
                        Female
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setGender("other")}
                      style={tw.style(
                        `flex-1 py-2 px-3 rounded-xl flex-row items-center justify-center space-x-1`,
                        {
                          backgroundColor:
                            gender === "other"
                              ? theme.dark.brand.primary
                              : theme.dark.background.glass.background,
                          borderWidth: gender !== "other" ? 1 : 0,
                          borderColor: theme.dark.background.glass.border,
                          ...commonStyles.glass,
                        }
                      )}
                    >
                      <IconButton
                        icon="gender-non-binary"
                        size={18}
                        iconColor={
                          gender === "other" ? "white" : theme.dark.text.primary
                        }
                        style={tw`m-0 p-0`}
                      />
                      <Text
                        style={tw`${
                          gender === "other"
                            ? "text-white"
                            : `text-[${theme.dark.text.primary}]`
                        } font-medium`}
                      >
                        Other
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading || !fullName || !birthDate || !gender}
                  style={tw.style(
                    `py-3 rounded-xl flex-row items-center justify-center`,
                    {
                      backgroundColor: theme.dark.brand.primary,
                      opacity:
                        loading || !fullName || !birthDate || !gender ? 0.7 : 1,
                    }
                  )}
                >
                  <Text
                    style={tw`text-white font-medium text-center text-base`}
                  >
                    {loading ? "Saving..." : "Continue"}
                  </Text>
                </TouchableOpacity>

                <View style={tw`h-12`} />
              </View>
            </ScrollView>
          </Surface>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
