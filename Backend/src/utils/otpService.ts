import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { OTP, OTPStore } from '../types';
import { otpConfig, emailConfig, smsConfig } from './config';

// In-memory OTP storage (Production mein Redis use karein)
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

  console.log(` OTP stored for ${identifier}: ${otp} (expires: ${expiresAt.toLocaleTimeString()})`);
};


export const verifyOTP = (identifier: string, otp: string): boolean => {
  const storedOTP = otpStore[identifier];

  if (!storedOTP) {
    console.log(` No OTP found for ${identifier}`);
    return false;
  }

  if (new Date() > storedOTP.expiresAt) {
    console.log(` OTP expired for ${identifier}`);
    delete otpStore[identifier];
    return false;
  }

  if (storedOTP.attempts >= 3) {
    console.log(` Too many attempts for ${identifier}`);
    delete otpStore[identifier];
    return false;
  }

  storedOTP.attempts++;

  if (storedOTP.code === otp) {
    console.log(` OTP verified for ${identifier}`);
    delete otpStore[identifier];
    return true;
  }

  console.log(` Invalid OTP for ${identifier}. Attempt ${storedOTP.attempts}/3`);
  return false;
};


export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  console.log('');
  console.log(' ========================================');
  console.log('  OTP CODE (COPY THIS FOR TESTING)');
  console.log(`  Email: ${email}`);
  console.log(`  OTP: ${otp}`);
  console.log(`   Valid for: ${otpConfig.EXPIRY_MINUTES} minutes`);
  console.log(' ========================================');
  console.log('');
  
  return true;
};


export const sendOTPSMS = async (phone: string, otp: string): Promise<boolean> => {
  // CONSOLE MODE: Print OTP instead of sending SMS
  console.log('');
  console.log('========================================');
  console.log(' SMS OTP CODE (COPY THIS FOR TESTING)');
  console.log(` Phone: ${phone}`);
  console.log(` OTP: ${otp}`);
  console.log(`  Valid for: ${otpConfig.EXPIRY_MINUTES} minutes`);
  console.log(' ========================================');
  console.log('');
  
  return true;
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