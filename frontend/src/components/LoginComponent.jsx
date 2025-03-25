import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader,
  ArrowLeft,
  RefreshCcw,
  Sparkles,
  Lock,
  Star,
} from "lucide-react";

const StarryBackground = () => {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.floor(Math.random() * 3) + 1,
    left: `${Math.floor(Math.random() * 100)}%`,
    delayNum: Math.floor(Math.random() * 5),
    durationNum: Math.floor(Math.random() * 5) + 6,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0, y: -20, x: star.left }}
          animate={{
            opacity: [0, 1, 0],
            y: ["0vh", "100vh"],
          }}
          transition={{
            duration: star.durationNum,
            delay: star.delayNum,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ left: star.left }}
          className="absolute"
        >
          <Star
            className="text-green-300/30"
            size={star.size}
            fill="currentColor"
          />
        </motion.div>
      ))}
    </div>
  );
};

const LoginComponent = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const otpInputRefs = Array(4)
    .fill(0)
    .map(() => React.createRef());

  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
      router.push("/");
    }
  }, [router]);

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError("");
    setSuccess("");

    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/user/send-otp",
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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
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
        "http://localhost:8000/api/v1/user/verify-otp",
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
        localStorage.setItem("auth_token", data.auth_token);
        localStorage.setItem("userPhone", phoneNumber);
        localStorage.setItem("userData", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3 && otpInputRefs[index + 1].current) {
      otpInputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <StarryBackground />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="mx-auto bg-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
          >
            <Sparkles className="text-white size-6" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-extrabold text-white mb-1"
          >
            Doer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-sm text-gray-300"
          >
            {showOtp
              ? "Enter the verification code"
              : "Sign in to your account"}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 bg-[#1e1e1e]/80 backdrop-blur-lg border border-[#2a2a2a] py-8 px-4 shadow-xl rounded-xl sm:px-10"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-900/30 text-red-400 p-3 rounded-md mb-4 border border-red-800 flex items-center"
            >
              <AlertCircle className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-900/30 text-green-400 p-3 rounded-md mb-4 border border-green-800 flex items-center"
            >
              <CheckCircle className="mr-2 flex-shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          {!showOtp ? (
            <motion.form
              className="space-y-6"
              onSubmit={handleSendOtp}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-300"
                >
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-400">+91</span>
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(
                        e.target.value.replace(/\D/g, "").substring(0, 10)
                      )
                    }
                    className="bg-[#2a2a2a] border border-[#3a3a3a] text-white placeholder-gray-400 rounded-lg py-3 pl-12 pr-10 w-full
                    focus:ring-green-600 focus:border-green-600 focus:outline-none transition-colors duration-200"
                    placeholder="Enter your phone number"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Smartphone className="text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  We'll send you a verification code
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white 
                  bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 
                  transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin w-5 h-5" /> Sending
                      code...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" /> Send verification code
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.form
              className="space-y-6"
              onSubmit={handleVerifyOtp}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Enter 4-digit code sent to +91 {phoneNumber}
                </label>
                <motion.div
                  className="flex justify-between items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
                >
                  {otp.map((digit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <input
                        ref={otpInputRefs[index]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-full h-16 text-center text-xl font-semibold bg-[#2a2a2a] border border-[#3a3a3a] text-white 
                        rounded-lg focus:ring-green-600 focus:border-green-600 focus:outline-none transition-colors duration-200"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="flex items-center justify-between">
                <motion.button
                  type="button"
                  onClick={() => setShowOtp(false)}
                  className="text-sm font-medium text-green-500 hover:text-green-400 flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change number
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-sm font-medium text-green-500 hover:text-green-400 flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCcw className="w-4 h-4" />
                  Resend code
                </motion.button>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white 
                  bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 
                  transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin w-5 h-5" /> Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" /> Verify & Continue
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginComponent;
