import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  Animated,
  Dimensions,
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

const StarryBackground = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        size: Math.floor(Math.random() * 3) + 1,
        position: {
          left: Math.random() * 100,
          top: -(Math.random() * 500),
        },
        duration: 6000 + Math.random() * 4000,
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(-10),
      })),
    []
  );

  useEffect(() => {
    const animations = stars.map((star) => {
      const animation = Animated.parallel([
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: 0.7,
            duration: star.duration * 0.3,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: 0,
            duration: star.duration * 0.7,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(star.translateY, {
          toValue: Dimensions.get("window").height + 10,
          duration: star.duration,
          useNativeDriver: true,
        }),
      ]);

      return Animated.loop(animation);
    });

    animations.forEach((animation, index) => {
      setTimeout(() => {
        animation.start();
      }, index * 100);
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const otpInputRefs = Array(4)
    .fill(0)
    .map(() => React.createRef<RNTextInput>());

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
    setError("");
    setSuccess("");

    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://ec0b-27-7-163-184.ngrok-free.app/api/v1/user/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: `+91${phoneNumber}`,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setShowOtp(true);
        setTimeout(() => {
          if (otpInputRefs[0].current) {
            otpInputRefs[0].current.focus();
          }
        }, 100);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");

    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setError("Please enter the complete OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://ec0b-27-7-163-184.ngrok-free.app/api/v1/user/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: `+91${phoneNumber}`,
            otp: otpValue,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        await AsyncStorage.setItem("auth_token", data.auth_token);
        await AsyncStorage.setItem("userPhone", phoneNumber);
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));
        router.replace("/");
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3 && otpInputRefs[index + 1].current) {
      otpInputRefs[index + 1].current!.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1 bg-[#121212]`}
    >
      <StarryBackground />

      <View style={tw`flex-1 px-4 justify-center relative z-10`}>
        <View style={tw`items-center mb-8`}>
          <View
            style={tw`bg-green-600 w-14 h-14 rounded-2xl items-center justify-center mb-6`}
          >
            <MaterialCommunityIcons
              name="star-four-points"
              size={24}
              color="white"
            />
          </View>
          <Text style={tw`text-4xl font-bold text-white mb-2`}>favr</Text>
          <Text style={tw`text-gray-300 text-sm`}>
            {showOtp
              ? "Enter the verification code"
              : "Sign in to your account"}
          </Text>
        </View>

        <Surface
          style={tw`bg-[#1e1e1e]/80 backdrop-blur-lg border border-[#2a2a2a] p-6 rounded-xl`}
        >
          {error ? (
            <View
              style={tw`bg-red-900/30 border border-red-800 rounded-md mb-4 p-3 flex-row items-center`}
            >
              <IconButton icon="alert-circle" size={20} iconColor="#f87171" />
              <Text style={tw`text-red-400 flex-1`}>{error}</Text>
            </View>
          ) : null}

          {success ? (
            <View
              style={tw`bg-green-900/30 border border-green-800 rounded-md mb-4 p-3 flex-row items-center`}
            >
              <IconButton icon="check-circle" size={20} iconColor="#4ade80" />
              <Text style={tw`text-green-400 flex-1`}>{success}</Text>
            </View>
          ) : null}

          {!showOtp ? (
            <>
              <Text style={tw`text-sm font-medium text-gray-300 mb-2`}>
                Phone Number
              </Text>
              <View style={tw`relative mb-2`}>
                <View style={tw`absolute z-10 h-full justify-center pl-4`}>
                  <Text style={tw`text-gray-400`}>+91</Text>
                </View>
                <RNTextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  style={[
                    tw`bg-[#2a2a2a] rounded-lg pl-12 pr-12 h-12 text-white`,
                    { fontSize: 16, color: "white" },
                  ]}
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9ca3af"
                />
                <View style={tw`absolute right-0 h-full justify-center pr-4`}>
                  <MaterialCommunityIcons
                    name="phone"
                    size={20}
                    color="#9ca3af"
                  />
                </View>
              </View>
              <Text style={tw`text-xs text-gray-400 mb-6`}>
                We'll send you a verification code
              </Text>
              <Button
                mode="contained"
                onPress={handleSendOtp}
                loading={isLoading}
                style={tw`bg-green-600 rounded-lg`}
                contentStyle={tw`h-12`}
                labelStyle={tw`text-sm font-medium text-white`}
                icon={({ size, color }) => (
                  <MaterialCommunityIcons
                    name="lock"
                    size={size}
                    color={color}
                  />
                )}
              >
                {isLoading ? "Sending code..." : "Send verification code"}
              </Button>
            </>
          ) : (
            <>
              <Text style={tw`text-sm text-gray-300 mb-3`}>
                Enter 4-digit code sent to +91 {phoneNumber}
              </Text>
              <View style={tw`flex-row justify-between mb-6`}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={otpInputRefs[index]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(index, value)}
                    mode="outlined"
                    style={tw`w-[22%] h-16 bg-[#2a2a2a] text-center text-xl`}
                    keyboardType="number-pad"
                    maxLength={1}
                    outlineColor="#3a3a3a"
                    activeOutlineColor="#22c55e"
                    textColor="white"
                    theme={{ colors: { text: "white" } }}
                  />
                ))}
              </View>
              <View style={tw`flex-row justify-between mb-6`}>
                <Button
                  mode="text"
                  onPress={() => setShowOtp(false)}
                  icon="arrow-left"
                  textColor="#22c55e"
                >
                  Change number
                </Button>
                <Button
                  mode="text"
                  onPress={handleSendOtp}
                  icon="refresh"
                  textColor="#22c55e"
                >
                  Resend code
                </Button>
              </View>
              <Button
                mode="contained"
                onPress={handleVerifyOtp}
                loading={isLoading}
                style={tw`bg-green-600 rounded-lg`}
                contentStyle={tw`h-12`}
                labelStyle={tw`text-sm font-medium text-white`}
                icon={isLoading ? undefined : "check-circle"}
              >
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </Button>
            </>
          )}
        </Surface>
      </View>
    </KeyboardAvoidingView>
  );
}
