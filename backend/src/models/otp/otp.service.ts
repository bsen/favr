import OTP from "./otp.schema.js";
import sendOTP from "../../services/twilio.js";
import logger from "../../utils/logger.js";

class OTPService {
  generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async sendOTPToPhone(phone: string) {
    try {
      logger.info(`Generating OTP for phone: ${phone}`);

      const existingOTP = await OTP.findOne({ where: { phone } });
      logger.info(`Existing OTP: ${existingOTP}`);

      if (existingOTP) {
        logger.info(`Existing OTP found for phone: ${phone}, resending`);
        const response = await sendOTP(phone, existingOTP.otp);
        if (response) {
          return existingOTP;
        }
      }

      const otp = this.generateOTP();
      logger.info(`New OTP generated for phone: ${phone}`);

      const response = await sendOTP(phone, otp);
      if (response) {
        const otpData = await OTP.create({
          phone,
          otp,
        });
        return otpData;
      }

      logger.error(`Failed to send OTP via Twilio for phone: ${phone}`);
      throw new Error("Failed to send OTP");
    } catch (error) {
      logger.error(
        `Error in sendOTP: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error("Failed to send OTP");
    }
  }

  async verifyOTPForPhone(phone: string, otp: string) {
    try {
      logger.info(`Verifying OTP for phone: ${phone}`);
      const otpData = await OTP.findOne({ where: { phone, otp } });

      if (!otpData) {
        logger.warn(`Invalid OTP provided for phone: ${phone}`);
        throw new Error("Invalid OTP");
      }

      logger.info(`OTP verified successfully for phone: ${phone}`);
      await otpData.destroy({ force: true });
      return otpData;
    } catch (error) {
      logger.error(
        `Error in verifyOTP: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error(
        error instanceof Error ? error.message : "Failed to verify OTP"
      );
    }
  }
}

export default new OTPService();
