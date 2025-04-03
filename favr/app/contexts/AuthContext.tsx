import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API_BASE_URL } from "../../config";
import * as Location from "expo-location";

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface UserData {
  id?: string;
  name?: string;
  phone?: string;
  location?: Location;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userData: UserData | null;
  sendOtp: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<void>;
  updateUserDetails: (details: {
    name?: string;
    bio?: string;
    addressDetails?: Location;
  }) => Promise<boolean>;
  fetchUserDetails: () => Promise<UserData | null>;
  fetchAddress: (
    latitude: number,
    longitude: number
  ) => Promise<Location | null>;
  logout: () => Promise<void>;
  error: string | null;
  success: string | null;
  clearMessages: () => void;
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;
  locationError: string | undefined;
  setLocationError: (error: string | undefined) => void;
  setUserData: (data: UserData | null) => void;
  currentLocation: { latitude: number; longitude: number } | null;
  getCurrentLocation: () => Promise<{
    latitude: number;
    longitude: number;
  } | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationError, setLocationError] = useState<string | undefined>();
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const sendOtp = async (phoneNumber: string) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: `+91${phoneNumber}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        return true;
      } else {
        setError(data.message || "Failed to send OTP");
        return false;
      }
    } catch (error) {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (phoneNumber: string, otpValue: string) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: `+91${phoneNumber}`,
          otp: otpValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        await AsyncStorage.setItem("auth_token", data.auth_token);
        await AsyncStorage.setItem("userPhone", phoneNumber);
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));
        setUserData(data.user);
        setIsAuthenticated(true);
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

  const fetchUserDetails = async () => {
    setError("");
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/user/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.user);
        setIsAuthenticated(true);
        return data.user;
      } else {
        setError(data.message || "Failed to fetch user details");
        setIsAuthenticated(false);
        return null;
      }
    } catch (error) {
      setError("Network error. Please try again.");
      setIsAuthenticated(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserDetails = async (details: {
    name?: string;
    bio?: string;
    addressDetails?: Location;
  }) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/user/update-details`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(details),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Details updated successfully");
        setUserData((prev) => ({ ...prev, ...details }));
        return true;
      } else {
        setError(data.message || "Failed to update details");
        return false;
      }
    } catch (error) {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAddress = async (latitude: number, longitude: number) => {
    setError("");
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/user/fetch-address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      const data = await response.json();

      if (response.ok) {
        return data.addressDetails;
      } else {
        setError(data.message || "Failed to fetch address");
        return null;
      }
    } catch (error) {
      setError("Network error. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    router.push("/login");

    await AsyncStorage.removeItem("auth_token");
    await AsyncStorage.removeItem("userPhone");
    await AsyncStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUserData(null);
  };

  const clearMessages = () => {
    setSuccess(null);
    setError(null);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Location permission denied");
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(newLocation);
      return newLocation;
    } catch (error) {
      console.error("Error getting current location:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userData,
        sendOtp,
        verifyOtp,
        updateUserDetails,
        fetchUserDetails,
        fetchAddress,
        logout,
        error,
        success,
        clearMessages,
        showLocationModal,
        setShowLocationModal,
        locationError,
        setLocationError,
        setUserData,
        currentLocation,
        getCurrentLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
