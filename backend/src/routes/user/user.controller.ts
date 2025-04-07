import { Request, Response } from "express";
import userService from "../../models/user/user.service";
import otpService from "../../models/otp/otp.service";
import logger from "../../utils/logger";
import User from "../../models/user/user.schema";

interface AuthRequest extends Request {
  user?: User;
}

const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      logger.warn("Missing phone number in sendOTP request");
      res.status(400).json({ message: "Phone number is required" });
      return;
    }

    logger.info(`Sending OTP to phone: ${phone}`);
    await otpService.sendOTPToPhone(phone);
    logger.info(`OTP sent successfully to: ${phone}`);
    res.status(201).json({ message: "OTP sent successfully" });
  } catch (error) {
    logger.error(
      `Error sending OTP: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error sending OTP",
    });
  }
};

const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      logger.warn("Missing phone or OTP in verifyOTP request");
      res.status(400).json({ message: "Phone number and OTP are required" });
      return;
    }

    logger.info(`Verifying OTP for phone: ${phone}`);
    await otpService.verifyOTPForPhone(phone, otp);
    logger.info(`OTP verified successfully for: ${phone}`);

    const user = await userService.createUserWithPhone(phone);
    const auth_token = userService.generateAuthToken({
      id: user.id,
      phone: user.phone,
    });

    res.status(200).json({
      user,
      auth_token,
      message: "OTP verified successfully",
    });
  } catch (error) {
    logger.error(
      `Error in verifyOTP controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message: error instanceof Error ? error.message : "Verification failed",
    });
  }
};

const getUserDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const user = await userService.findUserById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    logger.error(
      `Error in getUserDetails controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Error getting user details",
    });
  }
};

const updateUserDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, birthDate, gender, profilePicture } = req.body;

    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const user = await userService.updateUserProfile(req.user.id, {
      fullName,
      birthDate,
      gender,
      profilePicture,
    });
    logger.info(`User updated successfully: ${user.phone}`);
    res.status(200).json({
      user,
      message: "User updated successfully",
    });
  } catch (error) {
    logger.error(
      `Error in updateUser controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message: error instanceof Error ? error.message : "Update failed",
    });
  }
};

export default {
  sendOTP,
  verifyOTP,
  getUserDetails,
  updateUserDetails,
};
