import React from "react";
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  Text,
  Surface,
  TextInput,
  Button,
  IconButton,
} from "react-native-paper";
import tw from "twrnc";
import { theme, commonStyles } from "../../theme";
import { Post } from "../contexts/PostContext";

interface MessageModalProps {
  visible: boolean;
  selectedPost: Post | null;
  messagePrice: string;
  messageText: string;
  submitting: boolean;
  onChangePrice: (price: string) => void;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function MessageModal({
  visible,
  selectedPost,
  messagePrice,
  messageText,
  submitting,
  onChangePrice,
  onChangeText,
  onClose,
  onSubmit,
}: MessageModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
      animationType="slide"
    >
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
                Send Message
              </Text>
              <IconButton
                icon="close"
                size={24}
                iconColor={theme.dark.text.primary}
                onPress={onClose}
                style={tw`m-0`}
              />
            </View>

            <ScrollView style={tw`max-h-[80%]`}>
              <View style={tw`p-5 pb-10`}>
                {selectedPost && (
                  <Surface
                    style={tw`p-4 mb-5 rounded-xl bg-[${theme.dark.background.tertiary}]`}
                  >
                    <Text
                      style={tw`text-[${theme.dark.text.primary}] font-semibold mb-2`}
                    >
                      {selectedPost.title}
                    </Text>
                    {selectedPost.price ? (
                      <View style={tw`flex-row items-center`}>
                        <Text
                          style={tw`text-[${theme.dark.text.secondary}] text-sm`}
                        >
                          Original price:
                        </Text>
                        <Text
                          style={tw`text-[${theme.dark.brand.primary}] font-bold text-base ml-2`}
                        >
                          ${selectedPost.price}
                        </Text>
                      </View>
                    ) : (
                      <Text
                        style={tw`text-[${theme.dark.text.secondary}] text-sm`}
                      >
                        Free
                      </Text>
                    )}
                  </Surface>
                )}

                <View style={tw`mb-4`}>
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                  >
                    Price Offer (optional)
                  </Text>
                  <TextInput
                    value={messagePrice}
                    onChangeText={onChangePrice}
                    keyboardType="numeric"
                    style={tw`bg-[${theme.dark.background.tertiary}] rounded-xl`}
                    mode="outlined"
                    outlineColor="transparent"
                    activeOutlineColor={theme.dark.brand.primary}
                    textColor={theme.dark.text.primary}
                  />
                </View>

                <View style={tw`mb-6`}>
                  <Text
                    style={tw`text-[${theme.dark.text.secondary}] mb-2 text-sm`}
                  >
                    Your Message
                  </Text>
                  <TextInput
                    value={messageText}
                    onChangeText={onChangeText}
                    multiline={true}
                    numberOfLines={4}
                    maxLength={180}
                    style={tw`bg-[${theme.dark.background.tertiary}] rounded-xl`}
                    mode="outlined"
                    outlineColor="transparent"
                    activeOutlineColor={theme.dark.brand.primary}
                    textColor={theme.dark.text.primary}
                  />
                </View>

                <View style={tw`flex-row justify-between mb-2`}>
                  <Button
                    mode="outlined"
                    onPress={onClose}
                    style={tw`flex-1 mr-3 border-[${theme.dark.background.border}] rounded-xl`}
                    labelStyle={tw`text-[${theme.dark.text.primary}]`}
                    contentStyle={tw`py-1`}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={onSubmit}
                    loading={submitting}
                    disabled={!messageText || submitting}
                    style={tw`flex-1 bg-[${theme.dark.brand.primary}] rounded-xl`}
                    labelStyle={tw`text-white font-semibold`}
                    contentStyle={tw`py-1`}
                  >
                    Send Message
                  </Button>
                </View>

                {/* Extra padding for safe area at bottom */}
                <View style={tw`h-6`} />
              </View>
            </ScrollView>
          </Surface>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
