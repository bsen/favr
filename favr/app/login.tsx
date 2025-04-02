import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  Text,
  Button,
  TextInput,
  Surface,
  IconButton,
} from "react-native-paper";
import { router } from "expo-router";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "./contexts/AuthContext";
import { theme } from "../theme";

const StarryBackground = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        size: Math.floor(Math.random() * 3) + 1,
        position: {
          left: Math.random() * 100,
          top: Math.random() * 100,
        },
        duration: 6000 + Math.random() * 4000,
        opacity: new Animated.Value(Math.random()),
        translateY: new Animated.Value(-10),
      })),
    []
  );

  useEffect(() => {
    const startAnimation = (star: any) => {
      const animation = Animated.parallel([
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.3 + 0.7,
            duration: star.duration * 0.5,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: 0,
            duration: star.duration * 0.5,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(star.translateY, {
          toValue: Dimensions.get("window").height + 10,
          duration: star.duration,
          useNativeDriver: true,
        }),
      ]);

      return animation;
    };

    const animations = stars.map((star, index) => {
      const delay = index * 100;
      const animation = Animated.loop(startAnimation(star));

      setTimeout(() => {
        animation.start();
      }, delay);

      return animation;
    });

    return () => {
      animations.forEach((animation) => animation.stop());
    };
  }, []);

  return (
    <View style={tw`absolute inset-0 overflow-hidden`}>
      {stars.map((star) => (
        <Animated.View
          key={star.id}
          style={[
            {
              position: "absolute",
              left: `${star.position.left}%`,
              top: `${star.position.top}%`,
              opacity: star.opacity,
              transform: [{ translateY: star.translateY }],
            },
          ]}
        >
          <View
            style={[
              tw`bg-white rounded-full`,
              { width: star.size, height: star.size },
            ]}
          />
        </Animated.View>
      ))}
    </View>
  );
};

export default function Login() {
  const { isLoading, error, success, sendOtp, verifyOtp } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("auth_token");
    if (token) {
      router.replace("/");
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      return;
    }

    const success = await sendOtp(phoneNumber);
    if (success) {
      setShowOtp(true);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 4) {
      return;
    }
    verifyOtp(phoneNumber, otp);
  };

  const handleOtpChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 4);
    setOtp(cleanValue);
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={tw`flex-1 bg-[${theme.dark.background.primary}]`}>
        <StarryBackground />

        <View style={tw`absolute top-20 left-8 z-20`}>
          <View style={tw`flex-row items-center gap-4`}>
            <View
              style={tw`bg-[${theme.dark.brand.primary}] w-10 h-10 rounded-2xl items-center justify-center`}
            >
              <MaterialCommunityIcons
                name="star-four-points"
                size={24}
                color={theme.dark.text.primary}
              />
            </View>
            <Text
              style={tw`text-4xl font-bold text-[${theme.dark.text.primary}]`}
            >
              favr
            </Text>
          </View>
        </View>

        <View style={tw`flex-1 px-4 pt-40 relative z-10`}>
          <Surface
            style={[
              tw`bg-[${theme.dark.background.secondary}]/80 backdrop-blur-lg border border-[${theme.dark.background.border}] p-6 rounded-xl`,
            ]}
          >
            {error ? (
              <View
                style={tw`bg-[${theme.dark.brand.error.background}] border border-[${theme.dark.brand.error.border}] rounded-md mb-4 p-2 flex-row items-center`}
              >
                <IconButton
                  icon="alert-circle"
                  size={20}
                  iconColor={theme.dark.brand.error.text}
                />
                <Text style={tw`text-[${theme.dark.brand.error.text}] flex-1`}>
                  {error}
                </Text>
              </View>
            ) : null}

            {!showOtp ? (
              <>
                <Text
                  style={tw`text-sm font-medium text-[${theme.dark.text.secondary}] mb-2`}
                >
                  Phone Number
                </Text>
                <View style={tw`relative`}>
                  <TextInput
                    value={phoneNumber}
                    onChangeText={handlePhoneNumberChange}
                    mode="outlined"
                    keyboardType="number-pad"
                    maxLength={10}
                    placeholder="Enter your phone number"
                    right={<TextInput.Icon icon="phone" />}
                    style={[
                      tw`bg-[${theme.dark.background.tertiary}]`,
                      tw`pl-12`,
                    ]}
                    outlineColor={theme.dark.background.border}
                    activeOutlineColor={theme.dark.brand.primary}
                    textColor={theme.dark.text.primary}
                    placeholderTextColor={theme.dark.text.secondary}
                    theme={{ colors: { text: theme.dark.text.primary } }}
                  />
                  <View style={tw`absolute left-4 h-full justify-center z-10`}>
                    <Text style={tw`text-[${theme.dark.text.secondary}]`}>
                      +91
                    </Text>
                  </View>
                </View>
                <Text
                  style={tw`text-xs text-[${theme.dark.text.tertiary}] mb-6 mt-2`}
                >
                  We'll send you a verification code
                </Text>
                <Button
                  mode="contained"
                  onPress={handleSendOtp}
                  loading={isLoading}
                  style={tw`bg-[${theme.dark.brand.primary}] rounded-lg`}
                  contentStyle={tw`h-12`}
                  labelStyle={tw`text-sm font-medium text-[${theme.dark.text.primary}]`}
                >
                  {isLoading ? "Sending code..." : "Send verification code"}
                </Button>
              </>
            ) : (
              <>
                {success && (
                  <Text
                    style={tw`text-sm text-[${theme.dark.text.secondary}] mb-3`}
                  >
                    OTP has been sent to +91 {phoneNumber}
                  </Text>
                )}
                <TextInput
                  value={otp}
                  onChangeText={handleOtpChange}
                  mode="outlined"
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="Enter OTP"
                  style={tw`bg-[${theme.dark.background.tertiary}] mb-6`}
                  outlineColor={theme.dark.background.border}
                  activeOutlineColor={theme.dark.brand.primary}
                  textColor={theme.dark.text.primary}
                  placeholderTextColor={theme.dark.text.secondary}
                  theme={{ colors: { text: theme.dark.text.primary } }}
                />
                <View style={tw`flex-row justify-between mb-6`}>
                  <Button
                    mode="text"
                    onPress={() => setShowOtp(false)}
                    icon="arrow-left"
                    textColor={theme.dark.brand.primary}
                  >
                    Change number
                  </Button>
                  <Button
                    mode="text"
                    onPress={handleSendOtp}
                    icon="refresh"
                    textColor={theme.dark.brand.primary}
                  >
                    Resend code
                  </Button>
                </View>
                <Button
                  mode="contained"
                  onPress={handleVerifyOtp}
                  loading={isLoading}
                  style={tw`bg-[${theme.dark.brand.primary}] rounded-lg`}
                  contentStyle={tw`h-12`}
                  labelStyle={tw`text-sm font-medium text-[${theme.dark.text.primary}]`}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </>
            )}
          </Surface>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
