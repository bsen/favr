import React from "react";
import { View } from "react-native";
import { Text, Surface, Avatar, Button } from "react-native-paper";
import tw from "twrnc";
import { theme, commonStyles } from "../../theme";
import { Post } from "../contexts/PostContext";

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
  fullName,
  userId,
  time,
  type,
  address,
  category,
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
        source={
          profilePicture
            ? { uri: profilePicture }
            : require("../../public/default-user.png")
        }
        style={tw`bg-[${theme.dark.background.border}]`}
      />
      <View style={tw`ml-3 flex-1`}>
        <Text
          style={tw`text-[${theme.dark.text.primary}] font-medium text-base`}
        >
          {fullName || "User"}
        </Text>
        <Text style={tw`text-[${theme.dark.text.secondary}] text-xs`}>
          {time}
        </Text>
      </View>
      <View
        style={tw.style(`px-3 py-1 rounded-full`, {
          backgroundColor:
            type === "offer"
              ? `${theme.dark.brand.primary}20`
              : `${theme.dark.background.glass.background}`,
          borderWidth: 1,
          borderColor:
            type === "offer"
              ? theme.dark.brand.primary
              : theme.dark.background.glass.border,
        })}
      >
        <Text
          style={tw`${
            type === "offer"
              ? `text-[${theme.dark.brand.primary}]`
              : `text-[${theme.dark.text.primary}]`
          } text-xs font-medium`}
        >
          {type === "offer" ? "Offering" : "Requesting"}
        </Text>
      </View>
    </View>

    <Text style={tw`text-[${theme.dark.text.primary}] text-lg font-bold mb-2`}>
      {title}
    </Text>
    <Text style={tw`text-[${theme.dark.text.secondary}] mb-3 leading-5`}>
      {description}
    </Text>

    {address && (
      <View style={tw`flex-row items-center mb-3`}>
        <Text style={tw`text-[${theme.dark.text.secondary}] text-xs`}>
          {address}
        </Text>
      </View>
    )}

    {!isOwnPost && (
      <>
        <View
          style={tw.style(`flex-row justify-between items-center pt-3`, {
            borderTopWidth: 1,
            borderTopColor: theme.dark.background.glass.border,
          })}
        >
          {type === "offer" && price !== null && price !== undefined ? (
            <Text
              style={tw`text-[${theme.dark.brand.primary}] text-lg font-bold`}
            >
              ₹{price}
            </Text>
          ) : (
            <View />
          )}
          <Text style={tw`text-[${theme.dark.text.secondary}] text-sm`}>
            {distance} km away
          </Text>
        </View>

        <Button
          mode="contained"
          style={tw.style(`mt-3 rounded-lg`, {
            backgroundColor: `${theme.dark.brand.primary}80`,
          })}
          labelStyle={tw`text-[${theme.dark.text.primary}] font-medium`}
          onPress={() =>
            onReply({
              id,
              title,
              description,
              price,
              distance,
              fullName,
              userId,
              time,
              type,
              address,
              category,
              profilePicture,
            })
          }
        >
          {type === "offer" ? "Get the deal" : "Give an offer"}
        </Button>
      </>
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
