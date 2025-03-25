import { Request, Response } from "express";
import userService from "../../models/user/user.service.js";
import otpService from "../../models/otp/otp.service.js";
import logger from "../../utils/logger.js";
import User from "../../models/user/user.schema.js";
import locationService from "../../models/location/location.service.js";

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
    const { name } = req.body;

    if (!name) {
      logger.warn("Missing name in updateUser request");
      res.status(400).json({ message: "Name is required" });
      return;
    }

    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const user = await userService.updateUserProfile(req.user.id, name);
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

const fetchLocationAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { longitude, latitude } = req.body;

    if (!longitude || !latitude) {
      logger.warn("Missing coordinates in fetchLocationAddress request");
      res.status(400).json({ message: "Longitude and latitude are required" });
      return;
    }

    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const result = await locationService.getLocationDetails(
      parseFloat(longitude),
      parseFloat(latitude)
    );

    if (!result.success) {
      throw new Error(result.message);
    }

    res.status(200).json({
      addressDetails: result.data,
      message: "Address fetched successfully for validation",
    });
  } catch (error) {
    logger.error(
      `Error in fetchLocationAddress controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch address",
    });
  }
};

const updateUserLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { addressDetails } = req.body;

    if (!addressDetails) {
      logger.warn("Missing address details in updateUserLocation request");
      res.status(400).json({ message: "Address details are required" });
      return;
    }

    if (!req.user) {
      logger.warn("User not found in request");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const result = await locationService.createOrUpdateLocation(
      req.user.id,
      addressDetails
    );

    if (!result.success) {
      throw new Error(result.message);
    }

    logger.info(`Location updated successfully for user: ${req.user.id}`);
    res.status(200).json({
      location: result.data,
      message: "Location updated successfully",
    });
  } catch (error) {
    logger.error(
      `Error in updateUserLocation controller: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Location update failed",
    });
  }
};

export default {
  sendOTP,
  verifyOTP,
  getUserDetails,
  updateUserDetails,
  fetchLocationAddress,
  updateUserLocation,
};
