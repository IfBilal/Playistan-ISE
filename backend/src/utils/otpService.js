import "dotenv/config";
import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code - Playistan",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Playistan OTP Verification</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px; font-size: 24px;">
          ${otp}
        </h1>
        <p><strong>This OTP expires in 10 minutes.</strong></p>
        <p>If you didn't request this OTP, please ignore this email.</p>
        <hr>
        <p style="color: #666;">Playistan - Your Sports Booking Platform</p>
      </div>
    `,
    text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Email error:", error);
    throw new ApiError(500, "Failed to send OTP email");
  }
};

export { generateOTP, sendOTPEmail };
