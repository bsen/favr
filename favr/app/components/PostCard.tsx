import React from "react";
import { View, Image } from "react-native";
import { Text, Card, Avatar } from "react-native-paper";
import tw from "twrnc";

interface PostCardProps {
  id: number;
  type: "offer" | "request";
  title: string;
  description: string;
  price: number;
  distance: number;
  author: string;
  time: string;
  image?: string;
}

const PostCard = ({
  title,
  description,
  price,
  distance,
  author = "Anonymous",
  time,
  image,
}: PostCardProps) => {
  const authorInitials = author
    ? author
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "?";

  return (
    <Card style={tw`m-4 bg-gray-800`}>
      <Card.Content>
        <View style={tw`flex-row items-center mb-2`}>
          <Avatar.Text
            size={40}
            label={authorInitials}
            style={tw`bg-primary`}
          />
          <View style={tw`ml-3 flex-1`}>
            <Text variant="titleMedium" style={tw`text-white`}>
              {author}
            </Text>
            <Text variant="bodySmall" style={tw`text-gray-400`}>
              {time}
            </Text>
          </View>
        </View>
        <Text variant="titleLarge" style={tw`text-white mb-2`}>
          {title}
        </Text>
        <Text variant="bodyMedium" style={tw`text-gray-300 mb-2`}>
          {description}
        </Text>
        {image && (
          <Image
            source={{ uri: image }}
            style={tw`w-full h-48 rounded-lg mb-2`}
            resizeMode="cover"
          />
        )}
        <View style={tw`flex-row justify-between items-center`}>
          <Text variant="titleMedium" style={tw`text-primary`}>
            ₹{price}
          </Text>
          <Text variant="bodySmall" style={tw`text-gray-400`}>
            {distance}km away
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

export default PostCard;
