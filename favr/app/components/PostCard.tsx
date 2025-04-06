import React from "react";
import { View } from "react-native";
import { Text, Surface, Avatar, Button } from "react-native-paper";
import tw from "twrnc";
import { theme, commonStyles } from "../../theme";

interface Post {
  id: number;
  type: "offer" | "request";
  title: string;
  description: string;
  price: number;
  distance: number;
  userName: string;
  userId: string;
  time: string;
  profilePicture?: string;
}

interface PostCardProps extends Post {
  isOwnPost: boolean;
  onReply: (post: Post) => void;
}

export const PostCard = ({
  id,
  title,
  description,
  price,
  distance,
  userName,
  userId,
  time,
  type,
  profilePicture,
  isOwnPost,
  onReply,
}: PostCardProps) => (
  <Surface
    style={tw.style(`mx-0 my-2 rounded-xl p-4`, {
      backgroundColor: theme.dark.background.glass.background,
      borderWidth: 1,
      borderColor: theme.dark.background.glass.border,
      ...commonStyles.glass,
    })}
  >
    <View style={tw`flex-row items-center mb-4`}>
      <Avatar.Image
        size={48}
        source={require("../../public/default-user.png")}
        style={tw`bg-[${theme.dark.background.border}]`}
      />
      <View style={tw`ml-3 flex-1`}>
        <Text
          style={tw`text-[${theme.dark.text.primary}] font-medium text-base`}
        >
          {userName}
        </Text>
        <Text style={tw`text-[${theme.dark.text.secondary}] text-xs`}>
          {time}
        </Text>
      </View>
      <View
        style={tw.style(`px-3 py-1 rounded-full`, {
          backgroundColor: theme.dark.button.primary.background,
          borderWidth: 1,
          borderColor: theme.dark.background.glass.border,
        })}
      >
        <Text
          style={tw`text-[${theme.dark.brand.primary}] text-xs font-medium`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>
      </View>
    </View>

    <Text style={tw`text-[${theme.dark.text.primary}] text-lg font-bold mb-2`}>
      {title}
    </Text>
    <Text style={tw`text-[${theme.dark.text.secondary}] mb-4 leading-5`}>
      {description}
    </Text>

    <View
      style={tw.style(`flex-row justify-between items-center pt-2`, {
        borderTopWidth: 1,
        borderTopColor: theme.dark.background.glass.border,
      })}
    >
      <Text style={tw`text-[${theme.dark.brand.primary}] text-lg font-bold`}>
        ₹{price}
      </Text>
      <Text style={tw`text-[${theme.dark.text.secondary}] text-sm`}>
        {distance} km away
      </Text>
    </View>

    {!isOwnPost && (
      <Button
        mode="contained"
        style={tw.style(`mt-3 rounded-lg`, {
          backgroundColor: theme.dark.brand.primary,
        })}
        labelStyle={tw`text-white font-medium`}
        onPress={() =>
          onReply({
            id,
            title,
            description,
            price,
            distance,
            userName,
            userId,
            time,
            type,
            profilePicture,
          })
        }
      >
        Make Offer
      </Button>
    )}

    {isOwnPost && (
      <View
        style={tw`mt-3 px-2 py-1 rounded-lg self-start bg-[${theme.dark.background.secondary}]`}
      >
        <Text style={tw`text-[${theme.dark.text.secondary}] text-xs`}>
          Your post
        </Text>
      </View>
    )}
  </Surface>
);

export const PostSkeleton = () => (
  <Surface
    style={tw.style(`mx-0 my-2 rounded-xl p-4`, {
      backgroundColor: theme.dark.background.glass.background,
      borderWidth: 1,
      borderColor: theme.dark.background.glass.border,
      ...commonStyles.glass,
    })}
  >
    <View style={tw`flex-row items-center mb-4`}>
      <View
        style={tw.style(`w-12 h-12 rounded-full`, {
          backgroundColor: `${theme.dark.background.tertiary}80`,
        })}
      />
      <View style={tw`ml-3 flex-1`}>
        <View
          style={tw.style(`w-24 h-4 rounded mb-1`, {
            backgroundColor: `${theme.dark.background.tertiary}80`,
          })}
        />
        <View
          style={tw.style(`w-16 h-3 rounded`, {
            backgroundColor: `${theme.dark.background.tertiary}80`,
          })}
        />
      </View>
    </View>
    <View
      style={tw.style(`w-full h-6 rounded mb-2`, {
        backgroundColor: `${theme.dark.background.tertiary}80`,
      })}
    />
    <View
      style={tw.style(`w-3/4 h-4 rounded mb-4`, {
        backgroundColor: `${theme.dark.background.tertiary}80`,
      })}
    />
    <View
      style={tw.style(`flex-row justify-between items-center pt-2`, {
        borderTopWidth: 1,
        borderTopColor: theme.dark.background.glass.border,
      })}
    >
      <View
        style={tw.style(`w-16 h-6 rounded`, {
          backgroundColor: `${theme.dark.background.tertiary}80`,
        })}
      />
      <View
        style={tw.style(`w-20 h-4 rounded`, {
          backgroundColor: `${theme.dark.background.tertiary}80`,
        })}
      />
    </View>
  </Surface>
);
