import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import {  OTPStore } from '../types';
import { otpConfig, emailConfig } from './config';

const otpStore: OTPStore = {};

export const generateOTP = (): string => {
  return otpGenerator.generate(otpConfig.LENGTH, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};

export const storeOTP = (identifier: string, otp: string): void => {
  const expiresAt = new Date(Date.now() + otpConfig.EXPIRY_MINUTES * 60 * 1000);
  otpStore[identifier] = {
    code: otp,
    expiresAt,
    attempts: 0,
  };
  console.log(`✅ OTP stored for ${identifier}: ${otp} (expires: ${expiresAt.toLocaleTimeString()})`);
};

export const verifyOTP = (identifier: string, otp: string): boolean => {
  const storedOTP = otpStore[identifier];
  if (!storedOTP) {
    console.log(`❌ No OTP found for ${identifier}`);
    return false;
  }
  if (new Date() > storedOTP.expiresAt) {
    console.log(`❌ OTP expired for ${identifier}`);
    delete otpStore[identifier];
    return false;
  }
  if (storedOTP.attempts >= 3) {
    console.log(`❌ Too many attempts for ${identifier}`);
    delete otpStore[identifier];
    return false;
  }
  storedOTP.attempts++;
  if (storedOTP.code === otp) {
    console.log(`✅ OTP verified for ${identifier}`);
    delete otpStore[identifier];
    return true;
  }
  console.log(`❌ Invalid OTP for ${identifier}. Attempt ${storedOTP.attempts}/3`);
  return false;
};

export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    if (!emailConfig.USER || !emailConfig.PASSWORD) {
      console.error('❌ Email credentials not configured in .env');
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: emailConfig.SERVICE,
      auth: {
        user: emailConfig.USER,
        pass: emailConfig.PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Chattify" <${emailConfig.USER}>`,
      to: email,
      subject: '🔐 Your Chattify Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">💬 Chattify</h1>
          </div>
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333;">Verification Code</h2>
            <p style="color: #666; font-size: 16px;">Your OTP code is:</p>
            <div style="background: #f0f4ff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666;">This code will expire in <strong>${otpConfig.EXPIRY_MINUTES} minutes</strong>.</p>
            <p style="color: #999; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
          <div style="background: #f9f9f9; padding: 15px; text-align: center; color: #999; font-size: 12px;">
            <p>© 2025 Chattify. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return false;
  }
};

setInterval(() => {
  const now = new Date();
  let cleanedCount = 0;
  Object.keys(otpStore).forEach((identifier) => {
    if (now > otpStore[identifier].expiresAt) {
      delete otpStore[identifier];
      cleanedCount++;
    }
  });
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned ${cleanedCount} expired OTP(s)`);
  }
}, 10 * 60 * 1000);