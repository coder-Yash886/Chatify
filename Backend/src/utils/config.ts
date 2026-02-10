import dotenv from 'dotenv';
import { EnvConfig } from '../types';

dotenv.config();

export const config: EnvConfig = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_change_this',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export const otpConfig = {
  EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY_MINUTES || '1', 10),
  LENGTH: parseInt(process.env.OTP_LENGTH || '6', 10),
};

export const emailConfig = {
  SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  USER: process.env.EMAIL_USER || '',
  PASSWORD: process.env.EMAIL_PASSWORD || '',
};

export const smsConfig = {
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
};

if (!process.env.JWT_SECRET && config.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production environment');
}

if (!emailConfig.USER || !emailConfig.PASSWORD) {
  console.warn(' Email credentials not configured. Email OTP will not work.');
}

if (!smsConfig.TWILIO_ACCOUNT_SID || !smsConfig.TWILIO_AUTH_TOKEN) {
  console.warn(' Twilio credentials not configured. SMS OTP will not work.');
}

export default config;