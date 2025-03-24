import twilio from "twilio";

const sendOTP = async (phone: string, otp: string) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  const response = await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
    body: `Your OTP is ${otp}`,
  });
  return response.sid;
};

export default sendOTP;
