import express from "express";
import userController from "./user.controller";
import authMiddleware from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/send-otp", userController.sendOTP);
router.post("/verify-otp", userController.verifyOTP);
router.get("/details", authMiddleware, userController.getUserDetails);
router.put("/update-details", authMiddleware, userController.updateUserDetails);

export default router;
