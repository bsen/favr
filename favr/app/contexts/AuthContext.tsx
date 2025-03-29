import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API_BASE_URL } from "../../config";

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
  updateName: (name: string) => Promise<boolean>;
  updateLocation: (location: Location) => Promise<boolean>;
  fetchUserDetails: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  success: string | null;
  clearMessages: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

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
      } else {
        setError(data.message || "Failed to fetch user details");
        setIsAuthenticated(false);
      }
    } catch (error) {
      setError("Network error. Please try again.");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateName = async (name: string) => {
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
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Name updated successfully");
        setUserData((prev) => ({ ...prev, name }));
        return true;
      } else {
        setError(data.message || "Failed to update name");
        return false;
      }
    } catch (error) {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocation = async (location: Location) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/user/update-location`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressDetails: {
            longitude: location.longitude,
            latitude: location.latitude,
            address: location.address,
            city: location.city,
            state: location.state,
            postalCode: location.postalCode,
            country: location.country,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Location updated successfully");
        setUserData((prev) => ({ ...prev, location }));
        return true;
      } else {
        setError(data.message || "Failed to update location");
        return false;
      }
    } catch (error) {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("auth_token");
    await AsyncStorage.removeItem("userPhone");
    await AsyncStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUserData(null);
    router.replace("/login");
  };

  const clearMessages = () => {
    setSuccess(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userData,
        sendOtp,
        verifyOtp,
        updateName,
        updateLocation,
        fetchUserDetails,
        logout,
        error,
        success,
        clearMessages,
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
