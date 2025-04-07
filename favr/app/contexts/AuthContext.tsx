import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API_BASE_URL } from "../../config";

interface UserData {
  id?: string;
  fullName?: string;
  phone?: string;
  profilePicture?: string;
  birthDate?: string;
  gender?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userData: UserData | null;
  sendOtp: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<void>;
  updateUserDetails: (details: {
    fullName?: string;
    birthDate?: Date;
    gender?: string;
    profilePicture?: string;
  }) => Promise<boolean>;
  fetchUserDetails: () => Promise<UserData | null>;
  logout: () => Promise<void>;
  error: string | null;
  success: string | null;
  clearMessages: () => void;
  setUserData: (data: UserData | null) => void;
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
    fullName?: string;
    birthDate?: Date;
    gender?: string;
    profilePicture?: string;
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
        body: JSON.stringify({
          ...details,
          birthDate: details.birthDate?.toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Details updated successfully");
        setUserData((prev) => ({
          ...prev,
          ...details,
          birthDate: details.birthDate?.toISOString(),
        }));
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
        logout,
        error,
        success,
        clearMessages,
        setUserData,
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
